import os
import json
import stripe

stripe.api_key = os.environ['StripeSecretKey']


def get_price(event, _):
    params = event["queryStringParameters"]
    price_id = params["id"]
    price = stripe.Price.retrieve(price_id)
    status_code = 200
    body = json.dumps(price)
    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
    return price


def post_checkout(*_):
    # use auto tax
    # use trial period
    # mode: subscription
    pass


def post_billing(*_):
    # create customer portal session
    # (where customer can cancel, change payment method, see payment history, etc)
    # find a way of embedding html directly into right side or modal
    # vs just redirect to stripe hosted (?) customer portal page
    pass
# def post_subscribe(*_):
    # handle webhooks

#     stripe.api_key = "sk_test_abc"
#     # see if customer exists
#     # else create
#     stripe.Customer.create(
#         email="{{CUSTOMER_EMAIL}}",
#         name="{{CUSTOMER_NAME}}",
#         shipping={
#             "address": {
#                 "city": "Brothers",
#                 "country": "US",
#                 "line1": "27 Fredrick Ave",
#                 "postal_code": "97712",
#                 "state": "CA",
#             },
#             "name": "{{CUSTOMER_NAME}}",
#         },
#         address={
#             "city": "Brothers",
#             "country": "US",
#             "line1": "27 Fredrick Ave",
#             "postal_code": "97712",
#             "state": "CA",
#         },
#     )
#     # save customerid to db?
#     # new_customer var if not in db

#     # if not new customer, update customer - address?

#     # process payment
#     # if error and new_customer, delete customer?

#     return {
#         "statusCode": 200,
#         "body": 'necessary payment stuff',
#         "headers": {"Access-Control-Allow-Origin": "*"}
#     }
