import os
# import boto3
# import vectorbt as vbt
# from dotenv import find_dotenv, load_dotenv

# cd src/api
# cp ../../../hyperdrive/config.env ./backend/config.env
# import hyperdrive as hd
# from hyperdrive import MarketData
# import yfinance as yf


# load_dotenv(find_dotenv('../../../hyperdrive/config.env'))

# s3 = boto3.resource('s3')
# bucket = s3.Bucket(os.environ['S3_BUCKET'])

# print(MarketData)

# btc = yf.download("BTC-USD")
# data = yf.download("SPY AAPL", start="2017-01-01", end="2017-04-30")
# print(data)

# price = vbt.YFData.download('BTC-USD').get('Close')
# price = vbt.YFData.download('TSLA').get('Close')
# price = vbt.YFData.download(
#     "TSLA", start='2021-04-12 09:30:00 -0400', end='2021-04-12 09:35:00 -0400', interval='1m')
# print(price)
# pf = vbt.Portfolio.from_holding(price, init_cash=1000)
# print(pf.value())

# use renderJson marketplace github action
#

def get_holding(*_):
    #     price = vbt.YFData.download('BTC-USD').get('Close')
    #     pf = vbt.Portfolio.from_holding(price, init_cash=1000)
    #     print(pf.value())
    return {
        "statusCode": 200,
        # "body": pf.value(),
        "body": {'environ': dict(os.environ)},
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

# use env file locally
# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html#serverless-sam-cli-using-invoke-environment-file
# https://stackoverflow.com/questions/59706797/aws-sam-local-and-environment-parameters
# https://stackoverflow.com/questions/48104665/aws-sam-local-environment-variables

# for ci, put env vars as github secrets
# and then use this actions step to dynamically construct env file
# https://github.com/marketplace/actions/render-json
