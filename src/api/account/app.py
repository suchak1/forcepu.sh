import os
import json
import secrets
from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.attributes import UnicodeAttribute, MapAttribute, BooleanAttribute


def get_account(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = handle_options()
    else:
        response = handle_get(event)

    return response


def handle_options():
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        }
    }


def verify_user(claims):
    email_verified = claims['email_verified']
    # ['email']
    # ['email_verified']
    # ['name']
    providers = ['Google']
    actually_verified = email_verified == 'true'
    if email_verified == 'false':
        if 'identities' in claims:
            identities = json.loads(claims['identities'])
            # => ['providerName'] == 'Google'
            # => ['providerType'] == 'Google'
            if 'providerName' in identities:
                if identities['providerName'] in providers:
                    actually_verified = True
    return actually_verified


def handle_get(event):
    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)

    status_code = 401
    body = json.dumps({'message': 'This account is not verified.'})

    if verified:
        status_code = 200
        email = claims['email']
        try:
            user = UserModel.get(email)
        except UserModel.DoesNotExist:
            user = UserModel(email)
            user.save()
        body = user.to_json()

    return {
        "statusCode": status_code,
        "body": body,
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


class Permissions(MapAttribute):
    is_admin = BooleanAttribute(default=False)
    is_friend = BooleanAttribute(default=False)


def get_api_key():
    continue_looping = True
    while continue_looping:
        api_key = secrets.token_urlsafe(64)
        query_results = list(UserModel.api_key_index.query(api_key))
        continue_looping = len(query_results)
    return api_key


class APIKeyIndex(GlobalSecondaryIndex):
    """
    This class represents a global secondary index
    """
    class Meta:
        # index_name is optional, but can be provided to override the default name
        index_name = 'api_key_index'
        # All attributes are projected
        projection = AllProjection()

    # This attribute is the hash key for the index
    # Note that this attribute must also exist
    # in the model
    api_key = UnicodeAttribute(hash_key=True)


class UserModel(Model):
    """
    A DynamoDB User
    """
    class Meta:
        table_name = os.environ['TABLE_NAME']
    email = UnicodeAttribute(hash_key=True)
    api_key = UnicodeAttribute(default=get_api_key)
    permissions = MapAttribute(attr_name="permissions", default=Permissions)
    api_key_index = APIKeyIndex()
