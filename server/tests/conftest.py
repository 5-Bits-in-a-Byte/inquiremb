"""
Contains PyTest fixtures used in multiple tests

To run use the command "pytest" after installing the pytest module
"""
import pytest
from flask import make_response, request
from inquire import create_app
import inquire.config as config
from inquire.auth import create_user, encode_jwt

config.MONGO_URI = "mongodb://mongoadmin:secret@localhost:27888/message-board?authSource=admin"
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
    print(app.config['TESTING'])

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
