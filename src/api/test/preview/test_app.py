import sys
import json
sys.path.append('src/api')  # noqa
from preview.app import *


def test_get_preview():
    res = get_preview()
    assert res['statusCode'] == 200
    data = json.loads(res['body'])
    assert set(['Date', 'Id', 'Weight', 'Reps', 'Exercise',
               'Volume', '1RM']).issubset(data[0].keys())
    assert res['headers']['Access-Control-Allow-Origin'] == '*'
