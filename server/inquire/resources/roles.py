from flask import request, current_app
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io


class Roles(Resource):
    @permission_layer(required_permissions=["admin-configure"])
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

    @permission_layer(required_permissions=["admin-configure"])
    def post(self, courseId):
        parser = reqparse.RequestParser()
        parser.add_argument('permissions', type=dict)
        parser.add_argument('name')
        args = parser.parse_args()
        try:
            new_role = Role(
                name=args['name'], permissions=args['permissions']).save()
            return {"status": "success", "role": self._serialize(new_role)}
        except Exception as exc:
            if type(exc) == list:
                return {"errors": [str(e) for e in exc]}
            else:
                return {"errors": str(exc)}

    @permission_layer(required_permissions=["admin-configure"])
    def put(self, courseId):
        # Get the request since it's json
        data = request.get_json()
        # Check for default
        if "default" in data:
            # Query for courseId
            course_query = Course.objects.raw({"_id": courseId})
            # Error check
            course_count = course_query.count()
            if course_count > 1:
                return {"error": [f"Multiple courses with id: {courseId}"]}, 400
            elif course_count == 0:
                return {"error": [f"No courses with id: {courseId}"]}, 400
            else:
                course = course_query.first()
                default = data['default']
                if default in course.roles:
                    course.defaultRole = default
                    course.save()
        updated_list = []
        # Loop through all roles in the request
        for role in data['roles']:
            # Query for a matching role
            _id = ObjectId(role["_id"])
            role_query = Role.objects.raw({"_id": _id})
            # Error check to make sure we find a role
            role_count = role_query.count()
            if role_count > 1:
                return {"error": [f"Multiple roles found with id: {_id}"]}, 400
            elif role_count == 0:
                return {"error": [f"No roles found with id: {_id}"]}, 400
            else:
                # Save the role we queried for in a variable
                saved = role_query.first()
                # Convert the role to a dict for comparison
                db_role = self._serialize(role_query.first())
                db_role = dict(db_role)
                if db_role == role:
                    continue
                else:
                    # Update the name and permissions
                    saved.name = role['name']
                    saved.permissions = role['permissions']
                    # Append the updated role to the updated list
                    updated_list.append(saved)
        # Make sure update is valid
        for updated_role in updated_list:
            if(not updated_role.is_valid()):
                return {"error": [f"Update to the role with id {updated_role._id} is invalid"]}, 400
        else:
            for updated_role in updated_list:
                updated_role.save()
        return {"roles": [self._serialize(role) for role in updated_list]}, 200

    @permission_layer(required_permissions=["admin-configure"])
    def delete(self, courseId):
        data = request.get_json()
        try:
            course = Course.objects.get({"_id": courseId})
        except Course.DoesNotExit:
            return {"deleted": False, "error": f"Course does not exist"}

        roleId = ObjectId(data["roleId"])
        role_users = User.objects.raw({'courses.role': str(roleId)})
        count = role_users.count()
        return count
        if roleId not in course.roles:
            return {"deleted": False, "error": f"Role with id {str(roleId)} does not exit"}
        elif course.defaultRole == roleId:
            return {"deleted": False, "error": f"Cannot delete default role"}
        elif count > 0:
            return {"deleted": False, "error": f"Cannot delete role while it's in use"}
        else:
            course.roles.remove(roleId)
            course.save()
            return {"deleted": True}
        

    def _serialize(self, role):
        j = role.to_son()
        j["_id"] = str(j["_id"])
        return j
