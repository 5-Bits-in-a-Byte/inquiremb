""" Contains tests for the Posts resource """
import pytest


def test_instructor_course_get(client, test_user, db):
    '''
    This tests for a course that the user is the instructor of. 
    Should be able to see all posts including private.
    '''
    client.post('/test_user_login', json=test_user)
    course_id = db['course_ids']['instructor_course']
    endpoint = f'/api/courses/{course_id}/posts'
    resp = client.get(endpoint)

    errors = []
    # Bad Response
    if resp.status_code != 200:
        errors.append(f"Response status code is {resp.status_code}, not 200")
    # Good Response
    elif resp.status_code == 200:
        # Responds with JSON
        if resp.is_json:
            # Grab the JSON and initialize correct test post ids for the course
            data = resp.get_json()
            correct_ids = [f'post{i}id' for i in range(1, 5)]

            # Go through all the posts that were obtained from get request
            for post in data:
                # Make sure we're only getting posts for this class
                if post['_id'] not in correct_ids:
                    errors.append(
                        f'Posts with ids post1id, post2id, post3id, post4id are the only posts in this course. Somehow {post["_id"]} was obtained from this get request.')

                # Post is anonymous but name isn't anonymous
                if post['postedBy']['anonymous'] and post['postedBy']['first'] != "Anonymous":
                    errors.append(
                        f'Post is anonymous but the first name is {post["postedBy"]["first"]}')

                # Post is not anonymous but name is anonymous
                if not post['postedBy']['anonymous'] and post['postedBy']['first'] == "Anonymous":
                    errors.append(
                        f'Post is not anonymous but the first name is Anonymous')
        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    assert not errors


def test_user_course_get(client, test_user, db):
    '''
    This tests for a course that the user is not the instructor of. 
    Should be able to see only public posts.
    '''
    client.post('/test_user_login', json=test_user)
    course_id = db['course_ids']['student_course']
    endpoint = f'/api/courses/{course_id}/posts'
    resp = client.get(endpoint)

    errors = []
    # Bad Response
    if resp.status_code != 200:
        errors.append(f"Response status code is {resp.status_code}, not 200")
    # Good Response
    elif resp.status_code == 200:
        # Responds with JSON
        if resp.is_json:
            # Grab the JSON and initialize correct test post ids for the course
            data = resp.get_json()
            correct_ids = [f'post{i}id' for i in range(5, 9)]

            # Go through all the posts that were obtained from get request
            for post in data:
                # Make sure we're only getting posts for this class
                if post['_id'] not in correct_ids:
                    errors.append(
                        f'Posts with ids post5id, post6id, post7id, post8id are the only posts in this course. Somehow {post["_id"]} was obtained from this get request.')

                # Make sure we're not returning private posts to someone who isn't an instructor
                if post['isPrivate'] == True:
                    errors.append(
                        f'Returned private post in a course where test_user is not the instructor')

                # Post is anonymous but name isn't anonymous
                if post['postedBy']['anonymous'] and post['postedBy']['first'] != "Anonymous":
                    errors.append(
                        f'Post is anonymous but the first name is {post["postedBy"]["first"]}')

                # Post is not anonymous but name is anonymous
                if not post['postedBy']['anonymous'] and post['postedBy']['first'] == "Anonymous":
                    errors.append(
                        f'Post is not anonymous but the first name is Anonymous')
        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    assert not errors
