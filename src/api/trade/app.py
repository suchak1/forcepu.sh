import os
import boto3
# import pickle
s3 = boto3.client('s3')


def get_trade(*_):
    # obj = s3.get_object(
    #     Bucket=os.environ['S3_BUCKET'], Key='data/robinhood.pickle')
    home_dir = os.path.expanduser("~")
    data_dir = os.path.join(home_dir, ".tokens")
    pickle_path = os.path.join(data_dir, "robinhood.pickle")
    print(pickle_path)
    # obj = None
    return {
        "statusCode": 200,
        # "body": obj['Body'].read(),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
