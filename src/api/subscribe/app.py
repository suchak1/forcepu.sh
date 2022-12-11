import stripe


def post_subscribe(*_):
    stripe.api_key = "sk_test_abc"
    # see if customer exists
    # else create
    stripe.Customer.create(
        email="{{CUSTOMER_EMAIL}}",
        name="{{CUSTOMER_NAME}}",
        shipping={
            "address": {
                "city": "Brothers",
                "country": "US",
                "line1": "27 Fredrick Ave",
                "postal_code": "97712",
                "state": "CA",
            },
            "name": "{{CUSTOMER_NAME}}",
        },
        address={
            "city": "Brothers",
            "country": "US",
            "line1": "27 Fredrick Ave",
            "postal_code": "97712",
            "state": "CA",
        },
    )
    # save customerid to db?
    # new_customer var if not in db

    # if not new customer, update customer - address?

    # process payment
    # if error and new_customer, delete customer?

    return {
        "statusCode": 200,
        "body": 'necessary payment stuff',
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
