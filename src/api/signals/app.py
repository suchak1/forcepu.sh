import os
import boto3

s3 = boto3.client('s3')


def get_signals(*_):
    # first check api key and get user
    # if not in_beta:
    #   hit verify_api_key endpoint (dummy endpoint connected to usage plan)
    #   AND hit stripe subscription endpoint
    #       if verified (simple ok response) but not active sub:
    #           remove key from usage plan
    #           error out as inactive subscription / renew sub
    #       elif not verified (error response) but active sub:
    #           add key to usage plan
    #       elif not verified and not active:
    #           error out as This endpoint is for subscribers only.
    #
    #   proceed

    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='models/latest/signals.csv')

    # schema is list from oldest to newest
    # 1 week - 7 items
    # each item {Date: 2022-06-23, Day: Mon, Tue, (3 letter slice) Signal: BUY or SELL}
    #
    return {
        "statusCode": 200,
        "body": obj['Body'].read(),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


# client.create_usage_plan_key(
#     usagePlanId='12345',
#     keyId='[API_KEY_ID]',
#     keyType='API_KEY'
# )
