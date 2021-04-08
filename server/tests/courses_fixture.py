import pytest


@ pytest.fixture
def test_courses():
    courses = {"instructor_course": {
        "_id": "course1",
        "course": "Testy's Course",
        "canJoinById": True,
        "instructorID": "123456789",
    }, "student_course": {
        "_id": "course2",
        "course": "Prof. Testy's Course",
        "canJoinById": True,
        "instructorID": "987654321",
    }
    }
    return courses
