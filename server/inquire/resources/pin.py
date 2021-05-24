'''
This file deals with the Posts resource. It's responsible for handling all requests sent from
the frontend for getting, posting, updating, and deleting posts.

Authors: Brian Gunnarson and Sam Peters
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
import datetime
from flask import jsonify, request, current_app
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io


class Pin(Resource):
    @permission_layer(required_permissions=["participation-pin"], require_joined_course=True)
    def put(self, courseId=None):
        print("Pin Request")
        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('isPinned', type=bool)
        parser.add_argument('_id')
        args = parser.parse_args()
        
        # Get the post you want to update
        try:
            post = Post.objects.get({'_id': args['_id']})
        except Post.DoesNotExist:
            return {'updated': False, 'errors': f"No post with id {args['_id']}"}, 403
        except Post.MultipleObjectsReturned:
            return {'updated': False, 'errors': f"Duplicate post detected, multiple posts in database with id {args['_id']}"}, 400
        
        post.isPinned = args['isPinned']
        post.save()

        return {"status": "Success!"}, 200

