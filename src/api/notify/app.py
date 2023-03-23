import os
import json
import base64
from time import sleep
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
    # create batches of 100 or 1000 users
    # don't use page iter! too much work and can mess up deserialization
    # just use result iter and for loop if need batching
    # use multiprocessing for aws lambda
    # https://pypi.org/project/lambda-multiprocessing/
    # https://blog.ruanbekker.com/blog/2019/02/19/parallel-processing-on-aws-lambda-with-python-using-multiprocessing/
    # https://aws.amazon.com/blogs/compute/parallel-processing-in-python-with-aws-lambda/
    # https://medium.com/tech-carnot/understanding-multiprocessing-in-aws-lambda-with-python-6f50c11d57e4
    # https://stackoverflow.com/questions/56329799/how-to-emulate-multiprocessing-pool-map-in-aws-lambda
    # https://stackoverflow.com/questions/63628262/python-3-asyncio-with-aioboto3-seems-sequential/63633248#63633248
    # use pool imap for iterator
    # https://stackoverflow.com/a/44502827
    # use max timeout for lambda to avoid timing out
    # use 10gb (10,240 MB) for max cpu
    # try:
    #     notify_email
    # except:
    #     log

    # try:
    #     notify_webhook
    # except:
    #     log

    status_code = 200
    response = {['message']: f'Notifications delivered.'}
    body = json.dumps(response)
    return {
        "statusCode": status_code,
        "body": body,
        "headers": res_headers
    }


def notify_email():
    # use multiprocessing
    # verify signals email [dev] and [prod] on SES and use SES! - free for first 64k emails per month
    # https://repost.aws/knowledge-center/lambda-send-email-ses
    # https://iamkanikamodi.medium.com/write-a-sample-lambda-to-send-emails-using-ses-in-aws-a2e903d9129e
    # store last notified for each notification type in db
    # user.notifications.email.last_sent
    # don't send if already notified for that signal date
    # or already notified in the last 12 hours if storing full time
    # BCC multiple users / batch?
    # for template, use image of bull or bear based on signal, add green or red arrow?, add btc coin
    # Pictures/bear_bull/bull-and-bear-facing-each-other.jpg
    # Pictures/btc/bitcoin.jpeg
    # use photoshop or gimp to create png w transparent bg
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
