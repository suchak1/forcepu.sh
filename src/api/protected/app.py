def get_protected(*_):
    return {
        "statusCode": 200,
        "body": _,
        # event.requestContext.authorizer,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
