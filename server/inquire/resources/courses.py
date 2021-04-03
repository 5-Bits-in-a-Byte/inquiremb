'''
This file deals with the Courses resource. It's responsible for handling all requests sent from
the frontend for creating a new course.

Authors: Alec Springel
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
from flask_restful import reqparse, Resource
from flask import request
from enum import Enum
from inquire.utils.argparser_types import str2bool
import random

from inquire.mongo import *
from inquire.auth import permission_layer, current_user
from inquire.config import DEFAULT_COLORS

# Courses
# POST - Handles course creation
# Access - Instructor Only


class Courses(Resource):
    @permission_layer([])
    def post(self):
        """
        Creates a new course and responds with the instructor's permissions for the course
        ---
        tags:
          - Courses   
        parameters: 
          - name: body
            in: body
            required: true
            description: Course creation options
            schema:
              type: object
              properties:
                course:
                  type: string
                  description: Name of the course
                  example: CIS 422
        responses:
          200:
            description: Stored user data for the currently logged in user
            schema:
              $ref: '#/definitions/UserCourse'
          400:
            description: Array of errors gathered from request
            schema:
              $ref: '#/definitions/400Response'
          403:
            description: Unable to retrieve current user data
            schema:
              $ref: '#/definitions/403Response'
        """
        # Get json for POST requests
        request.get_json(force=True)
        # Parse arguments
        parser = reqparse.RequestParser()
        # parser.add_argument('university')
        parser.add_argument('course')
        parser.add_argument('canJoinById', type=str2bool, default=True)
        parser.add_argument('color')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        # Return the failed request with errors if errors exist
        if(bool(errors)):
            return {"errors": errors}, 400

        # Picking user course color
        if args['color'] is None:
            color = pick_color(DEFAULT_COLORS)
        else:
            color = args['color']
        print(color, args['color'])
        # Add the course to the user's course list and create the course
        course = Course(course=args.course,
                        canJoinById=args.canJoinById, instructorID=current_user._id).save()

        # Appends the course with permissions to the user who created it
        User.objects.raw({'_id': current_user._id}).update({"$push": {"courses":
                                                                      {"course_id": course._id, "course_name": args.course,
                                                                       "canPost": True, "seePrivate": True, "canPin": True,
                                                                       "canRemove": True, "canEndorse": True, "viewAnonymous": True,
                                                                       "admin": True, "color": color}}})
        return {"course_id": course._id, "course_name": args.course,
                "canPost": True, "seePrivate": True, "canPin": True,
                "canRemove": True, "canEndorse": True, "viewAnonymous": True,
                "admin": True, "color": color}, 200

    def validate_post(self, args):
        errors = []
        # if args.university is None:
        #     errors.append("University not specified")
        if args.course is None:
            errors.append("Please specify a course name")
        if args.canJoinById is None:
            errors.append("Please specify if the course is joinable by id")
        return errors


def pick_color(colors, default="#162B55"):
    existing_course_colors = []
    for course in current_user.courses:
        existing_course_colors.append(course.color)

    attempt_counter = 0
    while True and attempt_counter < 100:
        attempt_counter += 1
        choice = random.choice(colors)
        if choice not in existing_course_colors:
            break
    if attempt_counter == 100:
        choice = default
    return choice
