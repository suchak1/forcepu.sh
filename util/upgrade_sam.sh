#!/bin/bash

set -e
raw_old_v=$(sam --version)
old_v="${raw_old_v##*n }"

curl -LO https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install --update
rm -rf sam-installation aws-sam-cli-linux-x86_64.zip

raw_new_v=$(sam --version)
new_v="${raw_new_v##*n }"

echo "Upgrade complete (v${old_v} => v${new_v})"
