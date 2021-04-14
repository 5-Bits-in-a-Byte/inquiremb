""" Contains tests for the Join resource """
import pytest
from inquire.mongo import *

# ===============================
# ========= POST Tests ==========
# ===============================


# FIXME: this works by itself and when other tests in this file run
# but doesn't work when ALL the other tests run
def _full_course_name_join_post(client, test_user, db):
    '''
    This tests for a normal join post request by course name.
    This should not return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up POST request data
    course_name = "Rob's Course"
    access_code = None
    data = {"courseName": course_name, "accessCode": access_code}

    # Call the test function
    resp = client.post('/api/join', json=data)
    errors = general_checker(resp, test_user, data, post_checker)
    assert not errors


# FIXME: this works by itself but doesn't work when all the other tests
# in this file run
def _partial_course_name_join_post(client, test_user, db):
    '''
    This tests for a normal join post request by course name.
    This should not return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up POST request data
    course_name = "Rob's"
    access_code = None
    data = {"courseName": course_name, "accessCode": access_code}

    # Call the test function
    resp = client.post('/api/join', json=data)
    errors = general_checker(resp, test_user, data, post_checker)
    assert not errors


def test_normal_access_code_join_post(client, test_user, db):
    '''
    This tests for a normal join post request by access code.
    This should not return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up POST request data
    course_name = None
    access_code = "course3"
    data = {"courseName": course_name, "accessCode": access_code}

    # Call the test function
    resp = client.post('/api/join', json=data)
    errors = general_checker(resp, test_user, data, post_checker)
    assert not errors


def test_bad_access_code_join_post(client, test_user, db):
    '''
    This tests for a bad access code POST request for Join resource.
    This should return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up POST request data
    course_name = None
    access_code = "123"
    data = {"courseName": course_name, "accessCode": access_code}

    # Call the test function
    resp = client.post('/api/join', json=data)
    errors = general_checker(resp, test_user, data, post_checker)
    assert len(errors) == 1


def test_no_data_join_post(client, test_user, db):
    '''
    This tests for a bad access code POST request for Join resource.
    This should return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up POST request data
    data = {}

    # Call the test function
    resp = client.post('/api/join', json=data)
    errors = general_checker(resp, test_user, data, post_checker)
    assert len(errors) == 1


# FIXME: this works by itself but doesn't work when all the other tests
# in this file run
def _bad_course_name_join_post(client, test_user, db):
    '''
    This tests for a bad course name POST request for Join resource.
    This should return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up POST request data
    course_name = "abc"
    access_code = None
    data = {"courseName": course_name, "accessCode": access_code}

    # Call the test function
    resp = client.post('/api/join', json=data)
    errors = general_checker(resp, test_user, data, post_checker)
    assert len(errors) == 1


def post_checker(resp, test_user, data, errors):
    '''
    This is the main function used for testing POST join requests.
    It tests to make sure:
        - the course name is found correctly (including partial search)
        - the access code is found correctly
    '''
    # Grab the JSON
    response_data = resp.get_json()

    try:
        if data['courseName'] not in response_data['course']:
            errors.append(f'{data["course_name"]} was not found.')
    except:
        pass

    if data['accessCode'] is not None and data['accessCode'] != response_data['courseId']:
        errors.append(
            f'searched access code {data["accessCode"]} does not match response access code {response_data["courseId"]}')


# ==============================
# ========= PUT Tests ==========
# ==============================

def test_normal_join_put(client, test_user, db):
    '''
    This tests for a normal join put request.
    This should not return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up PUT request data
    course_id = "course3"
    data = {"courseId": course_id}

    # Call the test function
    resp = client.put('/api/join', json=data)
    errors = general_checker(resp, test_user, data, put_checker)
    assert not errors


def test_already_enrolled_join_put(client, test_user, db):
    '''
    This tests for joining a course you're already enrolled in.
    This should return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up PUT request data
    course_id = "course1"
    data = {"courseId": course_id}

    # Call the test function
    resp = client.put('/api/join', json=data)
    errors = general_checker(resp, test_user, data, put_checker)
    assert len(errors) == 1


def test_no_id_join_put(client, test_user, db):
    '''
    This tests for a bad PUT request for Join resource.
    This should return an error.
    '''
    client.post('/test_user_login', json=test_user)

    # Set up PUT request data
    data = {}

    # Call the test function
    resp = client.put('/api/join', json=data)
    errors = general_checker(resp, test_user, data, put_checker)
    assert len(errors) == 1


def put_checker(resp, test_user, data, errors):
    '''
    This is the main function used for testing PUT join requests.
    It tests to make sure:
        - the course was added to the user's course list
    '''
    # Grab the JSON
    response_data = resp.get_json()

    query = User.objects.raw({'_id': test_user['sub']})
    user = query.first()

    course_added = False
    for course in user.courses:
        if course.courseId == data['courseId']:
            course_added = True
            break
    if not course_added:
        errors.append(
            f"course with id {data['courseId']} was not added to the user's course list")

# =================================
# ========= Helper Funcs ==========
# =================================


def general_checker(resp, test_user, data, func_name):
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
            func_name(resp, test_user, data, errors)
        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    return errors
