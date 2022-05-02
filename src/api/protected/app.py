def get_protected(*_):
    return {
        "statusCode": 200,
        "body": 'This is protected.',
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
