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
        roles = [student_role._id, admin_role._id]

        # Add the course to the user's course list and create the course
        course = Course(course=args.course,
                        canJoinById=args.canJoinById, instructorID=current_user._id, roles=roles, defaultRole=student_role._id).save()

        # Appends the course with permissions to the user who created it
        user_course = UserCourse(courseId=course._id, courseName=args.course, color=color, role=admin_role._id)
        current_user.courses.append(user_course)
        current_user.save()

        return {"courseId": course._id, "courseName": args.course,
                "color": color}, 200

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
        # Parse args
        courseId = request.args.get('courseId')
        color = request.args.get('color')
        nickname = request.args.get('nickname')

        # Query for courses matching the courseid
        query = Course.objects.raw({"_id": courseId})
        # Error checking even though these shouldn't happen
        count = query.count()
        if count > 1:
            return {"errors": [f"More than one course with id {courseId}"]}, 400
        elif count == 0:
            return {"errors": [f"No course with id {courseId}"]}, 400

        # Get the correct user course object to update
        for course in current_user.courses:
            if course.courseId == courseId:
                break

        # Update nickname
        if color is None or color == "":
            course.nickname = nickname
        # Update color
        elif nickname is None or nickname == "":
            course.color = color
        # Nothing valid sent to backend
        else:
            return {"errors": [f"No color or nickname provided"]}, 400

        # Save changes and return
        current_user.save()
        return {"success": "Course updated successfully"}, 200

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
