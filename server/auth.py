"""
Contains functions used to perform user authentication, and secure the rest api.
Authors: Sam Peters
Group Name: 5 Bits in a Byte

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
from werkzeug.local import LocalProxy
from mongo import *
from config import HS_256_KEY, CLIENT_URL
from functools import wraps
import sys
import logging
from authlib.integrations.flask_client import OAuth
from authlib.jose import jwt
from flask import Blueprint, session, url_for, redirect, request, make_response, jsonify, g, current_app
from flask_restful import abort


# Authlib logging
log = logging.getLogger('authlib')
log.addHandler(logging.StreamHandler(sys.stdout))
log.setLevel(logging.DEBUG)

# Blueprint stores authentication related routes
auth_routes = Blueprint('auth_blueprint', __name__)
# OAuth object implements OAuth 2.0 protocol logic
# configured in app.py
oauth = OAuth()


def get_current_user():
    """
    Sets g.current in the current app context.

    Returns:
        User/None: MongoDB object representing request sending user
    """
    if 'current_user' not in g:
        user = None
        cookie = request.cookies.get('userID')
        if cookie:
            payload = decode_jwt(cookie)
            _id = payload['_id']
            user = retrieve_user(_id)
        g.current_user = user

    return g.current_user


# Allows you to use current_user as a variable in any flask route
current_user = LocalProxy(get_current_user)


def teardown_current_user(exception):
    """
    Removes the current_user variable from the app_context.

    Assigned as a teardown funtion for the app variable in app.py
    Args:
        exception (Exception): Any exception that might occur while executing a route function
    """
    user = g.pop('current_user', None)


def permission_layer(required_permissions: list, require_login=True):
    """
    Checks if the current_user has the correct permissions to access the endpoint
    for the given course

    Args:
        required_permissions (list): List of permissions required to access the endpoint
        require_login (bool, optional): [description]. If the user is required
        to be logged in. Defaults to True.
    """
    def actual_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Checking if user is not logged in when it's required they are
            if current_user == None and (required_permissions or require_login):
                abort(401, errors=[
                      "Resource access restricted: unauthenticated client"])

            errors = []
            # Getting the current course
            course_id = kwargs.get('course_id')
            if course_id or required_permissions:
                course = current_user.get_course(course_id)
                if course is None:
                    errors.append(
                        "Resource access restricted: invalid course id")

            # Checking if the user has the required course specific permissions
            if required_permissions and course:
                missing = []
                for permission in required_permissions:
                    user_perm = getattr(
                        course, permission, False)
                    if not user_perm:
                        missing.append(permission)
                if missing:
                    errors.append(
                        f'Resource access restricted: missing course permission(s) {", ".join(missing)}')
            # If there are any errors, we return a 403
            if errors:
                return abort(403, errors=errors)
            # If there are no errors, we return the result of executing the resource function
            else:
                return func(*args, **kwargs)
        return wrapper
    return actual_decorator


@ auth_routes.route('/login')
def login():
    redirect_uri = url_for('auth_blueprint.auth', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@ auth_routes.route('/github-login')
def github_login():
    redirect_uri = url_for('auth_blueprint.github_auth', _external=True)
    return oauth.github.authorize_redirect(redirect_uri)


@ auth_routes.route('/logout')
def logout():
    resp = make_response(redirect(CLIENT_URL))
    resp.set_cookie('userID', value="", max_age=0)
    return resp


@ auth_routes.route('/auth')
def auth():
    token = oauth.google.authorize_access_token()
    id_token = oauth.google.parse_id_token(token)
    _id = id_token['sub']
    user = retrieve_user(_id)
    # If a user wasn't found we add them to the database
    if not user:
        user = create_user(id_token)

    # Create a new response
    resp = make_response(redirect(CLIENT_URL))
    # cookie_age is the number of seconds the cookie lives before becoming invalid
    cookie_age = 60 * 60 * 24
    # Encode the user's sub (unique google account identifier) in a JWT), and set that as a cookie attached to the response
    resp.set_cookie(
        'userID', value=encode_jwt({'_id': _id}), httponly=True, max_age=cookie_age)
    return resp


@ auth_routes.route('/github-auth')
def github_auth():
    token = oauth.github.authorize_access_token()
    # token = {'access_token': '5853c9ce07e1306a72fd085264973bb438fdb45d',
    #          'token_type': 'bearer', 'scope': 'read:user'}
    resp = oauth.github.get('user')
    profile = resp.json()
    github_user_id = str(profile['id'])
    user = retrieve_user(github_user_id)
    # If a user wasn't found we add them to the database
    if not user:
        user = create_user(profile, mode="github")

    # Create a new response
    resp = make_response(redirect(CLIENT_URL))
    # cookie_age is the number of seconds the cookie lives before becoming invalid
    cookie_age = 60 * 60 * 24
    # Encode the user's sub (unique google account identifier) in a JWT), and set that as a cookie attached to the response
    resp.set_cookie(
        'userID', value=encode_jwt({'_id': github_user_id}), httponly=True, max_age=cookie_age)
    return resp


def encode_jwt(payload):
    header = {'alg': 'HS256'}
    return jwt.encode(header, payload, HS_256_KEY)


def decode_jwt(s):
    return jwt.decode(s, HS_256_KEY)


def retrieve_user(_id):
    '''Retrieves the user from the database using the google "sub" field as _id'''
    query = User.objects.raw({'_id': _id})
    count = query.count()
    if count > 1:
        raise Exception(
            f'Duplicate user detected, multiple users in database with id {sub}')
    elif count == 1:
        return query.first()
    else:
        return None


def create_user(data, mode="google"):
    if mode == "google":
        user = User(_id=data['sub'], first=data['given_name'], last=data['family_name'],
                    email=data['email'], picture=data['picture'], courses=[]).save()
    elif mode == "github":
        _id = str(data['id'])
        name = data['name']
        if name is None:
            name = ""
        split_name = name.split()
        if len(split_name) == 1:
            first = name
            last = ""
        elif len(split_name) == 2:
            first = split_name[0]
            last = split_name[1]
        else:
            first = name
            last = ""
        email = data['email']
        if email is None:
            email = ""
        picture = data['avatar_url']
        user = User(_id=_id, first=first, last=last,
                    email=email, picture=picture, courses=[]).save()
    return user
