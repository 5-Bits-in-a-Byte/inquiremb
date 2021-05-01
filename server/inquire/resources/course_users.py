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
    # @permission_layer(require_login=False)
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
            print("Users Test: ", users)
            for user in users:
                print("User Test: ", user)
                result.append({"role": role, "userName": user.first + " " + user.last, "userImg": user.picture})

        return {"status": "Success!", "data": result}, 200
