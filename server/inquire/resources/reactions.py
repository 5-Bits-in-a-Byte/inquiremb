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
    def put(self, courseId=None):
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
        
        parser = reqparse.RequestParser()
        parser.add_argument('reactionType')
        args = parser.parse_args()

        # print("Reaction Type: ", args.reactionType)

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
            likes, goods, helpfuls = self.__updateReactions(post, args.reactionType)
            
            post.save()
            return {"reactions": {"likes": likes, 'goods': goods, 'helpfuls': helpfuls}}, 200

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
            likes, goods, helpfuls = self.__updateReactions(comment, args.reactionType)
            
            comment.save()
            return {"reactions": {"likes": likes, 'goods': goods, 'helpfuls': helpfuls}}, 200

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
            likes, goods, helpfuls = self.__updateReactions(reply, args.reactionType)
            
            comment.save()
            return {"reactions": {"likes": likes, 'goods': goods, 'helpfuls': helpfuls}}, 200

        # No id handler
        else:
            return {"errors": ["No id provided"]}, 400

    def __updateReactions(self, objectToUpdate, reactionType):
        likes = objectToUpdate.reactions['likes']
        goods = objectToUpdate.reactions['goods']
        helpfuls = objectToUpdate.reactions['helpfuls']

        # print("LIKES: ", likes)
        # print("GOODS: ", goods)
        # print("HELPFULS: ", helpfuls)

        # Check if the user's id is already in likes (this also shouldn't be possible)
        if reactionType == "like":
            if current_user._id in likes:
                likes.remove(current_user._id)
            else:
                likes.append(current_user._id)
        elif reactionType == "good":
            if current_user._id in goods:
                goods.remove(current_user._id)
            else:
                goods.append(current_user._id)
        elif reactionType == "helpful":
            if current_user._id in helpfuls:
                helpfuls.remove(current_user._id)
            else:
                helpfuls.append(current_user._id)
        
        return likes, goods, helpfuls
