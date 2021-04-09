""" Contains tests for the Courses resource """
import pytest
# import json
from inquire.mongo import *


def test_normal_course_post(client, test_user):
    '''
    This tests for creating a normal course where only a name is given.
    '''
    client.post('/test_user_login', json=test_user)
    course_name = "post test"
    data = {"course": course_name}
    errors = post_checker(client, test_user, data)
    assert not errors


def test_color_specified(client, test_user):
    '''
    This tests for a course where a name was given and a color was specified.
    '''
    client.post('/test_user_login', json=test_user)
    course_name = "post test 2"
    color = "#FFFFFF"
    data = {"course": course_name, "color": color}
    errors = post_checker(client, test_user, data)
    assert not errors


def test_name_not_specified(client, test_user):
    '''
    This tests that an error is raised when no course name is specified.
    '''
    client.post('/test_user_login', json=test_user)
    data = {}
    errors = post_checker(client, test_user, data)
    assert len(errors) == 1


def post_checker(client, test_user, data):
    resp = client.post('/api/courses', json=data)

    errors = []
    # Bad Response
    if resp.status_code != 200:
        errors.append(f"Response status code is {resp.status_code}, not 200")
    # Good Response
    elif resp.status_code == 200:
        # Responds with JSON
        if resp.is_json:
            # Grab the JSON
            response_data = resp.get_json()

            # Make sure the course name was assigned properly
            if response_data['courseName'] != data['course']:
                errors.append(
                    f'response_data["courseName"] is {response_data["courseName"]} when it should be {data["course"]}')

            # Make sure the color was randomly assigned
            if response_data['color'] is None:
                errors.append(
                    f'Default color was not assigned so response_data["color"] is None')

            # Make sure if a color was specified that it was assigned properly
            try:
                if data['color'] and response_data['color'] != data['color']:
                    errors.append(
                        f'Color was not assigned properly: color should be {data["color"]} but is actually {response_data["color"]}')
            except:
                pass

            # Make sure the course was added to the response_database
            course_query = Course.objects.raw(
                {'_id': response_data['courseId']})
            course_count = course_query.count()
            if course_count == 0:
                errors.append(
                    f'The test course was not added to the Course resource')
            elif course_count > 1:
                errors.append(
                    f'The test course was added more than once to the Course resource or it already exists')

            # Make sure the course was added to the user's list of courses
            user_query = User.objects.raw({'_id': test_user['sub']})
            user_object = user_query.first()
            course_added = False
            for course in user_object.courses:
                if course.courseId == response_data['courseId']:
                    course_added = True
                    break
            if not course_added:
                errors.append(
                    f"The course was not added to the user's list of courses")

        # Does not respond with JSON
        else:
            errors.append("Response type is not json")
    return errors
