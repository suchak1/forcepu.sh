import os
import json
import boto3
from datetime import datetime, timedelta, timezone
from models.user import query_by_api_key, UserModel

s3 = boto3.client('s3')

headers = {"Access-Control-Allow-Origin": "*"}


def unauthorized_error(message):
    return {
        "statusCode": 403,
        "body": json.dumps(
            {'message': message}
        ),
        "headers": headers
    }


def get_signals(event, _):
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

    # Notes: instead of using usage plan,
    # store list of last 5 access times
    access_queue = user.access_queue
    max_accesses = 5
    duration_days = 1
    reset_duration = timedelta(days=duration_days)
    now = datetime.now(timezone.utc)
    quota_reached = False
    # if len(access_queue) >= 5:
    if len(user.access_queue) >= max_accesses:
        #   if now - access_queue[0] >= 1 day:
        if now - access_queue[-max_accesses] >= reset_duration:
            #       access_queue = access_queue[1:5] + [curr time]
            access_queue = access_queue[-max_accesses + 1:] + [now]
    #   else:
        else:
            #       access_queue = access_queue[-5:]
            access_queue = access_queue[-max_accesses:]
            quota_reached = True
    #       return error
    else:
        access_queue += [now]

    # update user model in db with new access_queue
    user.update(actions=[UserModel.access_queue.set(access_queue)])
    if quota_reached:
        return unauthorized_error(
            f'You have reached your quota of {max_accesses} requests / {duration_days} day(s).'
        )

    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='models/latest/signals.csv')

    days_in_a_week = 7
    lines = [line.decode('utf-8') for line in list(obj['Body'].iter_lines())]
    header = lines[0]
    rows = lines[-days_in_a_week:]
    keys = header.split(',')

    response = []
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
        response.append(item)
    # Time -> Date
    # Sig -> Signal

    # schema is list from oldest to newest
    # 1 week - 7 items
    # each item {Date: 2022-06-23, Day: Mon, Tue, (3 letter slice) Signal: BUY or SELL}
    # obj['Body'].read()
    status_code = 200
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
