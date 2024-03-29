"""
Config file imports environmeant variables
Used to configure the flask app in app.py

Authors: Sam Peters and Alec Springel
Group Name: 5 Bits in a Byte
"""
import os

# AWS S3 config vars
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

SNS_TOPIC_ARN = os.getenv('SNS_TOPIC_ARN')
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
HS_256_KEY = os.getenv('HS_256_KEY')
MONGO_URI = os.getenv('MONGO_URI')
ROUTING_PREFIX = os.getenv('ROUTING_PREFIX')
AUTH_REDIRECT_URI = os.getenv('AUTH_REDIRECT_URI')
swagger_config = {
    "headers": [
    ],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    # "static_folder": "static",  # must be set by user
    "swagger_ui": True,
    "specs_route": "/apidocs/",
    "title": "Inquire API"
}
CLIENT_URL = os.getenv('CLIENT_URL')
DEFAULT_COLORS = [
    "#dd0000",
    "#dd7700",
    "#eedd00",
    "#00cc00",
    "#2a2aff",
    "#7337ee",
    "#ee55ee",
    "#00cccc",
    "#f76b60",
    "#8a5c07",
    "#c8d14d",
    "#4d8a0c",
    "#0c8a4b",
    "#27cdd6",
    "#454dba",
    "#3d1e85",
    "#710c7a",
    "#d7c3d9",
    "#c21d85",
    "#474747",
    "#edead5",
    "#d9edd5",
    "#a8e0dc",
    "#2b3659",

]
