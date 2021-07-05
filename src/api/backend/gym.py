import json
import requests
import pandas as pd
from io import BytesIO
# from scipy.interpolate import interp1d
# import numpy as np


# make one function which handles 2 params
# 1. smooth or spiky curves
# 2. individual exercises or splits
# make sure you follow format of [{date: yyyy-mm-dd, volume or value: xxxx, exercise,split,category: 'Bench'}]
# use this example:
# https://g2plot.antv.vision/en/examples/line/multiple
# https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json


def get_exercise_log(*_):
    res = requests.get(
        (
            'https://docs.google.com/spreadsheets/d/'
            '1Pu6T67VpIl049GGIyoe_OARejxuXSl-aWK5x2ORaCcY/'
            'gviz/tq?tqx=out:csv&sheet=Workouts'
        )
    )
    df = pd.read_csv(BytesIO(res.content))
    df = df[df['Exercise'] != 'Exercise']
    df = df[['Date', 'Id', 'Weight', 'Reps', 'Exercise', 'Volume', '1RM']]
    records = df.to_json(orient='records')
    return {
        "statusCode": 200,
        "body": records,
    }


def get_exercise_vol():
    # res = requests.get(
    #     (
    #         'https://docs.google.com/spreadsheets/d/'
    #         '1Pu6T67VpIl049GGIyoe_OARejxuXSl-aWK5x2ORaCcY/'
    #         'gviz/tq?tqx=out:csv&sheet=Workouts'
    #     )
    # )
    # df = pd.read_csv(BytesIO(res.content))
    # return df
    pass
