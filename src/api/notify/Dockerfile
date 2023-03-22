FROM public.ecr.aws/lambda/python:3.8

COPY notify/app.py notify/requirements.txt ./
COPY shared shared

RUN python3.8 -m pip install -r requirements.txt -t .

CMD ["app.lambda_handler"]