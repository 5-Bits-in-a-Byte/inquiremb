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
        try:
            course = Course.objects.get({"_id": courseId})
        except Course.DoesNotExist:
            return {"error": [f"No courses with id: {courseId}"]}, 400
        except Course.MultipleObjectsReturned:
            return {"error": [f"Multiple courses with id: {courseId}"]}, 400
        # Initialize list of roles to return
        role_list = []
        # Loop through all roles associated with a course and add it to the return list
        roles = Role.objects.raw({"_id": {"$in": list(course.roles.keys())}})

        for role in roles:
            serialized_role = self._serialize(role)
            role_list.append(serialized_role)
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
            course = Course.objects.get({"_id": courseId})
            course.roles[new_role._id] = []
            course.save()
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
            try:
                course = Course.objects.get({"_id": courseId})
            except Course.DoesNotExist:
                return {"error": [f"No courses with id: {courseId}"]}, 400
            except Course.MultipleObjectsReturned:
                return {"error": [f"Multiple courses with id: {courseId}"]}, 400
            default = data['default']
            if default in course.roles:
                course.defaultRole = default
                course.save()
        updated_list = []
        # Loop through all roles in the request
        for role in data['roles']:
            # Query for a matching role
            _id = ObjectId(role["_id"])
            try:
                saved = Role.objects.get({"_id": _id})
            except Role.DoesNotExist:
                return {"error": [f"No role with id: {_id}"]}, 400
            except Role.MultipleObjectsReturned:
                return {"error": [f"Multiple roles with id: {_id}"]}, 400
            # Convert the role to a dict for comparison
            db_role = dict(self._serialize(saved))
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

        roleId = data["roleId"]
        role_users = course.roles[roleId]
        count = len(role_users)
        if roleId not in course.roles:
            return {"deleted": False, "error": f"Role with id {str(roleId)} does not exit"}
        elif course.defaultRole == roleId:
            return {"deleted": False, "error": f"Cannot delete default role"}
        elif count > 0:
            return {"deleted": False, "error": f"Cannot delete role while it's in use"}
        else:
            try:
                role = Role.objects.get({"_id": roleId})
                role.delete()
                course.roles.pop(roleId,None)
                course.save()
                return {"deleted": True}
            except Role.DoesNotExist:
                return {"deleted": False, "error": f"Role with id {str(roleId)} does not exit"}
            except Exception:
                return {"deleted": False, "error": "Unspecified error occured"}
        

    def _serialize(self, role):
        j = role.to_son()
        j["_id"] = str(j["_id"])
        return j
