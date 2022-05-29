import json


def get_account(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = handle_options()
    else:
        response = handle_get(event)

    return response


def handle_options():
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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


def handle_get(event):
    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)

    status_code = 401
    body = {'message': 'This account is not verified.'}

    if verified:
        status_code = 200
        body = claims

    return {
        "statusCode": status_code,
        "body": json.dumps(body),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

# to generate api key:
# import secrets
# secrets.token_urlsafe(64)
