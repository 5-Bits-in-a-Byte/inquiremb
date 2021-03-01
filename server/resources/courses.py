from flask_restful import reqparse, Resource
from flask import request
from enum import Enum
from mongo import *
from utils.argparser_types import str2bool
from auth import permission_layer, current_user

# Courses
# POST - Handles course creation
# Access - Instructor Only


class Courses(Resource):
    @permission_layer([])
    def post(self):
        # Get json for POST requests
        request.get_json(force=True)
        # Parse arguments
        parser = reqparse.RequestParser()
        # parser.add_argument('university')
        parser.add_argument('course')
        parser.add_argument('canJoinById', type=str2bool, default=True)
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        # Return the failed request with errors if errors exist
        if(bool(errors)):
            return {"errors": errors}, 400

        # Add the course to the user's course list
        user = User.objects.raw({'_id': current_user._id})
        user.courses.append(UserCourse(course_id=course._id, course_name=args.course, 
                                        canPost=True,
                                        seePrivate=True,
                                        canPin=True,
                                        canRemove=True,
                                        canEndorse=True,
                                        viewAnonymous=True,
                                        admin=True))
        user.save()
        # Add class to MongoDB
        course = Course(course=args.course, canJoinById=args.canJoinById).save()
        return {"_id": course._id, "course": course.course}, 200

    def validate_post(self, args):
        errors = []
        # if args.university is None:
        #     errors.append("University not specified")
        if args.course is None:
            errors.append("Please specify a course name")
        if args.canJoinById is None:
            errors.append("Please specify if the course is joinable by id")
        return errors
