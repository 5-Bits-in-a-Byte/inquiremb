"""
Contains PyTest fixtures used in multiple tests

To run use the command "pytest" after installing the pytest module
"""
import pytest
from flask import make_response, request
from inquire import create_app
import inquire.config as config
from inquire.mongo import *
from pymodm.connection import connect
from inquire.auth import create_user, encode_jwt
import os

from comments_fixture import test_comments
from posts_fixture import test_posts
from users_fixture import test_users
from courses_fixture import test_courses
from main_testuser_fixture import test_user

# Test Database URI
test_mongo_uri = os.environ['TEST_MONGO_URI']
if test_mongo_uri:
    config.MONGO_URI = test_mongo_uri
elif test_mongo_uri is None:
    raise Error("Missing mongodb test URI")
elif test_mongo_uri == config.MONGO_URI:
    raise Error("Don't use normal mongodb for testing")
config.TESTING = True


@ pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app(override_config=config, include_socketio=False)

    @ app.route('/test_user_login', methods=["POST"])
    def test_user_login():
        user = request.get_json()
        create_user(user)
        resp = make_response("test user logged in")
        resp.set_cookie(
            'userID', value=encode_jwt({'_id': user['sub']}), httponly=True, max_age=60)
        return resp

    @ app.route('/test_user_logout', methods=["POST"])
    def test_user_logout():
        resp = make_response("test user logged out")
        resp.set_cookie('userID', value="", max_age=0)
        return resp

    return app


@ pytest.fixture
def db(app, test_users, test_courses, test_posts, test_comments):
    # Wiping the database between tests
    app.db['user'].drop()
    app.db['course'].drop()
    app.db['post'].drop()
    app.db['comment'].drop()

    # Adding User and Course objects to database, saving Ids for use in test functions
    id_dict = {}
    # Adding User Objects
    id_dict['user_ids'] = [User(**user).save()._id for user in test_users]

    # Adding Course Objects
    id_dict['course_ids'] = {key: Course(
        **course).save()._id for key, course in test_courses.items()}

    # Adding Post Objects
    id_dict['post_ids'] = [Post(**post).save()._id for post in test_posts]

    # Adding Comment Objects
    id_dict['comment_ids'] = [
        Comment(**comment).save()._id for comment in test_comments]

    add_user_courses(id_dict['course_ids'], test_users, test_courses)

    return id_dict


def create_user_course_json(course_id, course_name, is_instructor):
    if is_instructor:
        user_course = {"courseId": course_id, "courseName": course_name,
                       "canPost": True, "seePrivate": True, "canPin": True,
                       "canRemove": True, "canEndorse": True, "viewAnonymous": True,
                       "admin": True, "color": "#162B55"}
    else:
        user_course = {"courseId": course_id, "courseName": course_name,
                       "canPost": True, "seePrivate": False, "canPin": False,
                       "canRemove": False, "canEndorse": False, "viewAnonymous": False,
                       "admin": False, "color": "#162B55"}
    return user_course


def add_user_course(user_id, user_course_json):
    User.objects.raw({'_id': user_id}).update(
        {"$push": {"courses": user_course_json}})


def add_user_courses(course_ids, test_users, test_courses):
    # Defining JSON for instructor UserCourse
    course_id = course_ids['instructor_course']
    course_name = test_courses['instructor_course']['course']
    instructor_user_course = create_user_course_json(
        course_id, course_name, True)
    # Adding instructor UserCourse to Testy
    add_user_course(test_users[0]['_id'], instructor_user_course)

    course_id = course_ids['student_course']
    course_name = test_courses['student_course']['course']
    instructor_user_course = create_user_course_json(
        course_id, course_name, True)
    # Adding different instructor UserCourse to Prof. Testy
    add_user_course(test_users[1]['_id'], instructor_user_course)

    course_id = course_ids['instructor_course']
    course_name = test_courses['instructor_course']['course']
    student_user_course = create_user_course_json(
        course_id, course_name, False)

    # Adding Prof. Testy and Rob as students to Testy's course
    add_user_course(test_users[1]['_id'], student_user_course)
    add_user_course(test_users[2]['_id'], student_user_course)

    course_id = course_ids['student_course']
    course_name = test_courses['student_course']['course']
    student_user_course = create_user_course_json(
        course_id, course_name, False)
    # Adding Testy and Rob as students to Prof. Testy's course
    add_user_course(test_users[0]['_id'], student_user_course)
    add_user_course(test_users[2]['_id'], student_user_course)


@ pytest.fixture
def client(app, db):
    """A test client for the app."""
    return app.test_client()
