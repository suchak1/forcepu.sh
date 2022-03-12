#!/bin/bash

if [[ $CI != true ]]; then
    source config.env   
fi

gpg --batch --yes --decrypt --passphrase="${GPG_PASSPHRASE}" --output "${FILE}" "${FILE}.gpg"