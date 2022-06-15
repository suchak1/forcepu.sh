#!/bin/bash

set -e

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip
rm -rf aws

raw_new_v=$(aws --version)
v_w_extra="${raw_new_v#*/}"
new_v="${v_w_extra%% *}"

echo "Installed AWS CLI (v${new_v})"