""" Contains tests for the Courses resource """
import pytest
import json
from inquire.mongo import *
from bson.objectid import ObjectId


# ===============================
# ========= POST Tests ==========
# ===============================


def test_normal_reply_post(client, test_user, db):
    '''
    This tests for creating a normal reply.
    Content is specified and it's not anonymous.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Set up POST request data
    content = "Normal test content"
    is_anonymous = False
    data = {"content": content, "isAnonymous": is_anonymous}

    # Call the test function
    resp = client.post(endpoint, json=data)
    errors = general_checker(resp, comment_id, endpoint, data, post_checker)
    assert not errors


def test_anonymous_reply_post(client, test_user, db):
    '''
    This tests for creating an anonymous reply.
    Content is specified and it is anonymous.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Set up POST request data
    content = "Normal test content"
    is_anonymous = True
    data = {"content": content, "isAnonymous": is_anonymous}

    # Call the test function
    resp = client.post(endpoint, json=data)
    errors = general_checker(resp, comment_id, endpoint, data, post_checker)
    assert not errors


def test_no_content_reply_post(client, test_user, db):
    '''
    This tests for creating a reply with no content.
    Content is not specified and the reply is not anonymous.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Set up POST request data
    is_anonymous = False
    data = {"isAnonymous": is_anonymous}

    # Call the test function
    resp = client.post(endpoint, json=data)
    errors = general_checker(resp, comment_id, endpoint, data, post_checker)
    assert len(errors) == 1


def post_checker(resp, data, errors, comment_id):
    # Grab the JSON
    response_data = resp.get_json()

    # Reply is anonymous but name is not anonymous
    if response_data['postedBy']['anonymous'] and response_data['postedBy']['first'] != "Anonymous":
        errors.append(
            f'Reply is anonymous but the first name is {post["postedBy"]["first"]}')

    # Reply is not anonymous but name is anonymous
    if not response_data['postedBy']['anonymous'] and response_data['postedBy']['first'] == "Anonymous":
        errors.append(
            f'Reply is not anonymous but the first name is Anonymous')

    # Content is empty
    if response_data['content'] is None:
        errors.append(f'Content field of the reply is None')

    # Make sure the reply was added to the comment's list of replies
    comment_query = Comment.objects.raw({'_id': comment_id})
    comment_object = comment_query.first()
    reply_added = False
    for reply in comment_object.replies:
        if reply._id == response_data['_id']:
            reply_added = True
            break
    if not reply_added:
        errors.append(
            f"The reply was not added to the comment's list of replies")


# ==============================
# ========= PUT Tests ==========
# ==============================

'''
WE SHOULD ADD:
- test for updating a reply that is not yours
'''


def test_normal_reply_put(client, test_user, db):
    '''
    This tests for updating a reply normally.
    There should be no errors.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Make a test reply
    test_reply_data = create_test_reply(client, endpoint)

    # Set up PUT request data
    content = "Updated content"
    _id = test_reply_data['_id']
    data = {"content": content, "_id": _id}

    # Check the put request for errors
    resp = client.put(endpoint, json=data)
    errors = general_checker(resp, comment_id, endpoint, data, put_checker)
    assert not errors


def test_no_content_reply_put(client, test_user, db):
    '''
    This tests for updating a reply but providing no content.
    A 400 error should happen here.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Make a test reply
    test_reply_data = create_test_reply(client, endpoint)

    # Set up PUT request data
    _id = test_reply_data['_id']
    data = {"_id": _id}

    # Check the put request for errors
    resp = client.put(endpoint, json=data)
    errors = general_checker(resp, comment_id, endpoint, data, put_checker)
    assert len(errors) == 1


def put_checker(resp, data, errors, comment_id):
    '''
    This function is the main function used for testing PUT requests for replies.
    It tests to:
        - make sure the correct response code is sent 
        - see if the content is updated
    '''
    # Grab the JSON
    response_data = resp.get_json()

    # Check if the content was updated
    query = Comment.objects.raw({'_id': comment_id})
    comment = query.first()
    for reply in comment.replies:
        if reply._id == data['_id'] and reply.content != data['content']:
            errors.append(f'Reply content was not updated')
            break


# =================================
# ========= DELETE Tests ==========
# =================================

'''
WE SHOULD ADD:
- test for deleting a reply that is not yours
'''


def test_normal_reply_delete(client, test_user, db):
    '''
    This tests for updating a reply normally.
    There should be no errors.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Make a test reply
    test_reply_data = create_test_reply(client, endpoint)

    # Set up PUT request data
    _id = test_reply_data['_id']
    data = {"_id": _id}

    # Check the put request for errors
    resp = client.delete(endpoint, json=data)
    errors = general_checker(resp, comment_id, endpoint, data, delete_checker)
    assert not errors


def test_no_id_reply_delete(client, test_user, db):
    '''
    This tests for updating a reply but providing no content.
    A 400 error should happen here.
    '''
    client.post('/test_user_login', json=test_user)

    # Establish the endpoint (use first post and first comment)
    post_id = db['post_ids'][0]
    comment_id = db['comment_ids'][0]
    endpoint = f'/api/posts/{post_id}/comments/{comment_id}/replies'

    # Make a test reply
    test_reply_data = create_test_reply(client, endpoint)

    # Set up PUT request data
    data = {}

    # Check the put request for errors
    resp = client.delete(endpoint, json=data)
    errors = general_checker(resp, comment_id, endpoint, data, delete_checker)
    assert len(errors) == 1


def delete_checker(resp, data, errors, comment_id):
    '''
    This function is the main function used for testing PUT requests for replies.
    It tests to:
        - make sure the correct response code is sent 
        - see if the content is updated
    '''
    # Grab the JSON
    response_data = resp.get_json()

    # Check if the reply was deleted
    query = Comment.objects.raw({'_id': comment_id})
    comment = query.first()
    for reply in comment.replies:
        if reply._id == data['_id']:
            errors.append(f'Reply with id {data["_id"]} was not deleted')


# =================================
# ========= Helper Funcs ==========
# =================================

def create_test_reply(client, endpoint):
    '''
    This function creates a simple test reply using a POST request.
    We need this for the PUT and DELETE test since we have to have 
    a reply to update/delete and we don't have a fixture for replies.
    '''
    # Set up POST data
    content = "test reply"
    is_anonymous = False
    data = {"content": content, "isAnonymous": is_anonymous}

    # Create the reply
    resp = client.post(endpoint, json=data)

    # Return None if an error occurred, otherwise return the reponse data
    if resp.status_code != 200:
        return None
    elif resp.status_code == 200:
        if resp.is_json:
            response_data = resp.get_json()
            return response_data
        else:
            return None


def general_checker(resp, comment_id, endpoint, data, func_name):
    '''
    This function is the main function used for testing PUT requests for replies.
    It tests to:
        - make sure the correct response code is sent 
        - see if the content is updated
    '''
    errors = []
    if resp.status_code != 200:
        errors.append(f"Response status code is {resp.status_code}, not 200")
    # Good Response
    elif resp.status_code == 200:
        # Responds with JSON
        if resp.is_json:
            func_name(resp, data, errors, comment_id)
        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    return errors
