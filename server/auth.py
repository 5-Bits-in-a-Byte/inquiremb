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
from flask import Blueprint, session, url_for, redirect, request, make_response, jsonify
from authlib.jose import jwt
from authlib.integrations.flask_client import OAuth
import logging
import sys
from functools import wraps
from config import HS_256_KEY
from mongo import *

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


def permission_layer(permissions, course_id):
    def actual_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if permissions:
                authorized = False
                cookie = request.cookies.get('userID')
                if cookie:
                    payload = decode_jwt(cookie)
                    sub = payload['sub']
                    user = retrieve_user(sub)
                    if user and (course_id in user.permissions):
                        for permission in permissions:
                            if permission not in user.permissions[course_id]:
                                break
                        else:
                            authorized = True
                if not authorized:
                    return jsonify(message="Resource access restricted"), 403
            return func(*args, **kwargs)
        return wrapper
    return actual_decorator


@auth_routes.route('/testauthsuccess')
@permission_layer(["read", "write"], "course_id_1")
def testauthsuccess():
    return jsonify(message="Congrats, you have access to this resource"), 200


@auth_routes.route('/testauthfail')
@permission_layer(["admin", "write"], "course_id_1")
def testauthfail():
    return jsonify(message="Congrats, you have access to this resource"), 200


@auth_routes.route('/login')
def login():
    redirect_uri = url_for('auth_blueprint.auth', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@auth_routes.route('/logout')
def logout():
    resp = make_response(redirect('/'))
    resp.set_cookie('userID', value="", expires=0)
    return resp


"""
@auth_routes.route('/fakeauth')
def fakeauth():
    user = session['user']
    print(user['sub'])
    resp = make_response('hi')
    resp = make_response('set cookie')
    resp.set_cookie(
        'userID', value=encode_jwt({'sub': user['sub']}), httponly=True)
    return resp
"""


@auth_routes.route('/auth')
def auth():
    token = oauth.google.authorize_access_token()
    id_token = oauth.google.parse_id_token(token)
    sub = id_token['sub']
    user = retrieve_user(sub)
    # If a user wasn't found
    if not user:
        user = create_user(id_token)

    # Create a new response
    resp = make_response(redirect('/'))
    # Encode the user's sub (unique google account identifier) in a JWT), and set that as a cookie attached to the response
    resp.set_cookie(
        'userID', value=encode_jwt({'sub': sub}), httponly=True)
    # Redirect user to /testauth where cookie is retrieved and jwt is encoded to get at the sub # inside.
    # Planning on using sub # to retrieve user object from mongo
    return resp


def encode_jwt(payload):
    header = {'alg': 'HS256'}
    return jwt.encode(header, payload, HS_256_KEY)


def decode_jwt(s):
    return jwt.decode(s, HS_256_KEY)


def retrieve_user(sub):
    query = User.objects.raw({'_id': sub})
    count = query.count()
    if count > 1:
        raise Exception(
            f'Duplicate user detected, multiple users in database with id {sub}')
    elif count == 1:
        return query.first()
    else:
        return None


def create_user(id_token):
    print(id_token)
    user = User(id_token['sub'], first=id_token['given_name'], last=id_token['family_name'],
                email=id_token['email'], instructor=True, permissions=example_permissions).save()
    return user