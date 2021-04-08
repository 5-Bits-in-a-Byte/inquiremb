""" Contains tests for the Post resource """
import pytest


def test_post_regular(client, test_user):
    client.post('/test_user_login', json=test_user)
    resp = client.post('/api/courses/<string:courseId>/posts')
