import os
import json
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


def get_model(*_):
    obj = s3.get_object(
        Bucket=os.environ['S3_BUCKET'], Key='models/latest/metadata.json')
    metadata = json.loads(obj['Body'].read())
    metadata['num_features'] = len(metadata['features'])
    allowed_fields = ['created', 'start', 'end', 'num_features', 'accuracy']
    metadata = {key: metadata[key] for key in allowed_fields}
    return {
        "statusCode": 200,
        "body": json.dumps(metadata),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


# bytes_buffer = io.BytesIO()
# s3.download_fileobj(Bucket=bucket_name,
#                     Key='models/latest/metadata.json', Fileobj=bytes_buffer)
# value = json.loads(bytes_buffer.getvalue())
