from flask import request
from flask_restful import Resource, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *


class LeaveCourse(Resource):
    def put(self):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('courseId')
        args = parser.parse_args()

        # Get the course you want to leave
        try:
            course_to_leave = Course.objects.get({'_id': args['courseId']})
        except Course.DoesNotExist:
            return {'deleted': False, 'errors': f"No course with id {args['courseId']}"}, 403
        except Course.MultipleObjectsReturned:
            return {'deleted': False, 'errors': f"Duplicate course detected, multiple courses in database with id {args['courseId']}"}, 400

        # Creator of a course should delete instead
        # TODO: maybe check to see if the creator passed off the admin role to another user in the course?
        if current_user._id == course_to_leave.instructorID:
            return {"errors": ["Creators of a course cannot leave. Instead delete the course."]}, 400

        # Leave the course itself
        enrolled_in_course = False
        for course in current_user.courses:
            if course.courseId == args['courseId']:
                enrolled_in_course = True
                current_user.courses.remove(course)
                break

        # Trying to leave a course you're not even in
        if not enrolled_in_course:
            return {"errors": [f"You are not enrolled in any course with ID {args['courseId']}"]}, 400

        # Delete yourself from the roles list in the course
        course_to_leave.roles[course.role].remove(current_user._id)

        # Save the changes we've made
        current_user.save()
        course_to_leave.save()

        return {"success": [f"Successfully left {course.courseName}"]}, 200
