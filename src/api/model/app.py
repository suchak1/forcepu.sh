import os
import json
import boto3
import pickle
# import numpy
s3 = boto3.client('s3')


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

# In case read() can't read entire preview json
# bytes_buffer = io.BytesIO()
# s3.download_fileobj(Bucket=bucket_name,
#                     Key='models/latest/metadata.json', Fileobj=bytes_buffer)
# value = json.loads(bytes_buffer.getvalue())


def get_visualization(event, _):
    params = event["queryStringParameters"]
    dims = '2D'
    supported_dims = set(['2D', '3D'])
    if params and 'dims' in params and params['dims'] in supported_dims:
        dims = params['dims']

    data_labels = ['actual', 'centroid', 'radius', 'grid', 'preds']

    data = {
        label:
        (float if label == 'radius' else list)(
            pickle.loads(
                s3.get_object(
                    Bucket=os.environ['S3_BUCKET'],
                    Key=f'models/latest/{dims}/{label}.pkl')['Body'].read()
            )
        ) for label in data_labels
    }
    return {
        "statusCode": 200,
        "body": json.dumps(data),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
