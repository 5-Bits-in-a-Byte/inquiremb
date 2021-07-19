from flask import request, current_app, jsonify
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io


class BanRemove(Resource):
    def put(self, courseId):
        if not current_user.permissions['admin']['banUsers'] and not current_user.permissions['admin']['removeUsers']:
            return {"errors": ["You do not have permission to ban or remove users from the course."]}, 401

        parser = reqparse.RequestParser()
        parser.add_argument('type')
        parser.add_argument('userId')
        args = parser.parse_args()

        # Validate course exists and store it in course variable
        try:
            course = Course.objects.get({"_id": courseId})
        except Course.DoesNotExist:
            return {"errors": "Error: Course with id " + courseId + " does not exist."}, 400
        except Course.MultipleObjectsReturned:
            return {"errors": "Error: Multiple objects with id " + courseId + " were found."}, 400

        # Validate user exists and store it in user variable
        try:
            user = User.objects.get({"_id": args['userId']})
        except User.DoesNotExist:
            return {"errors": "Error: User with id " + args['userId'] + " does not exist."}, 400
        except User.MultipleObjectsReturned:
            return {"errors": "Error: Multiple users with id " + args['userId'] + " were found."}, 400

        # Validate the arguments sent
        errors = self.validate_args(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # NOTE: maybe add something to check if the user id is even in the class?

        filler = ""
        if args['type'] == "remove":
            if not current_user.permissions['admin']['removeUsers']:
                return {"errors": ["You do not have permission to remove users in this course"]}, 401
            # Removing students
            self.remove_user(user, course)
            filler = "removed"
        elif args['type'] == "ban":
            if not current_user.permissions['admin']['banUsers']:
                return {"errors": ["You do not have permission to ban users in this course"]}, 401
            # Banning students
            if args['userId'] not in course.blacklist:
                # Add the banned user to the blacklist
                course.blacklist.append(args['userId'])
                course.save()
                # Remove the user from the course
                self.remove_user(user, course)
                filler = "banned"
            # Unbanning students
            else:
                course.blacklist.remove(args['userId'])
                course.save()
                filler = "unbanned"
        return {"success": [f"{user.first} {user.last} was successfully {filler} from the course."]}, 200

    def get(self, courseId):
        try:
            course = Course.objects.get({"_id": courseId})
        except Course.DoesNotExist:
            return {"errors": "Error: Course with id " + courseId + " does not exist."}, 400
        except Course.MultipleObjectsReturned:
            return {"errors": "Error: Multiple objects with id " + courseId + " were found."}, 400

        return_list = []
        for bannedId in course.blacklist:
            try:
                user = User.objects.get({"_id": bannedId})
            except User.DoesNotExist:
                return {"errors": "Error: User with id " + args['userId'] + " does not exist."}, 400
            except User.MultipleObjectsReturned:
                return {"errors": "Error: Multiple users with id " + args['userId'] + " were found."}, 400
            necessary_fields = {
                "userId": user._id, "userName": user.first + " " + user.last, "userImg": user.picture}
            return_list.append(necessary_fields)

        return {"success": return_list}, 200

    def validate_args(self, args):
        errors = []
        if args['type'] != 'ban' and args['type'] != 'remove':
            errors.append(
                "Invalid type. Type can be either \'ban\' or \'remove\'")
        return errors

    def remove_user(self, user, course):
        # Remove the user from their role in the course
        for role_id in course.roles:
            if user._id in course.roles[role_id]:
                course.roles[role_id].remove(user._id)
                course.save()
        # Remove the user from the course itself
        for c in user.courses:
            if c.courseId == course._id:
                pop_idx = user.courses.index(c)
                user.courses.pop(pop_idx)
                user.save()
