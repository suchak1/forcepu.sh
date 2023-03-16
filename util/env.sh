#!/bin/bash

# # Show env vars
# grep -v '^#' config.env

# Export env vars
export $(grep -v '^#' config.env | xargs)

# Export env vars
set -o allexport
source config.env
set +o allexport