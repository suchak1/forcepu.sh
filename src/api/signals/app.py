import os
import json
import boto3
from datetime import datetime, timedelta, timezone
from shared.models import query_by_api_key, UserModel
from shared.utils import options, error, enough_time_has_passed, res_headers

s3 = boto3.client('s3')


def handle_signals(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = options()
    else:
        response = get_signals(event)

    return response


def get_signals(event):
    # first get user by api key
    req_headers = event['headers']
    if 'x-api-key' not in req_headers:
        return error(401, 'Provide a valid API key.')
    api_key = req_headers['x-api-key']
    query_results = query_by_api_key(api_key)
    if not query_results:
        return error(401, 'Provide a valid API key.')
    user = query_results[0]

    if not (user.permissions.in_beta or user.stripe.subscription['active']):
        return error(402, 'This endpoint is for subscribers only.')

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
        return error(403,
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
        "headers": res_headers
    }


# client.create_usage_plan_key(
#     usagePlanId='12345',
#     keyId='[API_KEY_ID]',
#     keyType='API_KEY'
# )
