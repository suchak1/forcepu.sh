import json
from shared.models import UserModel
from shared.utils import handle_options, verify_user


def get_account(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = handle_options()
    elif event['httpMethod'].upper() == 'POST':
        response = handle_post(event)
    else:
        response = handle_get(event)

    return response


def handle_get(event):
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


def handle_post(event):
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
