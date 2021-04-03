'''
This file deals with the Reactions resource. It's responsible for handling a request from
the client to update the reactions on a post, comment, or reply.

Authors: Brian Gunnarson
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
from flask import jsonify, request
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *


class Reactions(Resource):
    def put(self):
        """
        Responds with a reaction to a post, comment, or reply
        ---
        tags:
          - Reactions     
        parameters:
          - in: query
            name: postid
            schema:
              type: string
              example: "postid123"
              required: true
            description: Id of the post to react to
          - in: query
            name: commentid
            schema:
              type: string
              example: "commentid321"
              required: true
            description: Id of the comment to react to
          - in: query
            name: replyid
            schema:
              type: string
              example: "replyid321"
              required: true
            description: Id of the reply to react to
        responses:
          200:
            description: Responds with reactions object
            schema:
              type: array
              items:
                $ref: '#/definitions/Reactions'
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
        postid = request.args.get('postid')
        commentid = request.args.get('commentid')
        replyid = request.args.get('replyid')

        # Post reaction handler
        if postid:
            # Query for the correct post
            query = Post.objects.raw({"_id": postid})
            # Error checking even though neither of these options should be possible
            count = query.count()
            if count > 1:
                return {"errors": [f"Multiple posts with id {postid}"]}, 400
            elif count == 0:
                return {"errors": [f"No posts with id {postid}"]}, 400
            # Get the post and the likes associated with it
            post = query.first()
            likes = post.reactions['likes']
            # Check if the user's id is already in likes (this also shouldn't be possible)
            if current_user._id in likes:
                likes.remove(current_user._id)
            else:
                likes.append(current_user._id)
            # Save the changes to the post
            post.save()
            return {"reactions": {"likes": likes}}, 200

        # Comment reaction handler
        elif commentid:
            c_id = ObjectId(commentid)
            # Query for the correct post
            query = Comment.objects.raw({"_id": c_id})
            # Error checking even though neither of these options should be possible
            count = query.count()
            if count > 1:
                return {"errors": [f"Multiple comments with id {commentid}"]}, 400
            elif count == 0:
                return {"errors": [f"No comments with id {commentid}"]}, 400
            # Get the post and the likes associated with it
            comment = query.first()
            likes = comment.reactions['likes']
            # Check if the user's id is already in likes and remove it if it is
            if current_user._id in likes:
                likes.remove(current_user._id)
            else:
                likes.append(current_user._id)
            # Save the changes to the comment
            comment.save()
            return {"reactions": {"likes": likes}}, 200

        # Reply reaction handler
        elif replyid:
            # Query for the comment that the reply is associated with since it's an embedded field
            replyid_list = [replyid]
            query = Comment.objects.raw({"replies._id": {"$in": replyid_list}})
            # Error checking even though neither of these options should be possible
            count = query.count()
            if count > 1:
                return {"errors": [f"Multiple comments with the same reply id: {replyid}"]}, 400
            elif count == 0:
                return {"errors": [f"No comments with the reply id: {replyid}"]}, 400
            # Get the comment and correct reply
            comment = query.first()
            for reply in comment.replies:
                if reply._id == replyid:
                    break
            # Check if the user's id is already in likes and remove it if so
            likes = reply.reactions['likes']
            if current_user._id in likes:
                likes.remove(current_user._id)
            else:
                likes.append(current_user._id)
            # Save the changes to the comment
            comment.save()
            return {"reactions": {"likes": likes}}, 200
