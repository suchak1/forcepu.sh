import json
from shared.models import UserModel
from shared.utils import options, verify_user


def handle_account(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = options()
    elif event['httpMethod'].upper() == 'POST':
        response = post_account(event)
    else:
        response = get_account(event)

    return response


def get_account(event):
    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)

    status_code = 401
    body = json.dumps({'message': 'This account is not verified.'})

    if verified:
        status_code = 200
        email = claims['email']
        try:
            user = UserModel.get(email)
        except UserModel.DoesNotExist:
            user = UserModel(email)
            user.save()
        body = user.to_json()

    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


def post_account(event):
    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)

    status_code = 401
    body = json.dumps({'message': 'This account is not verified.'})

    if verified:
        status_code = 200
        email = claims['email']
        user = UserModel.get(email)
        req_body = json.loads(event['body'])
        if 'permissions' in req_body and 'read_disclaimer' in req_body['permissions'] and req_body['permissions']['read_disclaimer']:
            user.permissions.read_disclaimer = True
            user.update(
                actions=[UserModel.permissions.set(user.permissions)])
        body = user.to_json()

    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
