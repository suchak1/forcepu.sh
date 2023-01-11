FROM public.ecr.aws/lambda/python:3.8

COPY signals/app.py signals/requirements.txt ./
COPY shared shared

RUN python3.8 -m pip install -r requirements.txt -t .

CMD ["app.handle_signals"]
