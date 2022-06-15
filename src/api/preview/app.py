import os
import boto3

s3 = boto3.client('s3')


def get_preview(*_):
    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='data/api/preview.json')
    return {
        "statusCode": 200,
        "body": obj['Body'].read(),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
