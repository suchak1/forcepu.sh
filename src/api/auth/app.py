import os
import json


def get_auth(*_):
    redirect_url = 'https://dev.forcepu.sh' if os.environ['ENV'] == 'dev' else 'https://forcepu.sh'
    config = {
        'aws_project_region': os.environ['AWS_DEFAULT_REGION'],
        'aws_cognito_identity_pool_id': os.environ['IDENTITY_POOL_ID'],
        'aws_cognito_region': os.environ['AWS_DEFAULT_REGION'],
        'aws_user_pools_id': os.environ['USER_POOL_ID'],
        'aws_user_pools_web_client_id': os.environ['WEB_CLIENT_ID'],
        'oauth': {
            'domain': os.environ['OAUTH_DOMAIN'],
            'scope': [
                "phone",
                "email",
                "openid",
                "profile",
                "aws.cognito.signin.user.admin",
            ],
            'redirectSignIn': redirect_url,
            'redirectSignOut': redirect_url,
            'responseType': "code",
        },
        'federationTarget': "COGNITO_USER_POOLS",
        'aws_cognito_username_attributes': ["EMAIL"],
        'aws_cognito_social_providers': ["GOOGLE"],
        'aws_cognito_signup_attributes': ["EMAIL", "NAME", "PICTURE"],
        'aws_cognito_mfa_configuration': "OPTIONAL",
        'aws_cognito_mfa_types': ["TOTP"],
        'aws_cognito_password_protection_settings': {
            'passwordPolicyMinLength': 8,
            'passwordPolicyCharacters': [
                "REQUIRES_LOWERCASE",
                "REQUIRES_NUMBERS",
                "REQUIRES_SYMBOLS",
                "REQUIRES_UPPERCASE",
            ],
        },
        'aws_cognito_verification_mechanisms': ["EMAIL"],
    }
    return {
        "statusCode": 200,
        "body": json.dumps(config),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }
