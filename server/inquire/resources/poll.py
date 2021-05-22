from flask_restful import Resource, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *

class Poll(Resource):
    @permission_layer(require_login=True, required_permissions=["participation-voteInPoll"])
    def put(self, courseId=None):
        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('selectedOption')
        parser.add_argument('postId')
        args = parser.parse_args()
        
        try:
            post = Post.objects.get({'_id': args['postId']})
        except Post.DoesNotExist:
            return {'voted': False, 'increment': False, 'errors': f"No post with id {args['_id']}"}, 400
        except Post.MultipleObjectsReturned:
            return {'voted': False, 'increment': False, 'errors': f"Duplicate post detected, multiple posts in database with id {args['_id']}"}, 400

        if post.content['type'] != 'poll':
            return {'voted': False, 'increment': False, 'errors': f"Post is not a poll"}, 400
        option = args['selectedOption']
        if option in post.content['fields']:
            voted = post.content["user_votes"].get(current_user._id, None)
            if not voted:
                post.content["user_votes"][current_user._id] = option
                post.content['fields'][option]['votes'] += 1
                post.save()
                return {'voted': True, 'increment': True}, 200
            return {'voted': True, 'increment': False}, 200
        return {'voted': False, 'increment': False, 'errors': f"Option is not available in the poll"}, 400