#!/bin/bash
AWS_ENDPOINT_URL_DYNAMODB=http://localhost:8000

if [[ $(aws dynamodb list-tables --endpoint-url=http://localhost:8000 | grep users-local) ]]; then
    aws dynamodb delete-table --table-name users-local --endpoint-url=http://localhost:8000
fi

aws dynamodb create-table \
    --table-name users-local \
    --key-schema \
        AttributeName=email,KeyType=HASH \
    --attribute-definitions \
        AttributeName=email,AttributeType=S \
        AttributeName=api_key,AttributeType=S \
        AttributeName=customer_id,AttributeType=S \
        AttributeName=in_beta,AttributeType=N \
        AttributeName=subscribed,AttributeType=N \
    --global-secondary-indexes \
        IndexName=api_key_index,KeySchema=["{AttributeName=api_key,KeyType=HASH}"],Projection={ProjectionType=ALL} \
        IndexName=customer_id_index,KeySchema=["{AttributeName=customer_id,KeyType=HASH}"],Projection={ProjectionType=ALL} \
        IndexName=in_beta_index,KeySchema=["{AttributeName=in_beta,KeyType=HASH}"],Projection={ProjectionType=ALL} \
        IndexName=subscribed_index,KeySchema=["{AttributeName=subscribed,KeyType=HASH}"],Projection={ProjectionType=ALL} \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://localhost:8000 \
    --no-cli-pager
aws dynamodb put-item --table-name users-local --item "{\"email\":{\"S\":\"test_user@example.com\"}, \"api_key\":{\"S\":\"test_api_key\"}}" --endpoint-url http://localhost:8000