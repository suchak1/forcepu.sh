FROM public.ecr.aws/lambda/python:3.8

COPY account/app.py account/requirements.txt models ./

RUN python3.8 -m pip install -r requirements.txt -t .

CMD ["app.get_account"]
