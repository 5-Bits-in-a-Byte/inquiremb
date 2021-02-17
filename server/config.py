"""
Config file imports environmeant variables
Used to configure the flask app in app.py
"""
import os

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
<<<<<<< HEAD
HS_256_KEY = os.getenv('HS_256_KEY')
MONGO_URI = os.getenv('MONGO_URI')
=======
>>>>>>> 208e19ba944c3e9e7758e72b75c6e2f11cf3acf1
