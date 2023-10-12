import os
import json
import boto3
import pyotp
from pathlib import Path
from math import log, sqrt, ceil
from statistics import NormalDist
from collections import defaultdict
import robin_stocks.robinhood as rh
from datetime import datetime, timedelta
from botocore.exceptions import ClientError
from utils import \
    verify_user, options, error

s3 = boto3.resource('s3')


def calc_d1(stock_price, strike_price, implied_vol, rho, div_yield, time):
    numerator = log(stock_price / strike_price) + \
        (rho - div_yield + (implied_vol ** 2) / 2) * time
    denominator = implied_vol * sqrt(time)
    return numerator / denominator


def calc_d2(d1, implied_vol, time):
    return d1 - implied_vol * sqrt(time)


def chance_of_profit(**kwargs):
    # rh assumes div_yield is zero when calculating this
    d1 = calc_d1(**kwargs)
    d2 = calc_d2(d1, kwargs['implied_vol'], kwargs['time'])
    return 1 - NormalDist().cdf(d2)


def handle_trade(event, _):
    if event['httpMethod'].upper() == 'OPTIONS':
        response = options()

    claims = event['requestContext']['authorizer']['claims']
    verified = verify_user(claims)

    if not(verified and claims['email'] == os.environ['RH_USERNAME']):
        return error(401, 'This account is not verified.')
    
    rh = login()
    if event['httpMethod'].upper() == 'POST':
        response = post_trade(rh)
    else:
        response = get_trade(rh, event)

    return response


def login():
    auth_filename = 'robinhood.pickle'
    auth_path = os.path.join(os.path.expanduser("~"), '.tokens', auth_filename)
    key = f'data/{auth_filename}'
    try:
        Path(auth_path).parent.mkdir(parents=True, exist_ok=True)
        with open(auth_path, 'wb') as file:
            bucket = s3.Bucket(os.environ['S3_BUCKET'])
            bucket.download_fileobj(key, file)
            print('Loaded auth file from S3.')
    except ClientError:
        print('Could not load auth file from S3.')
        os.remove(auth_path)
    username = os.environ['RH_USERNAME']
    password = os.environ['RH_PASSWORD']
    mfa_code = pyotp.TOTP(os.environ['RH_2FA']).now()
    rh.login(username, password, mfa_code=mfa_code)
    if os.path.exists(auth_path):
        bucket.upload_file(auth_path, key)
        print('Saved auth file to S3.')
    return rh


def get_trade(rh):
    holdings = rh.build_holdings()
    for symbol in holdings:
        holdings[symbol]['open_contracts'] = 0
    opts = rh.options.get_open_option_positions()
    for opt in opts:
        sold = -1 if opt['type'] == 'short' else 1
        holdings[opt['chain_symbol']
                    ]['open_contracts'] += int(float(opt['quantity'])) * sold
        opt = rh.options.get_option_instrument_data_by_id(opt['option_id'])
        holdings[opt['chain_symbol']
                    ]['expiration'] = opt['expiration_date']
        holdings[opt['chain_symbol']]['strike'] = float(
            opt['strike_price'])
        opt = rh.options.get_option_market_data_by_id(opt['option_id'])[0]
        holdings[opt['chain_symbol']]['chance'] = float(opt[f"chance_of_profit_{'short' if holdings[opt['chain_symbol']
                    ]['open_contracts'] < 0 else 'long'}"])
    body = holdings
    status_code = 200

    return {
        "statusCode": status_code,
        "body": json.dumps(body),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

def post_trade(rh, event):
    req_body = json.loads(event['body'])
    trade_type = req_body['type']
    symbols = req_body['symbol']

    response = roll() if trade_type.upper() == 'ROLL' else sell(rh, symbols)

    body = 'OK'
    status_code = 200

    return {
        "statusCode": status_code,
        "body": json.dumps(body),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

def get_week(date):
    one_day = timedelta(days=1)
    day_idx = (date.weekday() + 1) % 7
    sunday = date - timedelta(days=day_idx)
    return [i * one_day + sunday for i in range(7)]

def get_mid_price(opt):
    return (float(opt['ask_price']) + float(opt['bid_price'])) / 2

def round_up(n, decimals=0):
    multiplier = 10**decimals
    return ceil(n * multiplier) / multiplier

def suggest_num_contracts():
    holdings = rh.build_holdings()
    max_contracts = {symbol: int(float(holding['quantity']) / 100) for symbol, holding in holdings.items()}
    instr_to_symbol_lookup = {holding['id']: symbol for symbol, holding in holdings.items()}
    positions = rh.account.get_open_stock_positions()
    curr_contracts = defaultdict(int, {instr_to_symbol_lookup[position['instrument_id']]: int(float(position['shares_held_for_options_collateral']) / 100) for position in positions})
    available_contracts = {symbol: max_contract - curr_contracts[symbol] for symbol, max_contract in max_contracts.items()} 
    return available_contracts

def get_expirations(expirations, num=2):
    today = datetime.now()
    week = set([datetime.strftime(day, '%Y-%m-%d') for day in get_week(today)])
    for idx, exp in enumerate(expirations):
        if exp not in week:
            break
    exp_candidates = expirations[idx : idx + num]
    return exp_candidates

def get_contracts(symbol, expiration, num=2):
    min_price = 0.05
    opt_candidates = rh.options.find_options_by_specific_profitability(symbol, expiration, None, 'call', 'chance_of_profit_short', 0.85, 0.95)
    opt_candidates.sort(key = lambda opt: abs(float(opt['chance_of_profit_short']) - 0.88))
    contracts = []

    for opt in opt_candidates:
        key = 'high_fill_rate_sell_price'
        sell_price = opt[key] if key in opt else get_mid_price(opt)
        opt_is_viable = float(sell_price) >= min_price
        if opt_is_viable:
            contracts.append(opt)
            if len(contracts) >= num:
                break
    
    return contracts

def sell(rh, symbols):
    desired_contracts = suggest_num_contracts()
    # only use symbols that have positions available
    symbols = filter(lambda symbol: desired_contracts[symbol], symbols)
    option_lookup = {symbol: {'quantity': desired_contracts[symbol], 'curr': [0, 0] } for symbol in symbols}
    results = {}

    for symbol in symbols:
        chain = rh.options.get_chains(symbol)
        expirations = chain['expiration_dates']
        expirations = get_expirations(expirations)
        option_lookup[symbol]['expirations'] = expirations
        # maybe turn these two lines into a fx called update_contracts and run before every trade attempt
        contracts = [get_contracts(symbol, exp) for exp in expirations]
        option_lookup[symbol]['contracts'] = contracts
        
            # raise Exception('No viable contracts to write.')

    while set(results.keys()) != set(symbols):
        for symbol in symbols:

            # trade
            pass

            strike = float(contract['strike_price'])
            mid_price = get_mid_price(opt)
            price = round_up(mid_price, 2)
            
            min_tick = float(contract['min_ticks']['below_tick'])
            price = ceil(price / min_tick) * min_tick
            quantity = desired_contracts[symbol]
            # spread = float(opt['ask_price']) - float(opt['bid_price'])
            # if abs(price - mid_price) > 0.05 * spread:
            # skip
            # when defining price, make sure high_fill_sell_price is not higher than 5% buffer or something
            # use spread too
            # 
            # or make sure 
            if abs((mid_price - price ) / mid_price) > 0.2:
                raise Exception('Price spread is high.')
        # 25

        # 10

            # get last day in current week, get next date after that (and date after that too if no expiration in curr week)
            # in total, list should have len of 2 (fallback for if premium is too low to justify weeklies or 1 month)


            # positionEffect (str) – Either ‘open’ for a sell to open effect or ‘close’ for a sell to close effect.
            # creditOrDebit (str) – Either ‘debit’ or ‘credit’.
            # price (float) – The limit price to trigger a sell of the option.
            # symbol (str) – The stock ticker of the stock to trade.
            # quantity (int) – The number of options to sell.
            # expirationDate (str) – The expiration date of the option in ‘YYYY-MM-DD’ format.
            # strike (float) – The strike price of the option.
            # optionType (str) – This should be ‘call’ or ‘put’
            rh.orders.order_sell_option_limit('open', 'credit', price, symbol, quantity, expiration, strike, 'call')

def roll():
    # also implement rolling in as well as out
    pass
    
