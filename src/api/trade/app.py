import os
import boto3
import pyotp
from pathlib import Path
import robin_stocks.robinhood as rh
from botocore.exceptions import ClientError
# import pickle
s3 = boto3.resource('s3')


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


def get_trade(*_):
    rh = login()
    print(rh.build_holdings())

    return {
        "statusCode": 200,
        # "body": obj['Body'].read(),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
