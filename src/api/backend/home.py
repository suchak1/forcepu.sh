import os
from hyperdrive import DataSource, FileOps
from FileOps import FileReader
from DataSource import IEXCloud, MarketData


def get_holding(*_):
    #     price = vbt.YFData.download('BTC-USD').get('Close')
    #     pf = vbt.Portfolio.from_holding(price, init_cash=1000)
    #     print(pf.value())
    # print(os.environ)
    md = MarketData()
    df = md.get_ohlc(symbol='TSLA', timeframe='5d')
    # reader = FileReader()
    # df = reader.load_csv('models/latest/signals.csv')

    print(df)
    return {
        "statusCode": 200,
        "body": {
            'bucket': md.reader.store.bucket_name,
            'df': df.to_dict(),
            'env': os.environ
        },
        # "body": {'environ': dict(os.environ)},
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

# use env file locally
# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html#serverless-sam-cli-using-invoke-environment-file
# https://stackoverflow.com/questions/59706797/aws-sam-local-and-environment-parameters
# https://stackoverflow.com/questions/48104665/aws-sam-local-environment-variables

# for ci, put env vars as github secrets
# and then use this actions step to dynamically construct env file
# https://github.com/marketplace/actions/render-json
