from flask_restful import reqparse, Resource
from flask import request
from enum import Enum
from mongo import *
from utils.argparser_types import str2bool


# Courses
# POST - Handles course creation
# Access - Instructor Only
class Courses(Resource):
    def post(self):
        # Get json for POST requests
        request.get_json(force=True)
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('university')
        parser.add_argument('course')
        parser.add_argument('canJoinById', type=str2bool, default=False)
        args = parser.parse_args()

        # Validate the args
        errors = self.validatePost(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Add class to MongoDB
        Course(university=args.university, course=args.course, canJoinById=args.canJoinById).save()
        return errors, 200

    def validatePost(self, args):
        errors = {}
        if args.university is None:
            errors["university"] = "University not specified"
        if args.course is None:
            errors["course"] = "Please specify a course name"
        if args.course is None:
            errors["canJoinById"] = "Please specify if the course is joinable by id"
        return errors
