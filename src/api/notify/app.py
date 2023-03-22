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
    verify_user, options, \
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
    salt = os.environ['SALT']
    # first get user by api key
    req_headers = event['headers']
    if 'emit_secret' not in req_headers:
        sleep(10)
        return error(401, 'Provide a valid emit secret.')
    encrypted = req_headers['emit_secret']
    cryptographer = Cryptographer(password, salt)
    if not cryptographer.decrypt(encrypted) == emit_secret:
        sleep(10)
        return error(401, 'Provide a valid emit secret.')

    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='models/latest/signals.csv')

    days_in_a_week = 7
    lines = [line.decode('utf-8') for line in list(obj['Body'].iter_lines())]
    header = lines[0]
    rows = lines[-days_in_a_week:]
    keys = header.split(',')

    response = {'message': None, 'data': []}
    for row in rows:
        cols = row.split(',')
        item = {}
        for idx, col in enumerate(cols):
            key = keys[idx]
            if key == 'Time':
                key = 'Date'
            elif key == 'Sig':
                key = 'Signal'
            item[key] = col
        item['Day'] = datetime.strptime(
            item['Date'], '%Y-%m-%d').strftime('%A')[:3]
        item['Signal'] = 'BUY' if item['Signal'] == 'True' else 'SELL'
        item['Asset'] = 'BTC'
        response['data'].append(item)
    # Time -> Date
    # Sig -> Signal

    # schema is list from oldest to newest
    # 1 week - 7 items
    # each item {Date: 2022-06-23, Day: Mon, Tue, (3 letter slice) Signal: BUY or SELL}
    # obj['Body'].read()
    status_code = 200
    response['message'] = f'You have {remaining} requests left / {duration_days} day(s).'
    body = json.dumps(response)
    return {
        "statusCode": status_code,
        "body": body,
        "headers": res_headers
    }


def notify_email():
    pass


def notify_webhook():
    pass


def notify_sms():
    pass
