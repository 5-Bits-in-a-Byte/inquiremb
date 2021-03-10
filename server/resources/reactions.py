from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *

{'contentType': 'comment', 'reaction': 'like'}


class Reaction(Resource):
    def put(self, todo_id):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('postid')
        parser.add_argument('commentid')
        parser.add_argument('replyid')
        args = parser.parse_args()

        if args['postid']:
            query = Post.objects.raw({"postid": args['postid']})
            count = query.count()
            print(count)
            post = query.first()

        elif args['commentid']:
            pass
        elif args['replyid']:
            pass
        else:
            return {'errors': "how are you even here"}, 400

        return {'hello': 'put'}

    def delete(self, todo_id):
        return {'hello': 'delete'}
