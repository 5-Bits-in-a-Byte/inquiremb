from flask import request, current_app
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io


class Roles(Resource):
    @permission_layer(required_permissions=["publish-reply", "privacy-private"])
    def get(self, courseId):
        # Query for courseId
        course_query = Course.objects.raw({"_id": courseId})
        # Error check
        course_count = course_query.count()
        if course_count > 1:
            return {"error": [f"Multiple courses with id: {courseId}"]}, 400
        elif course_count == 0:
            return {"error": [f"No courses with id: {courseId}"]}, 400
        else:
            # Grab the course we're looking for
            course = course_query.first()
            # Initialize list of roles to return
            role_list = []
            # Loop through all roles associated with a course and add it to the return list
            for role_id in course.roles:
                role_query = Role.objects.raw({"_id": role_id})
                role_count = role_query.count()
                if role_count > 1:
                    return {"error": [f"Multiple roles with id: {role_id}"]}, 400
                elif role_count == 0:
                    return {"error": [f"No roles with id: {role_id}"]}, 400
                else:
                    role = self._serialize(role_query.first())
                    role_list.append(role)
            return role_list

    def post(self, courseId):
        parser = reqparse.RequestParser()
        parser.add_argument('permissions', type=dict)
        parser.add_argument('name')
        args = parser.parse_args()
        try:
            new_role = Role(
                name="test", permissions=args['permissions']).save()
            return {"status": "success", "role": self._serialize(new_role)}
        except Exception as exc:
            if type(exc) == list:
                return {"errors": [str(e) for e in exc]}
            else:
                return {"errors": str(exc)}

    def _serialize(self, role):
        j = role.to_son()
        j["_id"] = str(j["_id"])
        return j
