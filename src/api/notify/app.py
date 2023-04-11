import os
import json
import boto3
import base64
import requests
from time import sleep
from cryptography.fernet import Fernet
from multiprocessing import Process, Pipe
from botocore.exceptions import ClientError
from datetime import datetime, timedelta, timezone
from pynamodb.attributes import UTCDateTimeAttribute
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from shared.models import UserModel
from shared.utils import \
    options, transform_signal, \
    error, enough_time_has_passed, \
    res_headers


class Cryptographer:
    def __init__(self, password, salt):
        kdf = Scrypt(
            salt=salt,
            length=32,
            n=2**14,
            r=8,
            p=1,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        self.f = Fernet(key)

    def encrypt(self, plaintext):
        return self.f.encrypt(plaintext)

    def decrypt(self, ciphertext):
        return self.f.decrypt(ciphertext)


def handle_notify(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = options()
    else:
        response = post_notify(event)

    return response


class Processor:
    def __init__(self, fx, data):
        self.fx = fx
        self.data = data
        self.total = 0

    def run_process(self, conn):
        while (val := conn.recv()):
            res = self.fx(val, self.data)
            conn.send(res)

    def await_process(self, process):
        if process['awaiting']:
            result = process['conn'].recv()
            self.results.append(result)
            process['awaiting'] = False

    def end_process(self, process):
        self.await_process(process)
        process['conn'].send(None)
        process['process'].join()

    def process_item(self, process, item):
        self.total += 1
        self.await_process(process)
        process['conn'].send(item)
        process['awaiting'] = True

    def create_process(self):
        # create a pipe for communication
        parent_conn, child_conn = Pipe(duplex=True)
        # create the process, pass instance and connection
        process = Process(target=self.run_process, args=(child_conn,))
        enhanced = {'process': process, 'conn': parent_conn, 'awaiting': False}
        process.start()
        return enhanced

    def run(self, items):
        self.results = []
        cpus = os.cpu_count()
        print(cpus)
        processes = [self.create_process() for _ in range(cpus)]
        # Don't send 0 otherwise child while loop will end
        [self.process_item(processes[idx % cpus], item)
         for idx, item in enumerate(items)]
        [self.end_process(process) for process in processes]
        return self.results


def notify_user(user, signal):
    alerts = [
        {'fx': notify_email, 'type': 'Email'},
        {'fx': notify_webhook, 'type': 'Webhook'},
        {'fx': notify_sms, 'type': 'SMS'},
    ]
    now = datetime.now(timezone.utc)
    reset_duration = timedelta(hours=12)
    last_notified = user.alerts['last_sent']
    success = True
    if enough_time_has_passed(last_notified, now, reset_duration):
        for alert in alerts:
            try:
                alert['fx'](user, signal)
            except Exception as e:
                print(f"{alert['type']} alert failed to send for {user.email}")
                print(e)
                success = False
        alerts = user.alerts
        now = datetime.now(timezone.utc)
        alerts['last_sent'] = UTCDateTimeAttribute(now)
        # UTCDateTimeAttribute().serialize(now)
        user.update(actions=[UserModel.alerts.set(alerts)])
        if success:
            return user.email


def skip_users(users, to_skip):
    for user in users:
        if user.email not in to_skip:
            yield user


def post_notify(event):
    salt = os.environ['SALT'].encode('UTF-8')
    password = os.environ['CRYPT_PASS'].encode('UTF-8')
    emit_secret = os.environ['EMIT_SECRET']

    req_headers = event['headers']
    header = 'emit_secret'
    encrypted = req_headers[header] if header in req_headers else ''
    cryptographer = Cryptographer(password, salt)
    try:
        decrypted = cryptographer.decrypt(encrypted).decode('UTF-8')
        if not decrypted == emit_secret:
            raise Exception()
    except:
        sleep(10)
        return error(401, 'Provide a valid emit secret.')
    req_body = json.loads(event['body'])
    signal = transform_signal(req_body)
    cond = (
        UserModel.alerts['email'] == True
    ) | (
        UserModel.alerts['sms'] == True
    ) | (
        UserModel.alerts['webhook'] != ""
    )
    users_in_beta = UserModel.in_beta_index.query(1, filter_condition=cond)
    processor = Processor(notify_user, signal)
    processor.signal = signal
    notified = set(processor.run(users_in_beta))
    users_subscribed = UserModel.subscribed_index.query(
        1, filter_condition=cond)
    # skip beta users who were already notified
    users_to_notify = skip_users(users_subscribed, notified)
    notified = notified.union(set(processor.run(users_to_notify)))
    num_notified = len(notified)
    total_users = processor.total
    success_ratio = num_notified / total_users if total_users else 1
    if success_ratio < 0.95:
        # threshold is dependent on successful email AND webhook notifications
        # it's possible that users misconfigure webhook / don't send 2xx response
        # change user alerts schema so user.alerts.webhook.url and user.alerts.webhook.queue
        # disable webhook after 5-10 misconfigured requests
        # but also make test route and btn, so users can try out
        # in POST /account, test if url is being set to "", if so, then also reset queue
        return error(500, 'Notifications failed to send.')

    # check that memory and timeout are being respected - print os.cpu_count()
    # query in beta and/or sub index - time is 10s for 100k users (1s/10k users)
    # can decrease query time by using 4-6 indices instead of 2
    # 1. in_beta partition, notify_email range
    # 2. in_beta partition, notify_webhook range
    # 3. subscribed partition, notify_email range
    # 4. subscribed partition, notify_webhook range
    # etc for notify_sms

    status_code = 200
    response = {['message']: f'Notifications delivered.'}
    body = json.dumps(response)
    return {
        "statusCode": status_code,
        "body": body,
        "headers": res_headers
    }


def notify_email(user, signal):
    sender = os.environ['SIGNAL_EMAIL']
    recipient = user.email
    region = 'us-east-1'
    charset = 'UTF-8'
    client = boto3.client('sesv2', region_name=region)
    try:
        client.send_email(
            Destination={
                'ToAddresses': [
                    recipient,
                ],
            },
            Content={
                'Simple': {
                    'Body': {
                        'Html': {
                            'Charset': charset,
                            'Data': BODY_HTML,
                        },
                        'Text': {
                            'Charset': charset,
                            'Data': BODY_TEXT,
                        },
                    },
                    'Subject': {
                        'Charset': charset,
                        'Data': SUBJECT,
                    },
                }
            },
            FromEmailAddress=sender,
            # If you are not using a configuration set, comment or delete the
            # following line
        )
    # verify signals email [dev] and [prod] on SES and use SES! - free for first 64k emails per month
    # disable receiving emails at signals address
    # https://repost.aws/knowledge-center/lambda-send-email-ses
    # https://iamkanikamodi.medium.com/write-a-sample-lambda-to-send-emails-using-ses-in-aws-a2e903d9129e

    # BCC multiple users / batch?
    # for template, use image of bull or bear based on signal, add green or red arrow?, add btc coin
    # Pictures/bear_bull/bull-and-bear-facing-each-other.jpg
    # Pictures/btc/bitcoin.jpeg
    # use photoshop or gimp to create png w transparent bg
    # use dall-e 2 for images or for inspo
    # prompts - a bull/bear biting/chewing/holding a bitcoin in the style of vaporwave/anime
    # template will have dark background (black or #1d1d1d/#1f1f1f) to match site
    # don't use emojis in subject line - bad for click/open rate, looks like spam
    # summarize data from signal (date, day, signal, asset) in sentence or json obj
    # make sure emails have unsubscribe link - link to {dev.}forcepu.sh/alerts?
    # use free wysiwyg html editor - online version that allows collaboration
    # send halie a google doc with all the email design reqs - or we collaborate in figma

    # templates
    # https://stripo.email/templates/type/notice/
    # https://beefree.io/templates/notification/
    # https://unlayer.com/templates/something-new
    # https://litmus.com/community/templates/topic/33-e-commerce-templates
    # https://litmus.com/community/templates/topic/34-account-management-templates
    # https://beefree.io/templates/notification/
    # https://unlayer.com/templates > Usage > Notification

    # Use canva (maybe not since no native html), unlayer, or postmarkapp to design, then export as HTML

    # Must submit request to move out of sandbox
    # https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html

    except ClientError as e:
        print(e.response['Error']['Message'])
        raise e


def notify_webhook(user, signal):

    url = user.alerts['webhook']
    if not url:
        return
    # Use user's API Key in header to authenticate
    headers = {"X-API-Key": user.api_key}
    # RETURN LIST to account for future assets
    # will only be one-item list for now (just BTC)
    data = [signal]
    response = requests.post(url, json=data, headers=headers)
    if not response.ok:
        # send error log for webhook res
        raise Exception('Webhook did not return 2xx response.')
    # else:
    # send log for webhook res success


def notify_sms():
    pass
