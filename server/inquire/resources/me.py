'''
This file deals with the Me resource. It's responsible for handling the get request
to obtain the current_user's information.

Authors: Sam Peters
Group Name: 5 Bits in a Byte

Last Modified Date: 02/15/2021
'''
from flask import jsonify
from flask_restful import Resource, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *


class Me(Resource):
    @permission_layer([])
    def get(self):
        """
        Retrieves the current user
        ---
        tags:
          - User
        definitions:
          import: "./flasgger/responses.yml"
          import: "./flasgger/courses.yml"
          import: "./flasgger/user.yml"
          import: "./flasgger/shared.yml"
          import: "./flasgger/posts.yml"
          import: "./flasgger/comments.yml"
          import: "./flasgger/replies.yml"
          import: "./flasgger/requests.yml"

        responses:
          200:
            description: Stored user data for the currently logged in user
            schema:
              $ref: '#/definitions/User'
          403:
            description: Unable to retrieve current user data
            schema:
              $ref: '#/definitions/403Response'
        """
        return current_user.to_son().to_dict()
