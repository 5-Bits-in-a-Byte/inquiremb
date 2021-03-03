from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *
from utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId


class Posts(Resource):
    # @permission_layer(['read', 'write'], current_user.sub)
    def post(self, course_id=None):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content')
        parser.add_argument('isPrivate')
        parser.add_argument('isAnonymous')
        args = parser.parse_args()

        args.title = "title"
        args.content = "deleting this"
        args.isPrivate = True

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Create dict of current user attributes
        first = current_user.first
        last = current_user.last
        _id = current_user._id
        anonymous = args['isAnonymous']

        postedby = {"first": first, "last": last,
                    "_id": _id, "anonymous": anonymous}

        # Add post to MongoDB
        post = Post(courseid=course_id, postedby=postedby, title=args.title,
                    isPrivate=args.isPrivate, content=args.content).save()

        # Get the JSON format
        result = self.serialize(post)

        return result, 200

    def get(self, course_id=None):
        # Get the search input
        req = request.args.get('search')

        # Get the current course
        current_course = current_user.get_course(course_id)

        # If the current user can see private posts and there's no search
        if current_course.seePrivate and (req is None):
            query = Post.objects.raw({'courseid': course_id})
        # If the current user can see private posts and there is a search
        elif current_course.seePrivate and (req is not None):
            query = Post.objects.raw(
                {'courseid': course_id, '$text': {'$search': req}})
        # If the current user cannot see private posts and there is a search
        elif (not current_course.seePrivate) and (req is not None):
            query = Post.objects.raw(
                {'courseid': course_id, 'isPrivate': False, '$text': {'$search': req}})
        # If the current user cannot see private posts and there is not a search
        else:
            query = Post.objects.raw(
                {'courseid': course_id, 'isPrivate': False})

        # Get the json for all the posts we want to display
        result = [self.serialize(post) for post in query]

        return result, 200

    # @permission_layer(['read', 'write'], current_user.sub)
    def delete(self, course_id=None):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        _id = ObjectId(args['_id'])
        # Get the post you want to delete
        query = Post.objects.raw({'_id': _id})

        # Count how many posts had same id for error checking and handle appropriately
        count = query.count()
        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {_id}')
        elif count == 1:
            query.delete()
            return "Successful delete"
        else:
            raise Exception(f'No post with id')

    def put(self, course_id):
        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content')
        parser.add_argument('isPinned')
        parser.add_argument('_id')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Query for the post and get the current course
        query = Post.objects.raw({'_id': _id})
        current_course = current_user.get_course(course_id)

        # Count how many posts had same id for error checking and handle appropriately
        count = query.count()
        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {_id}')
        elif count == 1:
            if (current_user._id == query.first().postedby._id) or current_course.admin:
                query.first().title = args['title']
                query.first().content = args['content']
                if current_course.canPin:
                    query.first().isPinned = args['isPinned']
                query.first().save()
        else:
            raise Exception(f'No post with id')

    def validate_post(self, args):
        errors = []
        if args.title is None:
            errors.append("Please give your message a title")
        if args.content is None:
            errors.append("Please give your message content")
        return errors

    def serialize(self, post):
        # Get the JSON format
        result = post.to_son()

        # Convert datetime to a string
        date = str(result['createdDate'])
        result['createdDate'] = date

        date = str(result['updatedDate'])
        result['updatedDate'] = date
        return result


# UPDATED POST RESOURCE TO INCLUDE UPDATEDDATE
