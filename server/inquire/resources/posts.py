'''
This file deals with the Posts resource. It's responsible for handling all requests sent from
the frontend for getting, posting, updating, and deleting posts.

Authors: Brian Gunnarson and Sam Peters
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
from flask import jsonify, request, current_app
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io


class Posts(Resource):
    def post(self, courseId=None):
        """
        Creates a new post
        ---
        tags:
          - Posts
        parameters:
          - in: path
            name: courseId
            description: Id of the course to post to
            required: true   
          - name: body
            in: body
            required: true
            description: Content and post options
            schema:
              $ref: '#/definitions/POSTPostBody'
        responses:
          200:
            description: Responds with the newly created post
            schema:
              $ref: '#/definitions/Post'
          400:
            description: Array of errors gathered from request
            schema:
              $ref: '#/definitions/400Response'
          403:
            description: Unable to retrieve current user data
            schema:
              $ref: '#/definitions/403Response'
        """
        course = current_user.get_course(courseId)
        if not course:
            return {"errors": ["You have not joined this course"]}, 403

        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content')
        parser.add_argument('isPrivate', type=bool)
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Check if user is instructor
        isInstructor = False
        if course.admin:
            isInstructor = True

        # Adding user info to dict
        anonymous = args['isAnonymous']
        if anonymous:
            postedby = {"first": "Anonymous", "last": "",
                        "_id": current_user.anonymousId, "anonymous": anonymous}
        else:
            postedby = {"first": current_user.first, "last": current_user.last,
                        "_id": current_user._id, "anonymous": anonymous, "picture": current_user.picture}

        # Add post to MongoDB
        post = Post(courseid=courseId, postedby=postedby, title=args.title,
                    isPrivate=args.isPrivate, content=args.content, isInstructor=isInstructor).save()

        # Get the JSON format
        result = self.serialize(post)
        if not result['isPrivate']:
            current_app.socketio.emit('Post/create', result, room=courseId)
        return result, 200

    def get(self, courseId=None):
        """
        Retrieves all the posts in a course
        ---
        tags:
          - Posts     
        parameters:
          - in: path
            name: courseId
            required: true
            description: course id from which to retrieve posts
          - in: query
            name: filterby
            schema:
              type: string
              enum: ['instructor', 'me', 'myupvoted']
              required: false
            description: Filter posts by category 
          - in: query
            name: sortby
            schema:
              type: string
              enum: ['newest', 'oldest']
              required: false
              default: 'newest'
            description: Sort posts by age
        responses:
          200:
            description: Responds with array of posts
            schema:
              type: array
              items:
                $ref: '#/definitions/Post'
          400:
            description: Array of errors gathered from request
            schema:
              $ref: '#/definitions/400Response'
          403:
            description: Unable to retrieve current user data
            schema:
              $ref: '#/definitions/403Response'
        """
        # Get the search input and the current course
        req = request.args.get('search')
        page = request.args.get('page', default=0, type=int)
        # filter options: 'instructor', 'me', 'myupvoted'
        filterby = request.args.get('filterby', type=str)
        # sorby options: 'newest', 'oldest'
        sortby = request.args.get('sortby', type=str, default="newest")

        current_course = current_user.get_course(courseId)

        # -1 sorts newest first
        sort_date = -1
        if sortby == "oldest":
            sort_date = 1

        queryParams = {"courseid": courseId}
        # Filter by 'instructor'
        if filterby == 'instructor':
            queryParams["isInstructor"] = True
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])
        # Filter by 'me'
        elif filterby == 'me':
            queryParams["postedby._id"] = {
                '$in': [current_user._id, current_user.anonymousId]}
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])
        # Filter by 'myupvoted'
        elif filterby == 'myupvoted':
            queryParams["reactions.likes"] = current_user._id
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])
        # If the current user can see private posts and there's no search
        elif current_course.seePrivate and (req is None):
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])

        # If the current user can see private posts and there is a search
        elif current_course.seePrivate and (req is not None):
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])

        # If the current user cannot see private posts and there is a search
        elif (not current_course.seePrivate) and (req is not None):
            queryParams['$or'] = [{'isPrivate': False}, {'postedby._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [('isPinned', -1), ('createdDate', sort_date)])

        # If the current user cannot see private posts and there is not a search
        else:
            queryParams["$or"] = [{'isPrivate': False}, {'postedby._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])

        # Get the json for all the posts we want to display
        result = [self.serialize(post) for post in query]

        return result, 200

    def delete(self, courseId=None):
        """
        Deletes a post
        ---
        tags:
          - Posts     
        parameters:
          - in: path
            name: courseId
            required: true
            description: Id of a course
          - name: body
            in: body
            required: true
            description: Content and post options
            schema:
              type: object
              properties:
                _id:
                  type: string
                  description: Id of the post
                  example: abcde12345
        responses:
          200:
            description: Responds with success or failure
            schema:
              type: object
              properties:
                deleted:
                  type: boolean
                  description: Whether or not the post was deleted
                  example: true
          400:
            description: Array of errors gathered from request
            schema:
              $ref: '#/definitions/400Response'
          403:
            description: Unable to delete the post
            schema:
              type: object
              properties:
                deleted:
                  type: boolean
                  description: Whether or not the post was deleted
                  example: false
        """
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        # Get the post you want to delete
        query = Post.objects.raw({'_id': args['_id']})
        post = query.first()

        # Count how many posts had same id for error checking and handle appropriately
        count = query.count()

        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {_id}')
        elif count == 1:
            # Get the current course
            current_course = current_user.get_course(courseId)
            # Permission check
            if current_user._id == post.postedby['_id'] or current_user.anonymousId == post.postedby['_id'] or current_course.admin:
                # Delete the post
                post.delete()
                return {'deleted': True}, 200
            else:
                return {'deleted': False}, 403
        else:
            raise Exception(f'No post with id')

    def put(self, courseId):
        """
        Edits a post
        ---
        tags:
          - Posts
        parameters:
          - in: path
            name: courseId
            description: Id of the course to post to
            required: true   
          - name: body
            in: body
            required: true
            description: Content and post options
            schema:
              $ref: '#/definitions/POSTPostBody'
        responses:
          200:
            description: Responds with the newly edited post
            schema:
              $ref: '#/definitions/Post'
          400:
            description: Array of errors gathered from request
            schema:
              $ref: '#/definitions/400Response'
          403:
            description: Unable to retrieve current user data
            schema:
              $ref: '#/definitions/403Response'
        """
        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content')
        parser.add_argument('isPinned', type=bool)
        parser.add_argument('_id')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Query for the post and get the current course
        query = Post.objects.raw({'_id': args["_id"]})
        current_course = current_user.get_course(courseId)

        # Count how many posts had same id for error checking and handle appropriately
        count = query.count()
        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {args["_id"]}')
        elif count == 1:
            post = query.first()
            id_match = current_user._id == post.postedby[
                '_id'] or current_user.anonymousId == post.postedby['_id']
            if id_match or current_course.admin:
                post.title = args['title']
                post.content = args['content']
                post.updatedDate = datetime.datetime.now()
                if current_course.canPin:
                    post.isPinned = args['isPinned']
                post.save()
                result = self.serialize(post)
                return result, 200
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
