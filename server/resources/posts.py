from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *
from utils.argparser_types import str2bool


class Posts(Resource):
    @permission_layer(['read', 'write'], current_user.sub)
    def post(self, courseid):
       # Get json for POST requests
        request.get_json(force=True)
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Add post to MongoDB
        post = Post(courseid=courseid, title=args.title, content=args.content,
                    postedby=current_user.sub, comments=None, likes=None, pinned=False).save()
        return {"_id": post._id, "courseid": post.courseid, "title": post.title, "content": post.content, "postedby": post.postedby, "comments": post.comments, "likes": post.likes, "pinned": post.pinned}, 200

    def get(self):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        # Get the post we're looking for and count how many posts have this id (should be 1 or 0)
        query = Post.objects.raw({'_id': args['_id']})
        count = query.count()

        # This shouldn't happen
        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {_id}')
        # One post matching the id
        elif count == 1:
            return query.first().to_son().to_dict()
        # Post doesn't exist
        else:
            raise Exception(f'No post with id {_id}')

    @permission_layer(['read', 'write'], current_user.sub)
    def delete(self):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        # Get the post you want to delete
        query = Post.objects.raw({'_id': args['_id']})

        # Count how many posts had same id for error checking and handle appropriately
        count = query.count()
        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {_id}')
        elif count == 1:
            query.first().delete()
        else:
            raise Exception(f'No post with id {_id}')

    def validate_post(self, args):
        errors = []
        if args.title is None:
            errors.append("Please give your message a title")
        if args.content is None:
            errors.append("Please give your message content")
        return errors
