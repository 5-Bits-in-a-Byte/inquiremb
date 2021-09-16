'''
This resource deals with search functionality so that users can search for specific posts.

Author: Brian Gunnarson
Group Name: 5 Bits in a Byte

Last Modified Date: 08/10/2021
'''
from flask import request
from flask_restful import Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *


class Search(Resource):
    @permission_layer(require_joined_course=True)
    def get(self, courseId=None):
        """
        Retrieves posts that include the search string
        ---
        tags:
          - Posts     
        parameters:
          - in: path
                name: courseId
                required: true
                description: course id from which to retrieve posts
          - in: query
                name: search
                schema:
                  type: string
                  required: true
                description: Filter posts by search
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
        search = request.args.get('search')

        if search is None or search == "":
            return {"errors": ["Nothing to be searched for."]}, 401

        user_perms = current_user.permissions

        # -1 sorts newest first
        sort_date = -1

        queryParams = {"courseId": courseId}

        # TODO: parallel query for title text; prioritize raw text over title

        # If the current user can see private posts
        if user_perms["privacy"]["private"]:
            queryParams['$text'] = {'$search': search}
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", sort_date)])

        # If the current user cannot see private posts
        elif not user_perms["privacy"]["private"]:
            queryParams['$or'] = [{'isPrivate': False}, {'postedBy._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams['$text'] = {'$search': search}
            query = Post.objects.raw(queryParams).order_by(
                [('isPinned', -1), ('createdDate', sort_date)])

        course = current_user.get_course(courseId)
        viewed = course.viewed
        # Get the json for all the posts we want to display
        result = [self.serialize(post, viewed=viewed) for post in query]

        return result, 200

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
