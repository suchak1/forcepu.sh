import os
import json
import boto3
from datetime import datetime, timedelta, timezone
from shared.models import query_by_api_key, UserModel
from shared.utils import handle_options

s3 = boto3.client('s3')

headers = {"Access-Control-Allow-Origin": "*"}

def get_signals(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = handle_options()
    else:
        response = handle_get(event)

    return response


def unauthorized_error(message):
    return {
        "statusCode": 403,
        "body": json.dumps(
            {'message': message}
        ),
        "headers": headers
    }

def enough_time_has_passed(start, end, delta):
    return end - start >= delta

def handle_get(event):
    # first get user by api key
    api_key = event['headers']['x-api-key']
    user = query_by_api_key(api_key)[0]

    # if in beta:
    if user.permissions.in_beta:
        #   hit verify_api_key endpoint
        #   if not verified (error response):
        #       add key to usage plan
        pass
    # if not in_beta:
    else:
        #   hit verify_api_key endpoint (dummy endpoint connected to usage plan, pass headers on from this fx)
        #   AND hit stripe subscription endpoint
        #       if verified (simple ok response) but not active sub:
        #           remove key from usage plan
        #           error out as 403, inactive subscription / renew sub
        #       elif not verified (error response) but active sub:
        #           add key to usage plan
        #       elif not verified and not active:
        #           error out as 403, This endpoint is for subscribers only.
        return unauthorized_error('This endpoint is for subscribers only.')
    # proceed

    # Notes: Instead of using usage plan,
    # store list of last 5 access times
    access_queue = user.access_queue
    max_accesses = 5
    duration_days = 1
    reset_duration = timedelta(days=duration_days)
    now = datetime.now(timezone.utc)
    quota_reached = False

    # Update access queue
    if len(user.access_queue) >= max_accesses:
        start = access_queue[-max_accesses]
        if enough_time_has_passed(start, now, reset_duration):
            access_queue = access_queue[-max_accesses + 1:] + [now]
        else:
            access_queue = access_queue[-max_accesses:]
            quota_reached = True
    else:
        access_queue += [now]

    # Update user model in db with new access_queue
    user.update(actions=[UserModel.access_queue.set(access_queue)])
    if quota_reached:
        return unauthorized_error(
            f'You have reached your quota of {max_accesses} requests / {duration_days} day(s).'
        )
    
    # Find out how many requests are left
    remaining = 0
    for access in access_queue:
        if enough_time_has_passed(access, now, reset_duration):
            remaining += 1
        else:
            break
    # This is to cover the case that len(access_queue) < max_accesses
    remaining += max_accesses - len(access_queue)

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
        "headers": headers
    }


# client.create_usage_plan_key(
#     usagePlanId='12345',
#     keyId='[API_KEY_ID]',
#     keyType='API_KEY'
# )
