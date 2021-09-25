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
    
    user.save()
    return {"success": f"Updated user first and last name with: {args['first']} {args['last']}"}
