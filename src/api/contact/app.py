import os
import json
from shared.utils import \
    verify_user, options, \
    error, enough_time_has_passed, \
    past_date, res_headers


def handle_contact(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = options()
    else:
        response = post_contact(event)

    return response


def post_contact(event):
    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)

    if not verified:
        return error(401, 'This account is not verified.')

    req_body = json.loads(event['body'])
    if not ('subject' in req_body and req_body['subject']):
        # test if subject does not exists ('' or None or null, key doesn't exist) OR if subject length > 64
        # if any of those are true, throw an error
        pass
    # test if message does not exists ('' or None or null, key doesn't exist) OR if message length > 2500
    # if any of those aer true, throw an error
    email = claims['email']

    status_code = 200
    message = ''
    # ER ACTUALLY USE ERROR fx to send message and test if 4xx error in frontend
    body = json.dumps({'message': message})

    return {
        "statusCode": status_code,
        "body": body,
        "headers": res_headers
    }
