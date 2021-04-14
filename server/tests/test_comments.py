""" Contains tests for the Me resource """
import pytest
from collections import defaultdict
from inquire.mongo import *


def test_get_comments_number(client, test_comments, test_user):
    """ Checks if the right number of comments are being returned """
    client.post('/test_user_login', json=test_user)
    comment_counts = defaultdict(int)
    # Counting the comments on every post in the test data set
    for comment in test_comments:
        try:
            comment_counts[comment['postId']] += 1
        except:
            assert not comment

    errors = []
    for post_id, count in comment_counts.items():
        resp = client.get(f'api/posts/{post_id}/comments')
        if resp.status_code == 200:
            if resp.is_json:
                data = resp.get_json()
                comment_ids = set()
                for comment in data:
                    if comment['postId'] != post_id:
                        errors.append("Returned comment on wrong post")
                    if comment['_id'] in comment_ids:
                        errors.append("Returned same comment multiple times")
                    else:
                        comment_ids.add(comment['_id'])
                if len(comment_ids) != count:
                    errors.append(
                        f"Wrong number of returned comments for post: {post_id}")
            else:
                errors.append("Response type is not json")
        else:
            errors.append(
                f"Response status code is {resp.status_code}, not 200")
    assert not errors


def test_get_comments_badpostid(client, test_user):
    """ Tries to get comments on a nonexistant post """
    client.post('/test_user_login', json=test_user)
    resp = client.get(f'api/posts/randomnonexistantpostid/comments')
    assert resp.status_code == 400


def test_post_comments_nonanonymous(client, test_user):
    """ Checks if posting a standard comment works """
    errors = []
    client.post('/test_user_login', json=test_user)
    comment_json = {
        'content': 'This is a test comment',
        'isAnonymous': False
    }
    resp = client.post(f'api/posts/post1id/comments', json=comment_json)
    if resp.status_code == 200:
        if resp.is_json:
            data = resp.get_json()
            if 'content' not in data or data['content'] != comment_json['content']:
                errors.append(
                    "Posted content is nonexistant or different in returned json")
        else:
            errors.append("Response type is not json")
    else:
        errors.append(
            f"Response status code is {resp.status_code}, not 200")

    assert not errors


def test_post_comments_emptycomment(client, test_user):
    """ Checks if posting a empty comment is caught and returns an error to the client """
    errors = []
    client.post('/test_user_login', json=test_user)
    comment_json = {
        'content': '',
        'isAnonymous': False
    }
    resp = client.post(f'api/posts/post1id/comments', json=comment_json)
    if resp.status_code == 400:
        if resp.is_json:
            data = resp.get_json()
            if 'errors' not in data:
                errors.append(
                    "Response doesn't contain errors")
        else:
            errors.append("Response type is not json")
    else:
        errors.append(
            f"Response status code is {resp.status_code}, not 400")

    assert not errors


def test_put_comments_successful_update(client, test_comments, test_user):
    """ Checks if updating works successfully when its a user's own comment """
    errors = []
    client.post('/test_user_login', json=test_user)
    comment_json = {
        'content': 'This is the updated comment content',
        '_id': str(test_comments[1]['_id'])
    }
    resp = client.put(f'api/posts/post1id/comments', json=comment_json)
    if resp.status_code == 200:
        if resp.is_json:
            data = resp.get_json()
            if 'content' not in data or data['content'] != comment_json['content']:
                errors.append(
                    "Updated comment content is nonexistant or different in returned json")
            if test_user['sub'] != data['postedBy']['_id']:
                errors.append(
                    "Comment poster id doesn't match test user id")
        else:
            errors.append("Response type is not json")
    else:
        errors.append(
            f"Response status code is {resp.status_code}, not 200")

    assert not errors


def test_put_comments_unsuccessful_update(client, test_comments, test_user):
    """ Checks if updating returns an error when the comment is owned by a different person """
    errors = []
    client.post('/test_user_login', json=test_user)
    comment_json = {
        'content': 'This is the updated comment content',
        '_id': str(test_comments[2]['_id'])
    }
    resp = client.put(f'api/posts/post5id/comments', json=comment_json)
    if resp.status_code == 400:
        if resp.is_json:
            data = resp.get_json()
            if 'errors' not in data:
                errors.append(
                    "Response doesn't contain errors")
        else:
            errors.append("Response type is not json")
    else:
        errors.append(
            f"Response status code is {resp.status_code}, not 400")

    assert not errors


def test_delete_comments_successful(client, test_comments, test_user):
    """ Checks that deleting your own comment goes through """
    errors = []
    client.post('/test_user_login', json=test_user)
    comment_json = {
        '_id': str(test_comments[1]['_id'])
    }
    resp = client.delete(f'api/posts/post1id/comments', json=comment_json)
    if resp.status_code == 200:
        if resp.is_json:
            data = resp.get_json()
            if data['deleted'] == False:
                errors.append(
                    "Comment wasn't deleted")
        else:
            errors.append("Response type is not json")
    else:
        errors.append(
            f"Response status code is {resp.status_code}, not 200")

    assert not errors


def test_delete_comments_unsuccessful(client, test_comments, test_user):
    """ Checks that deleting other people's comments doesn't go through """
    errors = []
    client.post('/test_user_login', json=test_user)
    comment_json = {
        '_id': str(test_comments[2]['_id'])
    }
    resp = client.delete(f'api/posts/post5id/comments', json=comment_json)
    if resp.status_code in [400, 403]:
        if resp.is_json:
            data = resp.get_json()
            if data['deleted'] == True:
                errors.append(
                    "Comment was deleted when it shouldn't have")
        else:
            errors.append("Response type is not json")
    else:
        errors.append(
            f"Response status code is {resp.status_code}, not 400")

    assert not errors
