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


def verify_alerts(alerts):
    assert type(alerts.email) == bool
    assert not alerts.email
    assert type(alerts.sms) == bool
    assert not alerts.sms
    assert type(alerts.webhook) == str
    assert not alerts.webhook
    assert type(alerts.last_sent) == str
    assert alerts.last_sent == UTCDateTimeAttribute().serialize(past_date)


class TestAlerts():
    alerts = Alerts()
    verify_alerts(alerts)


def verify_permissions(perms):
    assert type(perms.is_admin) == bool
    assert not perms.is_admin
    assert type(perms.read_disclaimer) == bool
    assert not perms.read_disclaimer


class TestPermissions():
    perms = Permissions()
    verify_permissions(perms)


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
    user = UserModel('test_user')
    assert type(user.email) == str
    assert user.email == 'test_user'
    assert type(user.api_key) == str
    assert len(user.api_key) == 86
    assert type(user.alerts) == Alerts
    verify_alerts(user.alerts)
    assert type(user.permissions) == Permissions
    verify_permissions(user.permissions)
    assert type(user.in_beta) == int
    assert user.in_beta == 0
    assert type(user.subscribed) == int
    assert user.subscribed == 0
    assert type(user.stripe) == Stripe
    assert type(user.access_queue) == list
    assert user.access_queue == [past_date] * 5
    assert type(user.api_key_index) == APIKeyIndex
    assert type(user.customer_id_index) == CustomerIdIndex
    assert type(user.in_beta_index) == InBetaIndex
    assert type(user.subscribed_index) == SubscribedIndex
