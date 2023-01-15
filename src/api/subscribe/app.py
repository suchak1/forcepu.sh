import os
import json
import stripe
from shared.models import UserModel
from shared.utils import verify_user, options, error, res_headers

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
        "headers": res_headers
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
        "headers": res_headers
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

    if not verified:
        return error(401, 'This account is not verified.')

    req_body = json.loads(event['body'])
    price_id = req_body['price_id']
    email = claims['email']
    req_headers = event['headers']
    origin = req_headers['origin']

    # Get customerId from user.stripe {} obj
    user = UserModel.get(email)
    stripe_lookup = user.stripe
    customer_id = stripe_lookup.customer_id

    if customer_id:
        # check if user has active subscription to product
        # if so, throw error saying already subscribed
        # customer = stripe.Customer.retrieve(
        #     customer_id, expand=['subscriptions']
        # )
        if not stripe_lookup.subscription_active:
            return error(400, 'User is already subscribed.')
            # use product_id or name that is passed in
            # don't take price_id from req, use from backend (make get /subscribe endpoint w all prices, products)
            # e.g. { BTC: productId: xxx, priceId: yyy }
            # should this be a table created and updated on deploy?
            # prices table - priceId, cost, interval_count, interval
            # or create table thru template.yaml and on first GET /price for a given priceId,
            # pull from stripe if doesn't exist in db, else pull script from db
            # webhooks for price changes ? updates/deletions/creations
            # use webhooks to manage subscription active state in users db

            # create checkout session table
            # That way, api can return existing session instead of creating new one.
            # Unexpire session? - but would have to manage prices make sure current priceid

            # Batch queue for Stripe calls of same type?
            # batch all get price calls from last second into same Stripe call?

            # If it doesn't exist, then create customer and save id to db
    else:
        name = claims['name']
        customer = stripe.Customer.create(email=email, name=name)
        customer_id = customer['id']
        stripe_lookup.customer_id = customer_id
        user.update(actions=[UserModel.stripe.set(stripe_lookup)])

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
        "headers": res_headers
    }


def post_billing(*_):
    # create customer portal session
    # (where customer can cancel, change payment method, see payment history, etc)
    # find a way of embedding html directly into right side or modal
    # vs just redirect to stripe hosted (?) customer portal page
    pass


def post_subscribe(event, _):
    webhook_secret = os.environ['STRIPE_WEBHOOK_SECRET']
    req_body = event['body']
    req_headers = event['headers']
    signature = req_headers['Stripe-Signature']
    print(req_body)
    print(signature[0:3])
    print(webhook_secret[0:3])
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
        "headers": res_headers
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
