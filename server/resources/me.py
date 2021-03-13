from flask import jsonify
from flask_restful import Resource, reqparse
from auth import current_user, permission_layer
from mongo import *


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
