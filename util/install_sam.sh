#!/bin/bash

set -e

curl -LO https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
unzip -o aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install
rm -rf sam-installation aws-sam-cli-linux-x86_64.zip

raw_new_v=$(sam --version)
new_v="${raw_new_v##*version }"

echo "Installed SAM CLI (v${new_v})"
