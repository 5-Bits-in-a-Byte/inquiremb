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
import pymodm
from inquire.auth import permission_layer, current_user
from inquire.config import DEFAULT_COLORS
from inquire.roles import student, admin
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
        # Creating initial roles available in course
        student_role = Role(name="student", permissions=student).save()
        admin_role = Role(name="admin", permissions=admin).save()
        roles = {student_role._id: [], admin_role._id: [current_user._id]}

        # Add the course to the user's course list and create the course
        course = Course(course=args.course,
                        canJoinById=args.canJoinById, instructorID=current_user._id, roles=roles, defaultRole=student_role._id, blacklist=[]).save()

        # Appends the course with permissions to the user who created it
        user_course = UserCourse(
            courseId=course._id, courseName=args.course, color=color, role=admin_role._id)
        current_user.courses.append(user_course)
        current_user.save()

        return {"courseId": course._id, "courseName": args.course,
                "color": color}, 200

    def get(self):
        # Parse arguments
        # parser = reqparse.RequestParser()
        # parser.add_argument('courseId')
        # args = parser.parse_args()
        courseId = request.args.get('courseId')

        # print("args[courseId]:", args['courseId'])

        # Get the course object that corresponds to the courseId
        try:
            course = Course.objects.get({"_id": courseId})
        except Course.DoesNotExist:
            return {"errors": "Error: Course with id " + courseId + " does not exist."}, 400
        except Course.MultipleObjectsReturned:
            return {"errors": "Error: Multiple courses with id " + courseId + " were found."}, 400

        return {"success": course.to_son()}, 200

    def delete(self):
        # Parse argument
        courseId = request.args.get('courseId')
        # Query for courses matching the courseid
        query = Course.objects.raw({"_id": courseId})
        # Error checking even though these shouldn't happen
        count = query.count()
        if count > 1:
            return {"errors": [f"More than one course with id {courseId}"]}, 400
        elif count == 0:
            return {"errors": [f"No course with id {courseId}"]}, 400
        # Get the course to delete
        courseToDelete = query.first()
        # Check permissions
        if current_user._id != courseToDelete.instructorID:
            return {"errors": ["Access denied"]}, 400

        # Query for user's with matching courseId in their course list
        user_query = User.objects.raw(
            {"courses": {"$elemMatch": {"courseId": courseId}}})
        user_count = user_query.count()
        # Error check the count of user query
        if user_count > 0:
          # Loop through user's in the course and their courses
            for user in user_query:
                for course in user.courses:
                    # Remove the course from the user's course list
                    if course.courseId == courseId:
                        pop_idx = user.courses.index(course)
                        user.courses.pop(pop_idx)
                user.save()

            # Remove all roles associated with a course
            for role_id in courseToDelete.roles:
                try:
                    role_to_delete = Role.objects.get({"_id": role_id})
                except Role.DoesNotExist:
                    return {"errors": "Error: Role with id " + role_id + " does not exist."}, 400
                except Role.MultipleObjectsReturned:
                    return {"errors": "Error: Multiple roles with id " + role_id + " were found."}, 400
                role_to_delete.delete()
        else:
            return {"errors": ["No users with this course"]}, 400

        # Delete all posts associated with the course
        post_query = Post.objects.raw({"courseId": courseId})
        posts = list(post_query)
        for post in posts:
            # Delete all comments associated with each post in the course
            comment_query = Comment.objects.raw({"postId": post._id})
            count = comment_query.count()
            comments = list(comment_query)
            for comment in comments:
                comment.delete()
            post.delete()

        # Delete the course itself
        courseToDelete.delete()
        return {"success": "successful delete"}, 200

    def put(self):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('courseId')
        parser.add_argument('color')
        parser.add_argument('nickname')
        parser.add_argument('removeNickname', type=bool, default=False)
        args = parser.parse_args()

        # Make sure the course exists
        try:
            Course.objects.get({"_id": args['courseId']})
        except Course.DoesNotExist:
            return {"errors": "Error: Course with id " + args['courseId'] + " does not exist."}, 400
        except Course.MultipleObjectsReturned:
            return {"errors": "Error: Multiple courses with id " + args['courseId'] + " were found."}, 400

        # Get the correct user course object to update
        for course in current_user.courses:
            if course.courseId == args['courseId']:
                break

        # Update the course nickname
        if args['nickname'] is not None and args['nickname'] != "":
            course.nickname = args['nickname']
        elif args['nickname'] == "":
            return {"errors": ["Invalid nickname"]}, 400

        # Update the course color
        if args['color'] is not None and args['color'] != "":
            course.color = args['color']
        elif args['color'] == "":
            return {"errors": ["Invalid color"]}, 400

        # Remove the course nickname
        if args['removeNickname'] and course.nickname:
            course.nickname = None
        elif args['removeNickname'] and not course.nickname:
            return {"errors": ["No nickname to remove"]}, 400

        # Save and return success
        current_user.save()
        return {"success": "Course updated successfully"}, 200

    # def put(self):
    #     # Parse args
    #     courseId = request.args.get('courseId')
    #     color = request.args.get('color')
    #     nickname = request.args.get('nickname')

    #     # Query for courses matching the courseid
    #     query = Course.objects.raw({"_id": courseId})
    #     # Error checking even though these shouldn't happen
    #     count = query.count()
    #     if count > 1:
    #         return {"errors": [f"More than one course with id {courseId}"]}, 400
    #     elif count == 0:
    #         return {"errors": [f"No course with id {courseId}"]}, 400

    #     # Get the correct user course object to update
    #     for course in current_user.courses:
    #         if course.courseId == courseId:
    #             break

    #     # Update nickname
    #     if color is None or color == "":
    #         course.nickname = nickname
    #     # Update color
    #     elif nickname is None or nickname == "":
    #         course.color = color
    #     # Nothing valid sent to backend
    #     else:
    #         return {"errors": [f"No color or nickname provided"]}, 400

    #     # Save changes and return
    #     current_user.save()
    #     return {"success": "Course updated successfully"}, 200

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
