import json
import requests

slippi_headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.5",
    "apollographql-client-name": "slippi-web",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "sec-gpc": "1",
    "Referer": "https://slippi.gg/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}


def get_player(event, _):
    req_body = json.loads(event['body'])
    slippi_url = 'https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql'
    smashgg_url = 'https://www.start.gg/api/-/gql'
    slippi_res = requests.post(slippi_url, headers=slippi_headers).json()
    if
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
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
