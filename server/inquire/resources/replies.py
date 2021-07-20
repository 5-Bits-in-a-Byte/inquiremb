'''
This file deals with the Replies resource. It's responsible for handling all requests sent from
the frontend for posting, updating, and deleting replies.

Authors: Brian Gunnarson and Sam Peters
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
from flask import jsonify, current_app
from flask_restful import Resource, abort, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.socketio_app import io


class Replies(Resource):
    @permission_layer(required_permissions=["publish-reply"])
    def post(self, courseId=None, postId=None, comment_id=None):
        """
        Creates a new reply
        ---
        tags:
          - Replies
        parameters:
          - in: path
            description: Id of a post
            name: postId
            required: true
          - in: path
            description: Id of a comment
            name: comment_id
            required: true
          - name: body
            in: body
            description: Submitted reply data
            required: true
            schema:
              $ref: '#/definitions/ReplyBody'
        responses:
          200:
            description: Returns created reply
            schema:
                $ref: '#/definitions/Reply'
          400:
            schema:
              $ref: '#/definitions/400Response'
        """
        post = self.retrieve_post(postId)
        if post is None:
            return abort(400, errors=["Bad post id"])
        parser = reqparse.RequestParser()
        parser.add_argument('content', type=dict)
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_reply(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Controls whether the comment should be highlighted orange for isntructor
        highlighted = current_user.permissions["admin"]["highlightName"]

        # Adding user info to dict
        anonymous = args['isAnonymous']
        if anonymous and current_user.permissions['privacy']['anonymous']:
            highlighted = False
            postedBy = {"first": "Anonymous", "last": "",
                        "_id": current_user.anonymousId, "anonymous": anonymous}
        elif anonymous and not current_user.permissions['privacy']['anonymous']:
            return {"errors": ["You do not have permission to make anonymous replies in this course"]}, 401
        else:
            postedBy = {"first": current_user.first, "last": current_user.last,
                        "_id": current_user._id, "anonymous": anonymous, "picture": current_user.picture}

        # Add reply to MongoDB and retrieve the comment
        reply = Reply(postedBy=postedBy, content=args.content,
                      isInstructor=highlighted)
        comment = self.retrieve_comment(comment_id)

        # Append reply to the comment and save it to the database
        comment.replies.append(reply)
        comment.save()

        # Updating date and saving to database
        post.updatedDate = datetime.datetime.now()
        post.save()
        result = self.serialize(reply)
        if current_app.config['include_socketio']:
            current_app.socketio.emit(
                'Reply/create', self.serialize(comment), room=postId)
        return result, 200

    @permission_layer(required_permissions=["edit-reply"])
    def put(self, courseId=None, postId=None, comment_id=None):
        """
        Updates a reply
        ---
        tags:
          - Replies
        parameters:
          - in: path
            description: Id of a post
            name: postId
            required: true
          - in: path
            description: Id of a comment
            name: comment_id
            required: true
          - name: body
            in: body
            description: Submitted reply data
            required: true
            schema:
              $ref: '#/definitions/ReplyBody'
        responses:
          200:
            description: Returns updated comment
            schema:
                $ref: '#/definitions/Comment'
          400:
            schema:
              $ref: '#/definitions/400Response'
        """
        post = self.retrieve_post(postId)

        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('content', type=dict)
        parser.add_argument('_id')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_reply(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Retrieve the comment
        comment = self.retrieve_comment(comment_id)

        # Get the reply we're looking for
        reply = None
        for reply in comment.replies:
            if reply._id == args['_id']:
                break

        # Error checking
        if reply is None:
            return {'deleted': False}, 403

        # Permissions check
        id_match = current_user._id == reply.postedBy[
            '_id'] or current_user.anonymousId == reply.postedBy['_id']
        if id_match:
            reply.content = args['content']
            comment.save()
            result = self.serialize(comment)
            return result, 200

    @permission_layer(required_permissions=["delete-reply"])
    def delete(self, courseId=None, postId=None, comment_id=None):
        """
        Deletes a reply
        ---
        tags:
          - Replies
        parameters:
          - in: path
            description: Id of a post
            name: postId
            required: true
          - in: path
            description: Id of a comment
            name: comment_id
            required: true
          - name: body
            in: body
            description: Data needed to delete a reply
            required: true
            schema:
              type: object
              properties:
                _id:
                  type: string
                  description: Id of the reply
                  example: abcde12345
        responses:
          200:
            description: Returns successful delete
            schema:
              type: object
              properties:
                deleted:
                  type: bool
                  example: True
          403:
            description: Returns unsuccessful delete
            schema:
              type: object
              properties:
                deleted:
                  type: bool
                  example: False
        """
        post = self.retrieve_post(postId)

        # Grabbing comment id
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        if args['_id'] is None:
            return abort(400, errors=["No comment id"])

        comment = self.retrieve_comment(comment_id)
        # Get the reply we're looking for
        reply = None
        for reply in comment.replies:
            if reply._id == args['_id']:
                break

        # Error checking
        if reply is None:
            return {'deleted': False}, 403

        # Permission check
        id_match = current_user._id == reply.postedBy[
            '_id'] or current_user.anonymousId == reply.postedBy['_id']
        # FIX ME
        # Replace current_user.permissions['admin']['configure'] with whatever permission is required to delete content
        if id_match or current_user.permissions['admin']['configure']:
            comment.replies.remove(reply)
            comment.save()
            return {'deleted': True}, 200
        else:
            return {'deleted': False}, 403

    def validate_reply(self, args):
        errors = []
        # Make sure the content field is provided (must return if it's not)
        if args.content is None:
            errors.append("Please give your comment content")
            return errors
        # Make sure the text field is provided
        raw = args.content.get("raw")
        plaintext = args.content.get("plainText")
        if not (raw and plaintext and type(raw) == dict and type(plaintext) == str):
            errors.append("Please give your comment message content")
        return errors

    def retrieve_post(self, postId):
        query = Post.objects.raw({'_id': postId})
        count = query.count()
        if count == 1:
            return query.first()
        elif count == 0:
            return None
        else:
            raise Exception(
                f'Multiple posts with the same id found, id: {postId}')

    def retrieve_comment(self, comment_id):
        _id = ObjectId(comment_id)
        # Get the post you want to update
        try:
            comment = Comment.objects.get({'_id': _id})
        except Comment.DoesNotExist:
            return {'updated': False, 'errors': f"No comment with id {args['_id']}"}, 403
        except Comment.MultipleObjectsReturned:
            return {'updated': False, 'errors': f"Duplicate comment detected, multiple comments in database with id {args['_id']}"}, 400
        return comment

    def serialize(self, comment):
        d = comment.to_son().to_dict()
        d['_id'] = str(d['_id'])
        return d
