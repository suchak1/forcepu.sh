import os
import json
import boto3
from datetime import datetime, timedelta
from models.user import query_by_api_key

s3 = boto3.client('s3')


def get_signals(event, _):
    # first get user by api key
    api_key = event['headers']['x-api-key']
    user = query_by_api_key(api_key)[0]

    status_code = 200
    body = ''

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
        status_code = 403
        body = json.dumps(
            {'message': 'This endpoint is for subscribers only.'})

    # proceed

    # Notes: instead of using usage plan,
    # store list of last 5 access times
    access_queue = user.access_queue
    max_accesses = 5
    reset_duration = timedelta(days=1)
    # if len(access_queue) >= 5:
    if len(user.access_queue) >= max_accesses:
        #   if now - access_queue[0] >= 1 day:
        now = datetime.utcnow()
        if now - access_queue[0] >= reset_duration:
            #       access_queue = access_queue[1:5] + [curr time]
            access_queue = access_queue[1:5] + [now]
    #   else:
        else:
            #       access_queue = access_queue[-5:]
            access_queue = access_queue[-5:]
    #       return error

    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='models/latest/signals.csv')

    # schema is list from oldest to newest
    # 1 week - 7 items
    # each item {Date: 2022-06-23, Day: Mon, Tue, (3 letter slice) Signal: BUY or SELL}
    # obj['Body'].read()
    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


# client.create_usage_plan_key(
#     usagePlanId='12345',
#     keyId='[API_KEY_ID]',
#     keyType='API_KEY'
# )
