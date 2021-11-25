import os
import boto3
import pandas as pd
import vectorbt as vbt
# from hyperdrive import DataSource, FileOps, History, Constants as C
# from FileOps import FileReader
# from DataSource import IEXCloud, MarketData
# from History import Historian
s3 = boto3.resource('s3')
bucket = s3.Bucket(os.environ['S3_BUCKET'])
metrics = [
    'Total Return [%]',
    'Max Drawdown [%]',
    'Win Rate [%]',
    'Profit Factor',
    'Sharpe Ratio',
    'Sortino Ratio'
]


def get_hyper(*_):
    filename = '/tmp/signals.csv'
    with open(filename, 'wb') as file:
        # bucket.download_fileobj(
        #     'models/latest/signals.csv', file)
        bucket.download_fileobj(
            'models/latest/signals.csv', file
        )
    df = pd.read_csv(filename)
    df = df[df['Time'] > '2021-11-06']
    pf = vbt.Portfolio.from_signals(df['Close'], init_cash=1000, freq='D')
    balances = pf.value()
    stats = pf.stats()
    return {
        "statusCode": 200,
        "body": {
            'balances': list(balances),
            'stats': dict(stats[metrics]),
            # 'close': btc_df.to_dict(),
            # 'holding': {'balances': holding_balances, 'stats': holding_stats},
            # 'hyper': {'balances': hyper_balances, 'stats': hyper_stats},
        },
        "headers": {"Access-Control-Allow-Origin": "*"}
    }


def get_holding(*_):
    #     price = vbt.YFData.download('BTC-USD').get('Close')
    #     pf = vbt.Portfolio.from_holding(price, init_cash=1000)
    #     print(pf.value())
    # print(os.environ)

    # filename = '/tmp/signals.csv'
    filename = '/tmp/BTC.csv'
    with open(filename, 'wb') as file:
        # bucket.download_fileobj(
        #     'models/latest/signals.csv', file)
        bucket.download_fileobj(
            'data/ohlc/polygon/X%3ABTCUSD.csv', file
        )
    df = pd.read_csv(filename)
    df = df[df['Time'] > '2021-11-06']
    pf = vbt.Portfolio.from_holding(df['Close'], init_cash=1000, freq='D')
    balances = pf.value()
    stats = pf.stats()

    # md = MarketData()
    # reader = md.reader
    # finder = md.finder
    # store = reader.store
    # store.download_file(finder.get_signals_path(), '/tmp/')
    # signals_filename = f'/tmp/{finder.get_signals_path()}'
    # signals_df = pd.read_csv(signals_filename)

    # symbol = C.POLY_CRYPTO_DICT['BTC']
    # store.download_file(finder.get_ohlc_path(symbol, 'polygon'), '/tmp/')
    # btc_filename = f'/tmp/{finder.get_ohlc_path(symbol, "polygon")}'
    # btc_df = pd.read_csv(btc_filename)

    # df = btc_df.merge(signals_df, on=C.TIME)[C.CLOSE, C.SIG]
    # close = btc_df[C.CLOSE].to_numpy()
    # signals = df[C.SIG].to_numpy()
    # hist = Historian()
    # holding = hist.buy_and_hold(close)
    # holding_balances = list(holding.value())
    # holding_stats = dict(holding.stats())

    # hyper = hist.create_portfolio(close, signals, 0.001)
    # hyper_balances = list(hyper.value())
    # hyper_stats = dict(hyper.stats())

    # df = md.get_ohlc(symbol='TSLA', timeframe='5d')
    # reader = FileReader()
    # df = reader.load_csv('models/latest/signals.csv')

    # print(df)
    # s3 = boto3.resource('s3')
    # bucket = s3.Bucket('hyperdrive.pro')
    # with open('/tmp/sig.csv', 'wb') as file:
    #     bucket.download_fileobj(md.finder.get_signals_path(), file)
    # df = pd.read_csv('/tmp/sig.csv')
    # print(df)
    return {
        "statusCode": 200,
        "body": {
            'balances': list(balances),
            'stats': dict(stats[metrics]),
            # 'close': btc_df.to_dict(),
            # 'holding': {'balances': holding_balances, 'stats': holding_stats},
            # 'hyper': {'balances': hyper_balances, 'stats': hyper_stats},
        },
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

# use env file locally
# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html#serverless-sam-cli-using-invoke-environment-file
# https://stackoverflow.com/questions/59706797/aws-sam-local-and-environment-parameters
# https://stackoverflow.com/questions/48104665/aws-sam-local-environment-variables

# for ci, put env vars as github secrets
# and then use this actions step to dynamically construct env file
# https://github.com/marketplace/actions/render-json
