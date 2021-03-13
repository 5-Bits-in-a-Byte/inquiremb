'''
This file deals with the Replies resource. It's responsible for handling all requests sent from
the frontend for posting, updating, and deleting replies.

Authors: Brian Gunnarson and Sam Peters

Last Modified Date: 03/12/2021
'''
from flask import jsonify
from flask_restful import Resource, abort, reqparse
from auth import current_user, permission_layer
from mongo import *
from socketio_app import io


class Replies(Resource):
    def post(self, post_id=None, comment_id=None):
        """
        Creates a new reply
        ---
        tags:
          - Replies
        parameters:
          - in: path
            description: Id of a post
            name: post_id
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
        post = self.retrieve_post(post_id)
        if post is None:
            return abort(400, errors=["Bad post id"])
        parser = reqparse.RequestParser()
        parser.add_argument('content')
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_reply(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Adding user info to dict
        anonymous = args['isAnonymous']
        if anonymous:
            postedby = {"first": "Anonymous", "last": "",
                        "_id": current_user.anonymousId, "anonymous": anonymous}
        else:
            postedby = {"first": current_user.first, "last": current_user.last,
                        "_id": current_user._id, "anonymous": anonymous, "picture": current_user.picture}

        # Add reply to MongoDB and retrieve the comment
        reply = Reply(postedby=postedby, content=args.content)
        comment = self.retrieve_comment(comment_id)

        # Append reply to the comment and save it to the database
        comment.replies.append(reply)
        comment.save()

        # Updating date and saving to database
        post.updatedDate = datetime.datetime.now()
        post.save()
        result = self.serialize(reply)
        io.emit('Reply/create', self.serialize(comment), room=post_id)
        return result, 200

    def put(self, post_id=None, comment_id=None):
        """
        Updates a reply
        ---
        tags:
          - Replies
        parameters:
          - in: path
            description: Id of a post
            name: post_id
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
        post = self.retrieve_post(post_id)

        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('content')
        parser.add_argument('_id')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_reply(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Get the current course and retrieve the comment
        current_course = current_user.get_course(post.courseid)
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
        id_match = current_user._id == reply.postedby[
            '_id'] or current_user.anonymousId == reply.postedby['_id']
        if id_match or current_course.admin:
            reply.content = args['content']
            comment.save()
            result = self.serialize(comment)
            return result, 200

    def delete(self, post_id=None, comment_id=None):
        """
        Deletes a reply
        ---
        tags:
          - Replies
        parameters:
          - in: path
            description: Id of a post
            name: post_id
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
        post = self.retrieve_post(post_id)

        # Grabbing comment id
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        if args['_id'] is None:
            return abort(400, errors=["No comment id"])

        comment = self.retrieve_comment(comment_id)
        # Get the current course
        current_course = current_user.get_course(post.courseid)

        # Get the reply we're looking for
        reply = None
        for reply in comment.replies:
            if reply._id == args['_id']:
                break

        # Error checking
        if reply is None:
            return {'deleted': False}, 403

        # Permission check
        id_match = current_user._id == reply.postedby[
            '_id'] or current_user.anonymousId == reply.postedby['_id']
        if id_match or current_course.admin:
            comment.replies.remove(reply)
            comment.save()
            return {'deleted': True}, 200
        else:
            return {'deleted': False}, 403

    def validate_reply(self, args):
        errors = []
        if args.content is None:
            errors.append("Please give your comment content")
        return errors

    def retrieve_post(self, post_id):
        query = Post.objects.raw({'_id': post_id})
        count = query.count()
        if count == 1:
            return query.first()
        elif count == 0:
            return None
        else:
            raise Exception(
                f'Multiple posts with the same id found, id: {post_id}')

    def retrieve_comment(self, comment_id):
        _id = ObjectId(comment_id)
        query = Comment.objects.raw({'_id': _id})
        count = query.count()
        if count == 1:
            return query.first()
        elif count == 0:
            return None
        else:
            raise Exception(
                f'Multiple comments with the same id found, id: {comment_id}')

    def serialize(self, comment):
        d = comment.to_son().to_dict()
        d['_id'] = str(d['_id'])
        return d
