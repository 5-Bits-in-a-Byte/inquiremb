from flask_restful import Resource, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *


class UserProfiles(Resource):
    def get(self):
        if current_user.userProfileData is not None:
            return {"profileData": current_user.userProfileData}, 200
        else:
            return {"errors": ["No user profile data was found"]}, 400

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('about')
        parser.add_argument('bannerColor')
        parser.add_argument('userId')
        args = parser.parse_args()

        if current_user._id != args["userId"]:
            return {"errors": ["You cannot update someone elses profile"]}, 400

        try:
            user = User.objects.get({"_id": args['userId']})
        except User.DoesNotExist:
            return {"errors": "Error: User with id " + args['userId'] + " does not exist."}, 400
        except User.MultipleObjectsReturned:
            return {"errors": "Error: Multiple objects with id " + args['userId'] + " were found."}, 400

        if args['about'] is not None and args['about'] != "":
            user.userProfileData["about"] = args["about"]

        if args['bannerColor'] is not None and args['bannerColor'] != "":
            user.userProfileData["bannerColor"] = args["bannerColor"]

        user.save()
        return {"success": "User profile data was updated successfully"}, 200
