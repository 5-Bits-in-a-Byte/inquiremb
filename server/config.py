"""
Config file imports environmeant variables
Used to configure the flask app in app.py
"""
import os

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
HS_256_KEY = os.getenv('HS_256_KEY')
MONGO_URI = os.getenv('MONGO_URI')
