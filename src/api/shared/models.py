import os
import secrets
from datetime import datetime, timezone
from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.attributes import UnicodeAttribute, MapAttribute, BooleanAttribute, ListAttribute, UTCDateTimeAttribute


def query_by_api_key(api_key):
    return list(UserModel.api_key_index.query(api_key)) if api_key else []


def get_api_key():
    key_already_exists = True
    while key_already_exists:
        api_key = secrets.token_urlsafe(64)
        query_results = query_by_api_key(api_key)
        key_already_exists = len(query_results)
    return api_key


def get_default_access_queue():
    return [datetime(2020, 1, 1, tzinfo=timezone.utc)] * 5


class Permissions(MapAttribute):
    is_admin = BooleanAttribute(default=False)
    in_beta = BooleanAttribute(default=False)
    read_disclaimer = BooleanAttribute(default=False)


class Stripe(MapAttribute):
    customer_id = UnicodeAttribute(default="")
    subscription_active = BooleanAttribute(default=False)
    # subscription_end?
    # trialing?


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
    # Note that this attribute must also exist in the model
    api_key = UnicodeAttribute(hash_key=True)


class UserModel(Model):
    """
    A DynamoDB User
    """
    class Meta:
        table_name = os.environ['TABLE_NAME']
    email = UnicodeAttribute(hash_key=True)
    api_key = UnicodeAttribute(default=get_api_key)
    permissions = MapAttribute(default=Permissions)
    stripe = MapAttribute(default=Stripe)
    access_queue = ListAttribute(
        of=UTCDateTimeAttribute,
        default=get_default_access_queue
    )
    api_key_index = APIKeyIndex()
