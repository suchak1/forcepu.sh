import json
from datetime import datetime, timezone

res_headers = {"Access-Control-Allow-Origin": "*"}

past_date = datetime(2020, 1, 1, tzinfo=timezone.utc)


def enough_time_has_passed(start, end, delta):
    return end - start >= delta


def error(status, message):
    return {
        "statusCode": status,
        "body": json.dumps(
            {'message': message}
        ),
        "headers": res_headers
    }


def options():
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key"
        }
    }


def verify_user(claims):
    email_verified = claims['email_verified']
    # ['email']
    # ['email_verified']
    # ['name']
    providers = ['Google']
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
