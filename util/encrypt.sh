#!/bin/bash

if [[ $CI != true ]]; then
    source config.env   
fi

gpg --batch --yes --symmetric --cipher-algo AES256 --passphrase="${GPG_PASSPHRASE}" --output "${FILE}.gpg" "${FILE}"