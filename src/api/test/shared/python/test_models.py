import sys
from datetime import datetime
sys.path.append('src/api')  # noqa
from shared.python.models import *  # noqa
from shared.python.utils import past_date  # noqa


def test_query_by_api_key():
    assert query_by_api_key('test_api_key')[0].email == 'test_user'


def test_get_api_key():
    assert len(get_api_key()) == 86


def test_get_default_access_queue():
    assert get_default_access_queue() == [past_date] * 5


class TestAlerts():
    alerts = Alerts()
    assert type(alerts.email) == bool
    assert type(alerts.sms) == bool
    assert type(alerts.webhook) == str
    assert type(alerts.last_sent) == str


class TestPermissions():
    perms = Permissions()
    assert type(perms.is_admin) == bool
    assert type(perms.read_disclaimer) == bool


class TestCheckout():
    checkout = Checkout()
    assert type(checkout.url) == str
    assert type(checkout.created) == datetime


class TestStripe():
    stripe = Stripe()
    assert type(stripe.checkout) == Checkout


class TestAPIKeyIndex():
    api_key_index = APIKeyIndex()
    assert 'api_key' in dir(api_key_index)


class TestInBetaIndex():
    in_beta_index = InBetaIndex()
    assert 'in_beta' in dir(in_beta_index)


class TestCustomerIdIndex():
    customer_id_index = CustomerIdIndex()
    assert 'customer_id' in dir(customer_id_index)


class TestSubscribedIndex():
    subscribed_index = SubscribedIndex()
    assert 'subscribed' in dir(subscribed_index)


class TestUserModel():
    user_model = UserModel('test_user')
    assert type(user_model.email) == str
    assert user_model.email == 'test_user'
    assert type(user_model.api_key) == str
    assert len(user_model.api_key) == 86
    assert type(user_model.alerts) == Alerts
    assert type(user_model.permissions) == Permissions
    assert type(user_model.in_beta) == int
    assert user_model.in_beta == 0
    assert type(user_model.subscribed) == int
    assert user_model.subscribed == 0
    assert type(user_model.stripe) == Stripe
    assert type(user_model.access_queue) == list
    assert user_model.access_queue == [past_date] * 5
    assert type(user_model.api_key_index) == APIKeyIndex
    assert type(user_model.customer_id_index) == CustomerIdIndex
    assert type(user_model.in_beta_index) == InBetaIndex
    assert type(user_model.subscribed_index) == SubscribedIndex
