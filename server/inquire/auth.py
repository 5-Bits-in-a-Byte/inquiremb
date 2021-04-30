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
from inquire.mongo import *
from inquire.config import HS_256_KEY, CLIENT_URL

from werkzeug.local import LocalProxy
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
            user.permissions = None
            if user and 'courseId' in request.view_args:
                courseId = request.view_args['courseId']
                user_course = user.get_course(courseId)
                if user_course:
                    role = retrieve_role(user_course.role)
                    if role:
                        user.permissions = role.permissions
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


def _deep_access(d, keys):
    for key in keys:
        try:
            d = d[key]
        except:
            return None
    return d

def _permission_comparison(user_permissions: dict, required_permissions: list):
    """ 
    Checks if the values in the user_permissions dict are true for the keys specified in the required_permissions list.
    For nested values specify keys in the following format "level1key-level2key-level3key".
    
    Required_permissions can contain a subset of permissions to check.

    Example: _permission_comparison({"a":True, b:False, c:{d:True, e:True}}, ["a", "c-e"]) == True
    """
    missing_permissions = []
    for key in required_permissions:
        val = _deep_access(user_permissions, key.split("-"))
        if val == None:
            app.logger.error(f"Tried to check nonexistant permission: {key}")
            missing_permissions.append(key)
        elif val == False:
            missing_permissions.append(key)
        elif val == True:
            pass
        else:
            app.logger.error(f"Non-bool val stored in role permission dict")

    return missing_permissions


def permission_layer(required_permissions=None, require_login=True, require_joined_course=False):
    """
    Retricts access to an endpoint based on the user's permissions in the course
    """
    def actual_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Checking if user is not logged in when it's required they are
            if current_user == None and (required_permissions or require_login):
                abort(401, errors=[
                      "Resource access restricted: unauthenticated client"])
            if type(current_user.permissions) == None and require_joined_course:
                abort(401, errors=[
                      "Resource access restricted: requesting resource from unjoined course"])
            if required_permissions:
                if not current_user.permissions:
                    missing_permissions = required_permissions
                else:
                    missing_permissions = _permission_comparison(current_user.permissions, required_permissions)
                if missing_permissions:
                    abort(401, errors=[f'Resource access restricted: missing course permission(s) {", ".join(missing_permissions)}'])
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
    '''Retrieves the user from the database using the _id field'''
    query = User.objects.raw({'_id': _id})
    count = query.count()
    if count > 1:
        raise Exception(
            f'Duplicate user detected, multiple users in database with id {_id}')
    elif count == 1:
        return query.first()
    else:
        return None

def retrieve_role(_id):
    '''Retrieves the role object from the database'''
    query = Role.objects.raw({'_id': _id})
    count = query.count()
    if count > 1:
        raise Exception(
            f'Duplicate roles detected, multiple roles in database with id {_id}')
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
