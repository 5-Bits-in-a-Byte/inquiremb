""" Contains tests for the Reply resource """
import pytest
from inquire.mongo import *


# ==============================
# ========= PUT Tests ==========
# ==============================


def test_normal_post_reaction_put(client, test_user, db):
    '''
    This tests for updating a post reaction normally.
    There should be no errors.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up PUT request endpoint
    post_id = db['post_ids'][0]
    endpoint = f'/api/reactions?postid={post_id}'

    # Check the put request for errors
    resp = client.put(endpoint)
    errors = general_checker(resp, post_id, endpoint,
                             data, put_checker, test_user)
    assert not errors


def put_checker(resp, data, errors, type_id, test_user):
    '''
    This function is the main function used for testing PUT requests for reactions.
    It tests to:
        - see if the reactions list is updated
    '''
    # Grab the JSON
    response_data = resp.get_json()

    # If we're dealing with a post
    if "post" in type_id:
        user_id = test_user['sub']
        if user_id not in response_data['reactions']['likes']:
            errors.append(
                f'User id {user_id} was not found in the response JSON')

        query = Post.objects.raw({'_id': type_id})
        post = query.first()
        likes = post.reactions['likes']
        if user_id not in likes:
            errors.append(
                f"User id {user_id} was not found in the post's likes.")


# =================================
# ========= Helper Funcs ==========
# =================================


def general_checker(resp, type_id, endpoint, data, func_name, test_user):
    '''
    This function is the general response status and JSON checker.
    It tests to:
        - make sure the correct response status codes are sent
        - make sure the response sends JSON
    '''
    errors = []
    if resp.status_code != 200:
        errors.append(f"Response status code is {resp.status_code}, not 200")
    # Good Response
    elif resp.status_code == 200:
        # Responds with JSON
        if resp.is_json:
            func_name(resp, data, errors, type_id, test_user)
        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    return errors
