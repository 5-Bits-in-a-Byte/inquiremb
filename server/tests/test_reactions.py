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

    # Check adding a like for errors
    resp1 = client.put(endpoint)
    errors = general_checker(resp1, endpoint,
                             put_checker, test_user, "post", "add", pcr_id=post_id)
    assert not errors

    # Check removing a like for errors
    resp2 = client.put(endpoint)
    errors = general_checker(resp2, endpoint,
                             put_checker, test_user, "post", "remove", pcr_id=post_id)
    assert not errors


def test_normal_comment_reaction_put(client, test_user, db):
    '''
    This tests for updating a comment reaction normally.
    There should be no errors.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up PUT request endpoint
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/reactions?commentid={comment_id}'

    # Check adding a like for errors
    resp1 = client.put(endpoint)
    errors = general_checker(resp1, endpoint,
                             put_checker, test_user, "comment", "add", pcr_id=comment_id)
    assert not errors

    # Check removing a like for errors
    resp2 = client.put(endpoint)
    errors = general_checker(resp2, endpoint,
                             put_checker, test_user, "comment", "remove", pcr_id=comment_id)
    assert not errors


def test_normal_reply_reaction_put(client, test_user, db):
    '''
    This tests for updating a reply reaction normally.
    There should be no errors.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint for reply (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    reply_endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Make a test reply
    test_reply_data = create_test_reply(client, reply_endpoint)
    reply_id = str(test_reply_data['_id'])
    endpoint = f'/api/reactions?replyid={reply_id}'

    # Check adding a like for errors
    resp1 = client.put(endpoint)
    errors = general_checker(resp1, endpoint,
                             put_checker, test_user, "reply", "add", pcr_id=reply_id, associated_id=comment_id)
    assert not errors

    # Check removing a like for errors
    resp2 = client.put(endpoint)
    errors = general_checker(resp2, endpoint,
                             put_checker, test_user, "reply", "remove", pcr_id=reply_id, associated_id=comment_id)
    assert not errors


def test_no_id_reaction_put(client, test_user, db):
    '''
    This tests for a PUT request to the reactions resource with no id provided.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up PUT request endpoint
    endpoint = f'/api/reactions'

    # Check adding a like for errors
    resp1 = client.put(endpoint)
    errors = general_checker(resp1, endpoint,
                             put_checker, test_user, "comment", "add")
    assert len(errors) == 1


def put_checker(resp, errors, pcr_id, test_user, pcr, test_type, associated_id=None):
    '''
    This function is the main function used for testing PUT requests for reactions.
    It tests to:
        - see if the reactions list is updated
    '''
    # Grab the JSON and user id
    response_data = resp.get_json()
    user_id = test_user['sub']

    # Check to see if the response shows the user liked the post
    if test_type == "add" and user_id not in response_data['reactions']['likes']:
        errors.append(
            f'User id {user_id} was not found in the response JSON')
    elif test_type == "remove" and user_id in response_data['reactions']['likes']:
        errors.append(
            f'User id {user_id} was found in the response JSON')

    # If we're dealing with a post
    if pcr == "post":
        # Check to see if the the like shows up in posts reaction field
        query = Post.objects.raw({'_id': pcr_id})
        post = query.first()
        if test_type == "add":
            reaction_field_checker_add(post, errors, user_id, "post")
        elif test_type == "remove":
            reaction_field_checker_remove(post, errors, user_id, "post")

    # If we're dealing with a comment
    elif pcr == "comment":
        query = Comment.objects.raw({'_id': pcr_id})
        comment = query.first()
        if test_type == "add":
            reaction_field_checker_add(comment, errors, user_id, "comment")
        elif test_type == "remove":
            reaction_field_checker_remove(comment, errors, user_id, "comment")

    # If we're dealing with a reply
    elif pcr == "reply":
        query = Comment.objects.raw({'_id': associated_id})
        comment = query.first()
        for reply in comment.replies:
            if reply._id == pcr_id:
                break
        if test_type == "add":
            reaction_field_checker_add(reply, errors, user_id, "reply")
        elif test_type == "remove":
            reaction_field_checker_remove(reply, errors, user_id, "reply")


# =================================
# ========= Helper Funcs ==========
# =================================


def general_checker(resp, endpoint, func_name, test_user, pcr, test_type, pcr_id=None, associated_id=None):
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
            if associated_id is None:
                func_name(resp, errors, pcr_id, test_user, pcr, test_type)
            else:
                func_name(resp, errors, pcr_id, test_user,
                          pcr, test_type, associated_id)
        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    return errors


def create_test_reply(client, endpoint):
    '''
    This function creates a simple test reply using a POST request.
    We need this for testing reactions for replies.
    '''
    # Set up POST data
    content = "test reply"
    is_anonymous = False
    data = {"content": content, "isAnonymous": is_anonymous}

    # Create the reply
    resp = client.post(endpoint, json=data)

    # Return None if an error occurred, otherwise return the reponse data
    if resp.status_code != 200:
        raise NameError(f"Response status code is {resp.status_code}, not 20")
    elif resp.status_code == 200:
        if resp.is_json:
            response_data = resp.get_json()
            return response_data
        else:
            raise NameError("Response type is not json")


def reaction_field_checker_add(pcr, errors, user_id, type_name):
    # pcr is either post/comment/reply
    likes = pcr.reactions['likes']
    if user_id not in likes:
        errors.append(
            f"User id {user_id} was not found in the {type_name}'s likes.")


def reaction_field_checker_remove(pcr, errors, user_id, type_name):
    # pcr is either post/comment/reply
    likes = pcr.reactions['likes']
    if user_id in likes:
        errors.append(
            f"User id {user_id} was found in the {type_name}'s likes.")
