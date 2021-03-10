from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *

{'contentType': 'comment', 'reaction': 'like'}


class Reactions(Resource):
    def put(self):
        # Parse arguments
        postid = request.args.get('postid')
        commentid = request.args.get('commentid')
        replyid = request.args.get('replyid')

        # Post has been liked
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
                return {"errors": [f"You should be in the delete method"]}, 400
            # Add user's id to the list of likes and save the post
            likes.append(current_user._id)
            post.save()

        # Comment has been liked
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
            # Check if the user's id is already in likes (this also shouldn't be possible)
            if current_user._id in likes:
                return {"errors": [f"You should be in the delete method"]}, 400
            # Add user's id to the list of likes and save the post
            likes.append(current_user._id)
            comment.save()

        # Reply has been liked
        elif replyid:
            r_id = ObjectId(replyid)
        else:
            return {'errors': "how are you even here"}, 400

        return {'hello': 'put'}

    def delete(self, todo_id):
        return {'hello': 'delete'}
