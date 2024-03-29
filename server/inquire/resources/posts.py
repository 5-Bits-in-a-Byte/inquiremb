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
# from inquire.utils.events import sendEvent
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io


class Posts(Resource):
    @permission_layer(require_joined_course=True)
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
        # Make sure the current user at least has one permission to post
        # print("User Perms: ", current_user.permissions)
        if not current_user.permissions['publish']['question'] and not current_user.permissions['publish']['announcement'] and not current_user.permissions['publish']['poll'] and not current_user.permissions['publish']['general']:
            return {"errors": ["You do not have permission to make any post in this course."]}, 401

        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content', type=dict)
        parser.add_argument('isPrivate', type=bool)
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()

        # Check that the user has permission to make the type of post they wish to make
        permission_errs = self.check_permissions("publish", args)
        if (bool(permission_errs)):
            return {"errors": permission_errs}, 401

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
        highlighted = current_user.permissions["admin"]["highlightName"]

        # Adding user info to dict
        anonymous = args['isAnonymous']

        if anonymous and current_user.permissions['privacy']['anonymous']:
            highlighted = False
            postedBy = {"first": "Anonymous", "last": "",
                        "_id": current_user.anonymousId, "anonymous": anonymous}
        elif anonymous and not current_user.permissions['privacy']['anonymous']:
            return {"errors": ["You do not have permission to make anonymous posts in this course"]}, 401
        else:
            postedBy = {"first": current_user.first, "last": current_user.last,
                        "_id": current_user._id, "anonymous": anonymous, "picture": current_user.picture}

        # Checking if post content needs to be manipulated before being stored in the database
        if args.content.get("type") == "poll":
            field_names = args.content["fields"]
            args.content = {"type": "poll",
                            "fields": self.create_poll_fields(field_names),
                            "user_votes": {}}

        # Trying to add the post to the DB
        try:
            post = Post(courseId=courseId, postedBy=postedBy, title=args.title,
                        isPrivate=args.isPrivate, content=args.content, isInstructor=highlighted).save()
        except ValidationError as exc:
            return {"errors": str(exc)}, 400

        result = self.serialize(post)

        course = current_user.get_course(courseId)
        # Marking that the creator of the post has viewed their own post
        if course != None:
            course.viewed[result["_id"]] = datetime.datetime.now()
            current_user.save()

        if not result['isPrivate'] and current_app.config['include_socketio']:
            current_app.socketio.emit('Post/create', result, room=courseId)
        
        # sendEvent(
        #     actor=postedBy,
        #     action="created",
        #     subject=self.serialize(post),
        #     topics=[courseId, post._id]
        # )

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

        # Filter by 'general'
        elif filterby == 'general':
            # Check if the user can see private posts
            if not user_perms["privacy"]["private"]:
                queryParams['$or'] = [{'isPrivate': False}, {'postedBy._id': {
                    '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams["content.type"] = "general"
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
        # Make sure the current user at least has one permission to delete
        if not current_user.permissions['delete']['question'] and not current_user.permissions['delete']['announcement'] and not current_user.permissions['delete']['poll'] and not current_user.permissions['delete']['general'] and not current_user.permissions['admin']['deleteOther']:
            return {"errors": ["You do not have permission to delete any type of post in this course."]}, 401

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

        permission_errs = False
        # Make sure the user has permission to delete the type of post they want to delete
        if not current_user.permissions['admin']['deleteOther']:
            permission_errs = self.check_permissions("delete", post)

        if (bool(permission_errs)):
            return {"errors": permission_errs}, 401

        # Permission check
        if current_user._id == post.postedBy['_id'] or current_user.anonymousId == post.postedBy['_id'] or current_user.permissions["admin"]["deleteOther"]:
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
        # Make sure the current user at least has one permission to edit
        if not current_user.permissions['edit']['question'] and not current_user.permissions['edit']['announcement'] and not current_user.permissions['edit']['poll'] and not current_user.permissions['edit']['general']:
            return {"errors": ["You do not have permission to edit any type of post in this course."]}, 401

        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content', type=dict)
        parser.add_argument('_id')
        args = parser.parse_args()

        # Make sure the user has permission to edit the type of post they wish to edit
        permission_errs = self.check_permissions("edit", args)
        if (bool(permission_errs)):
            return {"errors": permission_errs}, 401

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
        if new_content_type != post.content["type"]:
            return {'updated': False, 'errors': f"Cannot change post type"}, 400
        # if post.content["type"] == "poll":
        #     return {'updated': False, 'errors': f"Cannot modify polls"}, 400

        id_match = current_user._id == post.postedBy[
            '_id'] or current_user.anonymousId == post.postedBy['_id']
        if not id_match:
            return {'updated': False, 'errors': f"Cannot modify other users posts"}, 400

        if post.content["type"] != "poll":
            if post.title != args['title']:
                post.title = args['title']
                post.updatedDate = datetime.datetime.now()
            if post.content != args['content']:
                post.content = args['content']
                post.updatedDate = datetime.datetime.now()
            post.save()

        result = self.serialize(post)
        return result, 200

    def check_permissions(self, request_type, post_args):
        # Check that the user has permission to do what they wish to do
        errors = []
        if (not current_user.permissions[request_type]['question']) and (post_args.content.get("type") == "question"):
            errors.append(
                f"You do not have permission to {request_type} questions in this course")
        elif not current_user.permissions[request_type]['announcement'] and (post_args.content.get("type") == "announcement"):
            errors.append(
                f"You do not have permission to {request_type} announcements in this course")
        elif not current_user.permissions[request_type]['poll'] and (post_args.content.get("type") == "poll"):
            errors.append(
                f"You do not have permission to {request_type} polls in this course")
        elif not current_user.permissions[request_type]['general'] and (post_args.content.get("type") == "general"):
            errors.append(
                f"You do not have permission to {request_type} general posts in this course")
        return errors

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
        if not (args.content["type"] == "question" or args.content["type"] == "announcement" or args.content["type"] == "poll" or args.content["type"] == "general"):
            errors.append(
                "Invalid type provided. Valid types are: question, announcement, poll, or general.")
        # Make sure text field is provided for questions and announcements
        if (args.content["type"] == "question" or args.content["type"] == "announcement" or args.content['type'] == "general"):
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
            result["read"] = self.calc_read(
                result["_id"], updated_date, viewed)

        # Convert datetime to a string
        date = str(result['createdDate'])
        result['createdDate'] = date

        date = str(result['updatedDate'])
        result['updatedDate'] = date

        # Post content type specific modifications
        post_type = result["content"]["type"]
        if post_type == "poll":
            self.anonymize_poll_content(result["content"])
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

    def anonymize_poll_content(self, poll):
        poll["vote"] = poll["user_votes"].get(current_user._id, None)
        poll.pop("user_votes")

    def create_poll_fields(self, field_name_list):
        poll = {}
        for field in field_name_list:
            if type(field) == str:
                poll[field] = {"votes": 0, "option": field}
            else:
                raise TypeError("Non string poll option submitted")
        return poll
