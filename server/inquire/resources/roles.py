from flask import request, current_app
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io


class Roles(Resource):
    def get(self, courseId):
        if not current_user.permissions['admin']['configure'] and not current_user.permissions['admin']['banUsers'] and not current_user.permissions['admin']['removeUsers']:
            return {"errors": ["You do not have permission to view the course configuration page."]}, 401

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
            return {"status": "success", "role": self._serialize(new_role)}, 200
        except Exception as exc:
            if type(exc) == list:
                # Print statement for debugging, error message for the front end
                print([str(e) for e in exc])
                return {"errors": [f"Multiple errors occured. Please try again."]}, 401
            else:
                # Print statement for debugging, error message for the front end
                print(str(exc))
                return {"errors": [f"Oops, something went wrong! Please try again."]}, 401

    @permission_layer(required_permissions=["admin-configure"])
    def put(self, courseId):
        # Get the request since it's json
        data = request.get_json()
        # Check for default
        if "default" in data:
            try:
                course = Course.objects.get({"_id": courseId})
            except Course.DoesNotExist:
                print(f"No courses with id: {courseId}")
                return {"errors": [f"The course you are trying to set the default role for was not found. Please try again."]}, 400
            except Course.MultipleObjectsReturned:
                print(f"Multiple courses with id: {courseId}")
                return {"errors": [f"The course you are trying to set the default role for was found multiple times. Please try again."]}, 400
            default = data['default']
            if default in course.roles:
                course.defaultRole = default
                course.save()
        updated_list = []
        # Loop through all roles in the request
        for role in data['roles']:
            # Query for a matching role
            _id = role["_id"]
            try:
                saved = Role.objects.get({"_id": _id})
            except Role.DoesNotExist:
                print(f"No role with id: {_id}")
                return {"errors": [f"The role you are trying to update was not found. Please try again."]}, 400
            except Role.MultipleObjectsReturned:
                print(f"Multiple roles with id: {_id}")
                return {"errors": [f"The role you are trying to update was found multiple times. Please try again."]}, 400
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
                print(
                    f"Update to the role with id {updated_role._id} is invalid")
                return {"errors": [f"The update to the role you're trying to modify is invalid. Please try again."]}, 400
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
            # Print statement for debugging, error message for the front end
            print(f"ERROR: Course with id {courseId} was not found.")
            return {"deleted": False, "errors": [f"The course you are trying to delete a role in was not found. Please try again."]}, 400
        except Course.MultipleObjectsReturned:
            # Print statement for debugging, error message for the front end
            print(f"ERROR: Multiple courses with id {courseId} were found.")
            return {"deleted": False, "errors": ["The course you are trying to delete a role in was found multiple times. Please try again."]}, 400

        roleId = data["roleId"]
        role_users = course.roles[roleId]
        count = len(role_users)
        if roleId not in course.roles:
            print(
                f"ERROR: Role with id {str(roleId)} does not exist in this course.")
            return {"deleted": False, "errors": ["The role you are trying to delete was not found for this course. Please try again."]}, 400
        elif course.defaultRole == roleId:
            print(f"ERROR: Cannot delete default role")
            return {"deleted": False, "errors": [f"Cannot delete the default role for a course."]}, 400
        elif count > 0:
            print(f"ERROR: Cannot delete role while it's in use")
            return {"deleted": False, "errors": [f"Cannot delete role while it's in use. Make sure nobody in the course is still assigned this role."]}, 400
        else:
            try:
                role = Role.objects.get({"_id": roleId})
                role.delete()
                course.roles.pop(roleId, None)
                course.save()
                return {"deleted": True}, 200
            except Role.DoesNotExist:
                print(
                    f"ERROR: Role with id {str(roleId)} does not exist in the database.")
                return {"deleted": False, "errors": ["The role you are trying to delete was not found. Please try again."]}, 400
            except Role.MultipleObjectsReturned:
                print(f"ERROR: Multiple roles with id {roleId} were found.")
                return {"deleted": False, "errors": ["The role you are trying to delete was found multiple times. Please try again."]}, 400
            except Exception:
                print("ERROR: Unspecified error.")
                return {"deleted": False, "errors": ["Unspecified error occured. Please try again."]}, 400

    def _serialize(self, role):
        j = role.to_son()
        j["_id"] = str(j["_id"])
        return j
