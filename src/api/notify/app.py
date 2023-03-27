import os
import json
import base64
from time import sleep
from multiprocessing import Process, Pipe
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from shared.models import query_by_api_key, UserModel
from datetime import datetime, timedelta, timezone
from pynamodb.attributes import UTCDateTimeAttribute
from shared.utils import \
    verify_user, options, transform_signal, \
    error, enough_time_has_passed, \
    past_date, res_headers


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
    def __init__(self, fx):
        self.fx = fx
        self.total = 0

    def run_process(self, conn):
        while (val := conn.recv()):
            res = self.fx(val)
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
        self.results = {}
        cpus = os.cpu_count()
        print(cpus)
        processes = [self.create_process() for _ in range(cpus)]
        # Don't send 0 otherwise child while loop will end
        [self.process_item(processes[idx % cpus], item)
         for idx, item in enumerate(items)]
        [self.end_process(process) for process in processes]
        return self.results


def notify_user(user):
    alerts = [
        {'fx': notify_email, 'type': 'Email'},
        {'fx': notify_webhook, 'type': 'Webhook'},
        {'fx': notify_sms, 'type': 'SMS'},
    ]
    now = datetime.now(timezone.utc)
    reset_duration = timedelta(hours=12)
    last_notified = user.alerts['last_sent']
    if enough_time_has_passed(last_notified, now, reset_duration):
        for alert in alerts:
            try:
                alert['fx'](user)
            except Exception as e:
                print(f"{alert['type']} alert failed to send for {user.email}")
                print(e)
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
        UserModel.alerts['webhook'] == True
    )
    users_in_beta = UserModel.in_beta_index.query(1, filter_condition=cond)
    processor = Processor(notify_user)
    notified = processor.run(users_in_beta)
    users_subscribed = UserModel.subscribed_index.query(
        1, filter_condition=cond)
    # skip beta users who were already notified
    users_to_notify = skip_users(users_subscribed, notified)
    notified = notified.union(processor.run(users_to_notify))
    num_notified = len(notified)
    total_users = processor.total
    success_ratio = num_notified / total_users if total_users else 1
    if success_ratio < 0.95:
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


def notify_email():
    # verify signals email [dev] and [prod] on SES and use SES! - free for first 64k emails per month
    # disable receiving emails at signals address
    # https://repost.aws/knowledge-center/lambda-send-email-ses
    # https://iamkanikamodi.medium.com/write-a-sample-lambda-to-send-emails-using-ses-in-aws-a2e903d9129e
    # store last notified for each notification type in db
    # user.alerts.email.last_sent
    # don't send if already notified for that signal date
    # or already notified in the last 12 hours if storing full time
    # BCC multiple users / batch?
    # for template, use image of bull or bear based on signal, add green or red arrow?, add btc coin
    # Pictures/bear_bull/bull-and-bear-facing-each-other.jpg
    # Pictures/btc/bitcoin.jpeg
    # use photoshop or gimp to create png w transparent bg
    # template will have dark background (black or #1d1d1d/#1f1f1f) to match site
    # don't use emojis in subject line - bad for click/open rate, looks like spam
    # summarize data from signal (date, day, signal, asset) in sentence or json obj
    # make sure emails have unsubscribe link - link to {dev.}forcepu.sh/alerts?

    # templates
    # https://stripo.email/templates/ > Type > Alerts & Notifications
    # https://beefree.io/templates/notification/
    # https://unlayer.com/templates/something-new
    # https://litmus.com/community/templates/topic/33-e-commerce-templates
    # https://litmus.com/community/templates/topic/34-account-management-templates
    # https://beefree.io/templates/notification/
    # https://unlayer.com/templates > Usage > Notification

    pass


def notify_webhook():
    # RETURN LIST to account for future assets
    # will only be one-item list for now (just BTC)
    pass


def notify_sms():
    pass
