import os
import json
import boto3

s3 = boto3.client('s3')


def get_hyper(*_):
    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='data/api/hyper.json')
    return {
        "statusCode": 200,
        "body": obj['Body'].read(),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


def get_holding(*_):
    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='data/api/holding.json')
    return {
        "statusCode": 200,
        "body": obj['Body'].read(),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
