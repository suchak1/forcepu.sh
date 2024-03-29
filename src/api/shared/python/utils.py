import os
import json
from datetime import datetime, timezone

RES_HEADERS = {"Access-Control-Allow-Origin": "*"}

PAST_DATE = datetime(2020, 1, 1, tzinfo=timezone.utc)
DATE_FMT = '%Y-%m-%d'
TEST = str(os.environ.get('TEST')).lower() == 'true'


def get_email(user, env):
    return f"{user}@{'dev.' if env == 'dev' else ''}forcepu.sh"


def transform_signal(raw_signal):
    signal = {}
    date = raw_signal['Time']
    if type(date) == list:
        date = date[0]

    sig = raw_signal['Sig']
    if type(sig) == list:
        sig = sig[0]
    if type(sig) == str:
        sig = sig.lower() == 'true'
    sig = 'BUY' if sig else 'SELL'

    signal['Date'] = date
    signal['Signal'] = sig
    signal['Day'] = datetime.strptime(date, DATE_FMT).strftime('%A')[:3]
    signal['Asset'] = 'BTC'
    return signal


def enough_time_has_passed(start, end, delta):
    return end - start >= delta


def error(status, message):
    return {
        "statusCode": status,
        "body": json.dumps(
            {'message': message}
        ),
        "headers": RES_HEADERS
    }


def options():
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT,DELETE",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key"
        }
    }


def verify_user(claims):
    # email_verified value comes back as str, so explicitly casting as str
    # in case it comes back as bool in the future
    email_verified = str(claims['email_verified']).lower()
    # ['email']
    # ['email_verified']
    # ['name']
    providers = ['Google', 'Facebook', 'LoginWithAmazon']
    actually_verified = email_verified == 'true'
    if email_verified == 'false':
        if 'identities' in claims:
            identities = json.loads(claims['identities'])
            # => ['providerName'] == 'Google'
            # => ['providerType'] == 'Google'
            if 'providerName' in identities:
                if identities['providerName'] in providers:
                    actually_verified = True
    return actually_verified
