import os
import json
import stripe
from shared.models import UserModel
from shared.utils import verify_user, options

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


def handle_checkout(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = options()
    else:
        response = post_checkout(event)

    return response


def post_checkout(event):
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
        origin = req_headers['origin']

        # Get customerId from user.stripe {} obj
        user = UserModel.get(email)
        stripe_lookup = user.stripe
        customer_id = stripe_lookup.customer_id

        # If it doesn't exist, then create customer and save id to db
        if not customer_id:
            name = claims['name']
            customer = stripe.Customer.create(email=email, name=name)
            customer_id = customer['id']
            stripe_lookup.customer_id = customer_id
            user.update(actions=[UserModel.stripe.set(stripe_lookup)])

        # check if user has active subscription to product
        # if so, throw error saying already subscribed

        # use customerId in checkout session create call below
        session = stripe.checkout.Session.create(
            customer=customer_id,
            customer_update={'address': 'auto', 'name': 'auto'},
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
            # specify terms of service agreement?
            # consent_collection.terms_of_service
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


def post_subscribe(event, _):
    webhook_secret = os.environ['STRIPE_WEBHOOK_SECRET']
    req_body = json.loads(event['body'])
    req_headers = event['headers']
    signature = req_headers['Stripe-Signature']
    try:
        event = stripe.Webhook.construct_event(
            req_body, signature, webhook_secret)
    except ValueError as e:
        # Invalid payload
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise e

    event_type = event['type']
    print(event)
    body = json.dumps({'status': 'success'})
    return {
        "statusCode": 200,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

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
