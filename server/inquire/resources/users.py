from flask_restful import Resource, reqparse
from flask import request
from inquire.auth import current_user, permission_layer
from inquire.mongo import *

class Users(Resource):
  def put(self):
    parser = reqparse.RequestParser()
    parser.add_argument('userId')
    parser.add_argument('first')
    parser.add_argument('last')
    parser.add_argument('email')
    parser.add_argument('receiveEmailNotifications')
    args = parser.parse_args()

    if current_user._id != args["userId"]:
      return {"errors": ["You cannot update someone elses profile"]}, 400
    
    try:
      user = User.objects.get({"_id": args['userId']})
    except User.DoesNotExist:
      return {"errors": "Error: User with id " + args['userId'] + " does not exist."}, 400
    except User.MultipleObjectsReturned:
      return {"errors": "Error: Multiple objects with id " + args['userId'] + " were found."}, 400

    if args['first'] is not None:
      user.first = args['first']
    
    if args['last'] is not None:
      user.last = args['last']
    
    if args['email'] is not None:
      user.email = args['email']
    
    if args['receiveEmailNotifications'] is not None:
      user.userProfileData['receiveEmailNotifications'] = args['receiveEmailNotifications']
      user.userProfileData['accountFlags']['emailNotificationPrompt'] = False
    
    user.save()

    return {"success": f"Successfully updated user data.", "data" : {
        "first" : user.first, 
        "last"  : user.last,
        "email" : user.email,
        "receiveEmailNotifications" : user.userProfileData['receiveEmailNotifications'],
      }}
