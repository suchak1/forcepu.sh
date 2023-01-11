FROM public.ecr.aws/lambda/python:3.8

COPY subscribe/app.py subscribe/requirements.txt ./
COPY shared shared

RUN python3.8 -m pip install -r requirements.txt -t .

CMD ["app.lambda_handler"]