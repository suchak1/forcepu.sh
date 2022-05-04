import json


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


def handle_get(event):
    claims = event['requestContext']['authorizer']['claims']
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

    response = {
        "statusCode": 200,
        "body": claims
    }

    if not actually_verified:
        response = {
            "statusCode": 401,
            "body": {'message': 'This account is not verified.'}
            # {'message': 'The incoming token has expired'}
        }

    response['body'] = json.dumps(response['body'])
    return {
        **response,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


def get_protected(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = handle_options()
    else:
        response = handle_get(event)

    return response
