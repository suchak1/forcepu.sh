import sys
sys.path.append('src/api')  # noqa
from shared.python.models import *  # noqa
from shared.python.utils import past_date  # noqa


def test_query_by_api_key():
    assert query_by_api_key('test_api_key')[0].email == 'test_user'


def test_get_api_key():
    assert len(get_api_key()) == 86


def test_get_default_access_queue():
    assert get_default_access_queue() == [past_date] * 5
