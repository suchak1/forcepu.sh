# # Apply to plaid
import requests
from time import sleep
from random import random

application_url = 'https://contact.plaid.com/jobs'
job_ids = [
    # https://plaid.com/careers/openings/engineering/remote/software-engineer-product-backend-transactions/
    "df6d2c24-38a8-4fe0-86f9-8342eab44c3e",
    # https://plaid.com/careers/openings/engineering/remote/software-engineer-product-credit/
    "6a3ad58f-24a4-4892-94da-bb9efe47051f",
    # https://plaid.com/careers/openings/engineering/remote/software-engineer-full-stack-link-success/
    "db2bd20f-649b-4a6a-8f63-4da8c9af99e9",
    # https://plaid.com/careers/openings/engineering/remote/software-engineer-full-stack-developer-experience/
    "60a57d05-e01c-432b-a027-b44984eb1752",
    # https://plaid.com/careers/openings/engineering/remote/software-engineer-full-stack-consumer-privacy/
    "47a2dae2-fa3e-4ae8-bde8-232834da7ef8",
    # https://plaid.com/careers/openings/engineering/remote/software-engineer-financial-access-platform/
    "eecfd6ad-9c05-41d9-aafb-d28f423c104c",
    # # https://plaid.com/careers/openings/engineering/remote/software-engineer-data-platform/
    # "226366d9-ffa8-42e2-a92f-117b9705603f"
]

data = {
    "name": "Krish Suchak",
    "email": "suchak.krish@gmail.com",
    "resume": "https://s3.amazonaws.com/api.forcepu.sh/resume.pdf",
    "phone": "850-666-9094",
    "job_id": "df6d2c24-38a8-4fe0-86f9-8342eab44c3e",  # TODO: replace
    "github": "https://github.com/suchak1/hyperdrive",
    "website": "https://forcepu.sh",
    "location": "Tallahassee, FL",
    "favorite_candy": "skittles",
    "superpower": "Super Smash Bros. Melee player"
}

for idx, job_id in enumerate(job_ids):
    data["job_id"] = job_id
    res = requests.post(application_url, json=data)
    print(f'Submitted job application {job_id} [{idx + 1} / {len(job_ids)}].')
    print(res.text)
    sleep(random() * 5)
