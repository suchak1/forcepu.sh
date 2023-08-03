import sys
sys.path.append('src/api')  # noqa
from contact.app import *  # noqa
from shared.python.utils import options  # noqa


def test_handle_contact():
    event = {'httpMethod': 'OPTIONS'}
    res = handle_contact(event, None)
    assert res == options()
