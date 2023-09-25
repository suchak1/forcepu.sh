import os
import json
import boto3
import pyotp
from pathlib import Path
import robin_stocks.robinhood as rh
from botocore.exceptions import ClientError
from utils import \
    verify_user, options
# error, RES_HEADERS, get_email, TEST
# import pickle
s3 = boto3.resource('s3')


def handle_trade(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = options()
    # elif event['httpMethod'].upper() == 'POST':
    #     response = post_account(event)
    # elif event['httpMethod'].upper() == 'DELETE':
    #     response = delete_account(event)
    else:
        response = get_trade(event)

    return response


def login():
    auth_filename = 'robinhood.pickle'
    auth_path = os.path.join(os.path.expanduser("~"), '.tokens', auth_filename)
    key = f'data/{auth_filename}'
    try:
        Path(auth_path).parent.mkdir(parents=True, exist_ok=True)
        with open(auth_path, 'wb') as file:
            bucket = s3.Bucket(os.environ['S3_BUCKET'])
            bucket.download_fileobj(key, file)
            print('Loaded auth file from S3.')
    except ClientError:
        print('Could not load auth file from S3.')
        os.remove(auth_path)
    username = os.environ['RH_USERNAME']
    password = os.environ['RH_PASSWORD']
    mfa_code = pyotp.TOTP(os.environ['RH_2FA']).now()
    rh.login(username, password, mfa_code=mfa_code)
    if os.path.exists(auth_path):
        bucket.upload_file(auth_path, key)
        print('Saved auth file to S3.')
    return rh


def get_trade(event):
    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)
    print('claims', claims)

    status_code = 401
    body = json.dumps({'message': 'This account is not verified.'})

    if verified and claims['email'] == os.environ['RH_USERNAME']:
        rh = login()
        body = json.dumps(rh.build_holdings())
        status_code = 200

    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
