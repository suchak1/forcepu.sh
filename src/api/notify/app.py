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
    # verify signals email [dev] and [prod] on SES and use SES! - free for first 64k emails per month
    # store last notified for each notification type in db
    # user.notifications.email.last_time
    # don't send if already notified for that signal date
    # or already notified in the last 12 hours if storing full time
    # BCC multiple users / batch?
    # make sure emails have unsubscribe link - link to forcepu.sh/alerts?
    pass


def notify_webhook():
    # RETURN LIST to account for future assets
    # will only be one-item list for now (just BTC)
    pass


def notify_sms():
    pass
