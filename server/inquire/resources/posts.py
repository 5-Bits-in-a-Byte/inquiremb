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


class Posts(Resource):
    @permission_layer(required_permissions=["publish-postComment"], require_joined_course=True)
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
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content', type=dict)
        parser.add_argument('isPrivate', type=bool)
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()
        print(args.content['type'])
        print(args.content['raw'])
        print(args.content['plainText'])

        # How polls look being sent from frontend
        # {
        #   "type": "blah",
        #   "question": "blah blah",
        #   "fields": ["blah", "blah", "blah"]
        # }

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Controls whether the post should be highlighted orange for isntructor
        highlighted = current_user.permissions["admin"]["highlightPost"]

        # Adding user info to dict
        anonymous = args['isAnonymous']
        if anonymous:
            postedBy = {"first": "Anonymous", "last": "",
                        "_id": current_user.anonymousId, "anonymous": anonymous}
        else:
            postedBy = {"first": current_user.first, "last": current_user.last,
                        "_id": current_user._id, "anonymous": anonymous, "picture": current_user.picture}

        # Checking if post content needs to be manipulated before being stored in the database
        if args.content.get("type") == "poll":
            field_names = args.content["fields"]
            content = {"type": "poll",
                       "fields": self.create_poll_fields(field_names)}

        # Trying to add the post to the DB
        try:
            post = Post(courseId=courseId, postedBy=postedBy, title=args.title,
                        isPrivate=args.isPrivate, content=args.content, isInstructor=highlighted).save()
        except ValidationError as exc:
            return {"errors": str(exc)}

        result = self.serialize(post)

        course = current_user.get_course(courseId)
        # Marking that the creator of the post has viewed their own post
        if course != None:
            course.viewed[result["_id"]] = datetime.datetime.now()
            current_user.save()


        if not result['isPrivate'] and current_app.config['include_socketio']:
            current_app.socketio.emit('Post/create', result, room=courseId)
        return result, 200

    @permission_layer(require_joined_course=True)
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

        user_perms = current_user.permissions

        # -1 sorts newest first
        sort_date = -1
        if sortby == "oldest":
            sort_date = 1

        queryParams = {"courseId": courseId}
        # Filter by 'instructor'
        if filterby == 'instructor':
            queryParams["isInstructor"] = True
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])

        # Filter by 'me'
        elif filterby == 'me':
            queryParams["postedBy._id"] = {
                '$in': [current_user._id, current_user.anonymousId]}
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])

        # Filter by 'myupvoted'
        elif filterby == 'myupvoted':
            queryParams["reactions.likes"] = current_user._id
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])

        # Filter by 'question'
        elif filterby == 'question':
            # Check if the user can see private posts
            if not user_perms["privacy"]["private"]:
                queryParams['$or'] = [{'isPrivate': False}, {'postedBy._id': {
                    '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams["content.type"] = "question"
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])

        # Filter by 'announcement'
        elif filterby == 'announcement':
            # Check if the user can see private posts
            if not user_perms["privacy"]["private"]:
                queryParams['$or'] = [{'isPrivate': False}, {'postedBy._id': {
                    '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams["content.type"] = "announcement"
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])

        # Filter by 'poll'
        elif filterby == 'poll':
            # Check if the user can see private posts
            if not user_perms["privacy"]["private"]:
                queryParams['$or'] = [{'isPrivate': False}, {'postedBy._id': {
                    '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams["content.type"] = "poll"
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])

        # If the current user can see private posts and there's no search
        elif user_perms["privacy"]["private"] and (req is None):
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", sort_date)])

        # If the current user can see private posts and there is a search
        elif user_perms["privacy"]["private"] and (req is not None):
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])

        # If the current user cannot see private posts and there is a search
        elif (not user_perms["privacy"]["private"]) and (req is not None):
            queryParams['$or'] = [{'isPrivate': False}, {'postedBy._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [('isPinned', -1), ('createdDate', sort_date)])

        # If the current user cannot see private posts and there is not a search
        else:
            queryParams["$or"] = [{'isPrivate': False}, {'postedBy._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])


        course = current_user.get_course(courseId)
        viewed = course.viewed
        # Get the json for all the posts we want to display
        result = [self.serialize(post, viewed=viewed) for post in query]

        return result, 200

    @permission_layer(required_permissions=["delete-postComment"])
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
        try:
            post = Post.objects.get({'_id': args['_id']})
        except Post.DoesNotExist:
            return {'deleted': False, 'errors': f"No post with id {args['_id']}"}, 403
        except Post.MultipleObjectsReturned:
            return {'deleted': False, 'errors': f"Duplicate post detected, multiple posts in database with id {args['_id']}"}, 400

        # Permission check
        # FIX ME: Switch to using something other than "admin-configure" as the admin permission for deleting posts
        if current_user._id == post.postedBy['_id'] or current_user.anonymousId == post.postedBy['_id'] or current_user.permissions["admin"]["configure"]:
            # Get all comments associated with a post
            comment_query = Comment.objects.raw({"postId": str(post._id)})
            comments = list(comment_query)
            # Loop throught and delete all associated comments
            for comment in comments:
                post.comments -= 1
                comment.delete()
            # Delete the post
            post.delete()
            return {'deleted': True}, 200
        else:
            return {'deleted': False}, 403

    @permission_layer(required_permissions=["edit-postComment"])
    def put(self, courseId=None):
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

        # Get the post you want to update
        try:
            post = Post.objects.get({'_id': args['_id']})
        except Post.DoesNotExist:
            return {'updated': False, 'errors': f"No post with id {args['_id']}"}, 403
        except Post.MultipleObjectsReturned:
            return {'updated': False, 'errors': f"Duplicate post detected, multiple posts in database with id {args['_id']}"}, 400

        new_content_type = args["content"]["type"]
        if new_content_type != post["content"]["type"]:
            return {'updated': False, 'errors': f"Cannot change post type"}, 400
        if post["content"]["type"] == "poll":
            return {'updated': False, 'errors': f"Cannot modify polls"}, 400

        id_match = current_user._id == post.postedBy[
            '_id'] or current_user.anonymousId == post.postedBy['_id']
        if not id_match:
            return {'updated': False, 'errors': f"Cannot modify other users posts"}, 400

        post.title = args['title']
        post.content = args['content']
        post.updatedDate = datetime.datetime.now()
        if current_user.permissions['participation']['pin']:
            post.isPinned = args['isPinned']
        post.save()
        result = self.serialize(post)
        return result, 200

    def validate_post(self, args):
        errors = []
        # Make sure title is provided
        if args.title is None:
            errors.append("Please give your message a title")
        # Make sure the content field is provided (must return if it's not)
        if args.content is None:
            errors.append("Please give your post content")
            return errors
        # Make sure type is provided (must return if it's not)
        if "type" not in args.content or args.content["type"] is None:
            errors.append("Please provide a type for the post")
            return errors
        # Validate the type. Types include question, announcement, and poll.
        if not (args.content["type"] == "question" or args.content["type"] == "announcement" or args.content["type"] == "poll"):
            errors.append(
                "Invalid type provided. Valid types are: question, announcement, or poll.")
        # Make sure text field is provided for questions and announcements
        if (args.content["type"] == "question" or args.content["type"] == "announcement"):
            raw = args.content.get("raw")
            plaintext = args.content.get("plainText")
            if not (raw and plaintext and type(raw) == dict and type(plaintext) == str):
                errors.append("Please give your post message content")
        # Make sure fields dict is provided
        if args.content["type"] == "poll" and ("fields" not in args.content or args.content["fields"] is None):
            errors.append("Please provide options for your poll")
        return errors

    def serialize(self, post, viewed=None):
        # Get the JSON format
        result = post.to_son()
        if viewed:
            updated_date = result["updatedDate"]
            result["read"] = self.calc_read(result["_id"], updated_date, viewed)
        
        # Convert datetime to a string
        date = str(result['createdDate'])
        result['createdDate'] = date

        date = str(result['updatedDate'])
        result['updatedDate'] = date

        # Post content type specific modifications
        post_type = result["content"]["type"]
        if post_type == "poll":
            self.anonymize_poll_content(post["content"])
        return result

    def calc_read(self, post_id, updatedDate, viewed):
        """Modifies a dictionary representing a post by setting a new key-value
        pair of either "read": True or "read": False depending on the contents
        of the viewed dict.

        Args:
            post (dict): Dictionary representing a post
            viewed (dict): Dictionary representing the last time a user viewed the comments on a post.
            Keys are post id strings, values are datetime objects. If post id is not a key in the dict, 
            the user has never viewed the post.
        """
        return post_id in viewed and viewed[post_id] > updatedDate

        

    def anonymize_poll_content(poll):
        for field_name in poll["fields"]:
            poll["fields"][field_name].pop("users")

    def create_poll_fields(field_name_list):
        poll = {}
        for field in field_name_list:
            if type(field) == str:
                poll[field] = {"users": [], "votes": 0, "option": field}
            else:
                raise TypeError("Non string poll option submitted")
        return poll
