from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *
from utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId


class Home(Resource):
    def get(self):
        course_ids = []
        for course in current_user.courses:
            course_ids.append(course.course_id)

        # TODO: how do we query for private posts in one course but not others?

        queryParams = {"courseid": {"$in": course_ids}}
        queryParams["$or"] = [{'isPrivate': False}, {'postedby._id': {
            '$in': [current_user._id, current_user.anonymousId]}}]
        query = Post.objects.raw(queryParams).order_by(
            [("createdDate", -1)]).limit(20)

        return [self.serialize(post) for post in query], 200

    def serialize(self, post):
        # Get the JSON format
        result = post.to_son()

        courses = current_user.courses

        for course in courses:
            if post.courseid == course.course_id:
                break

        result['course_name'] = course.course_name
        result['color'] = course.color

        # Convert datetime to a string
        date = str(result['createdDate'])
        result['createdDate'] = date

        date = str(result['updatedDate'])
        result['updatedDate'] = date
        return result
