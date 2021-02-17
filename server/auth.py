"""
Contains functions used to perform user authentication, and secure the rest api.
Authors: Sam Peters

Users login with their google accounts
This is done through the OAuth2 protocol
Once users are logged in they are issued a JWT that continuously identifies them until the token expires
When users send a request to the rest api, the JWT is checked for authorization

Steps:
1. Set up oauth login flow through google.
2. Be able to retrieve user account details from google using oath token
3. Assign users a jwt at the point of login
4. Check jwt on api requests
5. lookup user using jwt details on api requests
"""
from flask import Blueprint, session, url_for, redirect, request, make_response
from authlib.jose import jwt
from authlib.integrations.flask_client import OAuth
import logging
import sys
from config import HS_256_KEY

# Authlib logging
log = logging.getLogger('authlib')
log.addHandler(logging.StreamHandler(sys.stdout))
log.setLevel(logging.DEBUG)

# Blueprint stores authentication related routes
auth_routes = Blueprint('auth_blueprint', __name__)

# OAuth object implements OAuth 2.0 protocol logic
# configured in app.py
oauth = OAuth()

""" Routes used for testing, will change later """


@auth_routes.route('/')
def homepage():
    user = session.get('user')
    # resp.set_cookie('email', user['email'])
    cookie = request.cookies.get('email')
    # payload = decode_jwt(cookie)
    if cookie:
        return cookie
    else:
        return ""
    return cookie


@auth_routes.route('/login')
def login():
    redirect_uri = url_for('auth_blueprint.auth', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@auth_routes.route('/fakeauth')
def fakeauth():
    user = session['user']
    print(user['sub'])
    resp = make_response('hi')
    resp.set_cookie('userID', user['sub'])
    resp.set_cookie('email', user['email'])
    """
    # resp.set_cookie(
        'hellomessage', value = encode_jwt({'hi': 'helloooo'}), httponly = True)
    """
    return resp


@ auth_routes.route('/auth')
def auth():
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token)
    session['user'] = user
    resp = make_response('set cookie')
    resp.set_cookie(
        'userID', value=user['sub'], httponly=True)
    return resp


def encode_jwt(payload):
    header = {'alg': 'HS256'}
    return jwt.encode(header, payload, HS_256_KEY)


def decode_jwt(s):
    return jwt.decode(s, HS_256_KEY)
