"""
Contains PyTest fixtures used in multiple tests

To run use the command "pytest" after installing the pytest module
"""
import pytest
from flask import make_response, request
from inquire import create_app
import inquire.config as config
import inquire.mongo
from inquire.auth import create_user, encode_jwt
import os

# Test Database URI
test_mongo_uri = os.environ['TEST_MONGO_URI']
if test_mongo_uri:
    config.MONGO_URI = test_mongo_uri
elif test_mongo_uri is None:
    raise Error("Missing mongodb test URI")
elif test_mongo_uri == config.MONGO_URI:
    raise Error("Don't use normal mongodb for testing")
config.TESTING = True


@pytest.fixture
def test_user():
    user = {
        "sub": "123456789",
        "given_name": "Testy",
        "family_name": "DontUseMeOnProdDB",
        "email": "test@test.com",
        "picture": "https://i.imgur.com/nnhQbpY.jpg"
    }

    return user


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app(override_config=config, include_socketio=False)
    # Wiping the database between tests
    app.db['user'].drop()
    app.db['course'].drop()
    app.db['post'].drop()
    app.db['comment'].drop()

    @app.route('/test_user_login', methods=["POST"])
    def test_user_login():
        user = request.get_json()
        create_user(user)
        resp = make_response("test user logged in")
        resp.set_cookie(
            'userID', value=encode_jwt({'_id': user['sub']}), httponly=True, max_age=60)
        return resp

    @app.route('/test_user_logout', methods=["POST"])
    def test_user_logout():
        resp = make_response("test user logged out")
        resp.set_cookie('userID', value="", max_age=0)
        return resp

    yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()
