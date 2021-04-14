""" Contains tests for the Posts resource """
import pytest
from inquire.mongo import *


# ==============================
# ========= GET Tests ==========
# ==============================

def test_normal_instructor_post_get(client, test_user, db):
    '''
    This tests for a course that the user is the instructor of. 
    Should be able to see all posts including private.
    '''
    client.post('/test_user_login', json=test_user)
    course_id = db['course_ids']['instructor_course']
    endpoint = f'/api/courses/{course_id}/posts'
    resp = client.get(endpoint)
    errors = general_checker(resp, normal_get_checker,
                             test_user, user_type="instructor")
    assert not errors


def test_normal_student_post_get(client, test_user, db):
    '''
    This tests for a course that the user is not the instructor of. 
    Should be able to see only public posts.
    '''
    client.post('/test_user_login', json=test_user)
    course_id = db['course_ids']['student_course']
    endpoint = f'/api/courses/{course_id}/posts'
    resp = client.get(endpoint)
    errors = general_checker(resp, normal_get_checker,
                             test_user, user_type="student")
    assert not errors


def test_sortby_oldest(client, test_user, db):
    '''
    This tests the sortby query.
    Response should return posts in reverse order.
    '''
    client.post('/test_user_login', json=test_user)
    course_id = db['course_ids']['instructor_course']
    endpoint = f'/api/courses/{course_id}/posts'
    resp = client.get(endpoint)
    errors = general_checker(resp, sortby_get_checker, test_user)
    assert not errors


def normal_get_checker(resp, errors, user_type):
    # Grab the JSON and initialize correct test post ids for the course
    data = resp.get_json()
    # raise NameError(data)

    if user_type == "instructor":
        correct_ids = [f'post{i}id' for i in range(1, 5)]
    elif user_type == "student":
        # post7 and post8 are private so the student shouldn't see these
        correct_ids = [f'post{i}id' for i in range(5, 7)]

    count = 0
    # Go through all the posts that were obtained from get request
    for post in data:
        # Make sure we're only getting posts for this class
        if post['_id'] not in correct_ids:
            errors.append(
                f'Posts with ids post5id, post6id, post7id, post8id are the only posts in this course. Somehow {post["_id"]} was obtained from this get request.')

        if user_type == "student":
            # Make sure we're not returning private posts to someone who isn't an instructor
            if post['isPrivate']:
                errors.append(
                    f'Returned private post in a course where test_user is not the instructor')

        if user_type == "instructor":
            if post['isPrivate']:
                count += 1

        # Post is anonymous but name isn't anonymous
        if post['postedBy']['anonymous'] and post['postedBy']['first'] != "Anonymous":
            errors.append(
                f'Post is anonymous but the first name is {post["postedBy"]["first"]}')

        # Post is not anonymous but name is anonymous
        if not post['postedBy']['anonymous'] and post['postedBy']['first'] == "Anonymous":
            errors.append(
                f'Post is not anonymous but the first name is Anonymous')

    if count != 2 and user_type == "instructor":
        errors.append(
            f'There should be two private posts getting returned. Instead there are {count}.')


def sortby_get_checker(resp, errors):
    # Grab the JSON
    data = resp.get_json()
    correct_ids = [f'post{i}id' for i in range(1, 5)]
    correct_ids.reverse()
    num_posts = len(data)

    for i in range(num_posts):
        if data[i]['_id'] != correct_ids[i]:
            errors.append(
                f"Response JSON doesn't return posts in reverse order: {data[i]['_id']} != {correct_ids[i]}")


# =================================
# ========= Helper Funcs ==========
# =================================


def general_checker(resp, func_name, test_user, user_type=None):
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
            if user_type:
                func_name(resp, errors, user_type)
            else:
                func_name(resp, errors)
        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    return errors
