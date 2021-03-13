'''
This file deals with the Home resource. It's responsible for getting the 20 most
recent posts from all of a users classes to display on the home page.

Authors: Brian Gunnarson

Last Modified Date: 03/12/2021
'''
from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *
from utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId


class Home(Resource):
    def get(self):
        """
        Retrieves all the posts in a users feed
        ---
        tags:
          - Other         
        responses:
          200:
            description: Returns list of posts
            schema:
                type: array
                items:
                    $ref: '#/definitions/Post'
        """
        # TODO: should I add this? Would you be able to handle this format on the front end or should I change it?

        if len(current_user.courses) == 0:
            return []

        course_ids = []
        for course in current_user.courses:
            course_ids.append(course.course_id)

        # TODO: how do we query for private posts in one course but not others?

        # Add all of the user's course ids to the query params from our list of course ids
        queryParams = {"courseid": {"$in": course_ids}}

        # Only showing private posts or posts you've created added to query params
        queryParams["$or"] = [{'isPrivate': False}, {'postedby._id': {
            '$in': [current_user._id, current_user.anonymousId]}}]

        # Query for desired posts using query params, order them by most recent, and limit it to 20 posts
        query = Post.objects.raw(queryParams).order_by(
            [("createdDate", -1)]).limit(20)

        count = query.count()
        if count == 0:
            return []

        result = [self.serialize(post) for post in query]

        # Serialize and return the posts
        return result, 200

    def serialize(self, post):
        # Get the JSON format
        result = post.to_son()

        # Get the list of user courses
        courses = current_user.courses

        # Loop through until we find the course id that matches with the course id for the post
        for course in courses:
            if post.courseid == course.course_id:
                break

        # Add the course name and color to the resulting json we'll send back to the client
        result['course_name'] = course.course_name
        result['color'] = course.color

        # Convert datetime to a string
        date = str(result['createdDate'])
        result['createdDate'] = date

        date = str(result['updatedDate'])
        result['updatedDate'] = date
        return result
