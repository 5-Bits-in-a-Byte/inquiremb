""" Contains tests for the Me resource """
import pytest


def test_login_required(client):
    resp = client.get('/api/me')
    assert resp.status_code in [401, 403]


def test_get_me(client, test_user):
    client.post('/test_user_login', json=test_user)
    resp = client.get('/api/me')

    errors = []
    if resp.status_code != 200:
        errors.append(f"Response status code is {resp.status_code}, not 200")
    elif resp.status_code == 200:
        if resp.is_json:
            data = resp.get_json()
            if test_user['sub'] != data['_id']:
                errors.append(f"Returned user id doens't match test user id")
        else:
            errors.append("Response type is not json")
    assert not errors
