from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *
from utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId


class Home(Resource):
    def get(self):
        queryParams = {"courseid": course_id}
        # Filter by 'instructor'
        if filterby == 'instructor':
            queryParams["isInstructor"] = True
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)
        # Filter by 'me'
        elif filterby == 'me':
            queryParams["postedby._id"] = {
                '$in': [current_user._id, current_user.anonymousId]}
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)
        # Filter by 'myupvoted'
        elif filterby == 'myupvoted':
            queryParams["reactions.likes"] = current_user._id
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)
        # If the current user can see private posts and there's no search
        elif current_course.seePrivate and (req is None):
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)

        # If the current user can see private posts and there is a search
        elif current_course.seePrivate and (req is not None):
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)

        # If the current user cannot see private posts and there is a search
        elif (not current_course.seePrivate) and (req is not None):
            queryParams['$or'] = [{'isPrivate': False}, {'postedby._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [('isPinned', -1), ('createdDate', -1)]).skip(page * 20).limit(20)

        # If the current user cannot see private posts and there is not a search
        else:
            queryParams["$or"] = [{'isPrivate': False}, {'postedby._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)

        # Get the json for all the posts we want to display
        result = [self.serialize(post) for post in query]

        return result, 200

    def serialize(self, post):
        # Get the JSON format
        result = post.to_son()

        # Convert datetime to a string
        date = str(result['createdDate'])
        result['createdDate'] = date

        date = str(result['updatedDate'])
        result['updatedDate'] = date
        return result
