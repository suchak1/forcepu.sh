def get_protected(event):
    return {
        "statusCode": 200,
        "body": event.requestContext.authorizer,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
