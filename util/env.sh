#!/bin/bash

FILE=config.env


if [[ -f "${FILE}" ]]; then
    # # Show env vars
    # grep -v '^#' "${FILE}"

    # Export env vars
    export $(grep -v '^#' "${FILE}" | xargs)

    # Export env vars
    set -o allexport
    source "${FILE}"
    set +o allexport
fi