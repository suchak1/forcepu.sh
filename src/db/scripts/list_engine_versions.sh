aws rds describe-db-engine-versions | jq '.DBEngineVersions[] | select((.Engine == "aurora-postgresql") and (.SupportedEngineModes[] | contains("serverless"))) | .EngineVersion'
# aws rds describe-db-engine-versions --engine aurora-postgresql --query "DBEngineVersions[].EngineVersion"