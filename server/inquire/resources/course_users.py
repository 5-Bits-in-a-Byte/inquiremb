'''
This file deals with the MeRole resource. It's responsible for handling the get request
to obtain the current_user's permissions.

Authors: Seth Tal
Group Name: 5 Bits in a Byte

Last Modified Date: 04/30/2021
'''
from flask import jsonify
from flask_restful import Resource, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *


class CourseUsers(Resource):
    # TODO: @permission_layer(require_login=False)
    def get(self, courseId=None):
        try:
            course = Course.objects.get({"_id": courseId})
        except Course.DoesNotExist:
            return {"errors": "Error: Course with id " + courseId + " does not exist."}, 400
        except Course.MultipleObjectsReturned:
            return {"errors": "Error: Multiple objects with id " + courseId + " were found."}, 400

        result = []
        for role in course.roles:
            # TODO: add a thingy for role color...
            users = User.objects.raw({"_id": {"$in": course.roles[role]}})
            # print("Users Test: ", users)
            for user in users:
                # print("User Test: ", user)
                result.append({"role": role, "userName": user.first + " " +
                               user.last, "userImg": user.picture, "userId": user._id})

        return {"status": "Success!", "data": result}, 200

    def put(self, courseId=None):
        parser = reqparse.RequestParser()
        parser.add_argument('role')
        parser.add_argument('user')
        args = parser.parse_args()

        # Validate the args
        errors = self.__validate_put(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # the new role that will overwrite the old role
        new_role = args['role']
        user_to_update = args['user']

        try:
            user = User.objects.get({"_id": user_to_update})
        except User.DoesNotExist:
            # Print statement for debugging, return for frontend error display
            print(f"ERROR: User with id {user_to_update} does not exist.")
            return {"errors": ["The user you are trying to update was not found. Please try again."]}, 400
        except User.MultipleObjectsReturned:
            # Print statement for debugging, return for frontend error display
            print(
                f"ERROR: Multiple users with id {user_to_update} were found.")
            return {"errors": ["The user you are trying to update was found multiple times. Please try again."]}, 400

        try:
            Role.objects.get({"_id": new_role})
        except Role.DoesNotExist:
            # Print statement for debugging, return for frontend error display
            print(f"ERROR: Role with id {new_role} does not exist.")
            return {"errors": ["The role you are trying to assign was not found. Please try again."]}, 400
        except Role.MultipleObjectsReturned:
            # Print statement for debugging, return for frontend error display
            print(
                f"ERROR: Multiple roles with id {new_role} were found.")
            return {"errors": ["The role you are trying to assign was found multiple times. Please try again."]}, 400

        # Changes the user's role for the course with ID: courseId
        for course in user.courses:
            if course.courseId == courseId:
                course.role = new_role
                user.save()

        try:
            course = Course.objects.get({"_id": courseId})
        except Course.DoesNotExist:
            # Print statement for debugging, return for frontend error display
            print(f"ERROR: Course with id {courseId} does not exist.")
            return {"errors": ["The course you are trying to modify roles for was not found. Please try again."]}, 400
        except Course.MultipleObjectsReturned:
            # Print statement for debugging, return for frontend error display
            print(f"ERROR: Multiple courses with id {courseId} were found.")
            return {"errors": ["The course you are trying to modify roles for was found multiple times. Please try again."]}, 400

        for role in course.roles:
            for u in course.roles[role]:
                if user_to_update == u:
                    course.roles[role].remove(user_to_update)

        for role in course.roles:
            if role == new_role:
                course.roles[role].append(user_to_update)

        course.save()

        return {"status": "Success!"}, 200

    def __validate_put(self, args):
        errors = []
        if args.role is None:
            errors.append("Role ID not provided in request to Flask.")
        if args.user is None:
            errors.append("User ID not provided in request to Flask.")
        return errors
