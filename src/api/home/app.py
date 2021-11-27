import os
import json
import boto3

s3 = boto3.client('s3')


def get_hyper(*_):
    obj = s3.get_object(
        Bucket=os.environment['S3_BUCKET'], Key='data/api/hyper.json')
    res = obj['Body'].read()
    data = json.loads(res)
    return {
        "statusCode": 200,
        "body": data,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


def get_holding(*_):
    obj = s3.get_object(
        Bucket=os.environment['S3_BUCKET'], Key='data/api/holding.json')
    res = obj['Body'].read()
    data = json.loads(res)
    return {
        "statusCode": 200,
        "body": data,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
