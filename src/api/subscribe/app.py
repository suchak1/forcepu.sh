import os
import json
import stripe
from shared.utils import verify_user

stripe.api_key = os.environ['STRIPE_SECRET_KEY']


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


def get_product(event, _):
    params = event["queryStringParameters"]
    product_id = params["id"]
    product = stripe.Product.retrieve(product_id)
    status_code = 200
    body = json.dumps(product)
    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


def post_checkout(event, _):
    # TODO: IMPLEMENT FRAUD DETECTION for Checkout
    # e.g. require full billing address, CVC, ??
    # https://stripe.com/docs/radar/integration#recommendations

    # TODO: figure out 3DS Secure 2 and Chargeback Protection
    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)

    status_code = 401
    body = json.dumps({'message': 'This account is not verified.'})

    if verified:
        req_body = json.loads(event['body'])
        price_id = req_body['price_id']
        email = claims['email']
        req_headers = event['headers']
        print(req_headers)
        origin = req_headers['origin']

        session = stripe.checkout.Session.create(
            customer_email=email,
            # use url (domain/subscription) from req.origin?
            success_url=f'{origin}/subscription?success=true&session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{origin}/subscription?canceled=true',
            mode='subscription',
            line_items=[{
                'price': price_id,
                # For metered billing, do not pass quantity
                'quantity': 1
            }],
            automatic_tax={
                'enabled': True
            },
        )
        status_code = 200
        body = json.dumps(session)
    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


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
