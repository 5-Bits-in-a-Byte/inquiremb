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
          User:
            type: object
            properties:
              _id:
                type: string
                description: Unique user identifier
                example: abcde12345
              anonymousId:
                type: string
                description: Secondary unique user identifier
                example: d1e2f3g4h5
              email:
                type: string
                description: Email address
                example: cyrilfiggis@gmail.com
              first:
                type: string
                description: First name
                example: Cyril
              last:
                type: string
                description: Last name
                example: Figgis
              picture:
                type: string
                description: URL of the user's avatar picture
                example: https://avatars.githubusercontent.com/u/111111111?v=4
              courses:
                type: array
                items:
                  $ref: '#/definitions/UserCourse'

          UserCourse:
            type: object
            properties:
              course_id:
                type: string
                description: ID of the course the user joined
                example: vytxeTZskVKR7C7WgdSP3d
              course_name:
                type: string
                description: Name associated with the course
                example: "CIS499 Advanced Debugging"
              nickname:
                type: string
                description: Course nickname
                example: "CIS499"
              color:
                type: string
                description: Accent color used in course specific ui
                example: "#ee55ee"
              canPost:
                type: boolean
                description: If the user can post in the course
                default: true
                example: true
              seePrivate:
                type: boolean
                description: If the user can see private posts in the course
                default: false
                example: false
              canPin:
                type: boolean
                description: If the user user can pin posts
                default: false
                example: false
              canRemove:
                type: boolean
                description: If the user can remove posts from the course
                default: false
                example: false
              canEndorse:
                type: boolean
                description: If the user can endorse posts in the course
                default: false
                example: true
              viewAnonymous:
                type: boolean
                description: If the user can view the identity of anonymous posters
                default: false
                example: true
              admin:
                type: boolean
                description: If the user is an administrator of the course
                default: false
                example: false

          403 Response:
            type: object
            description: Response to authorized requests 
            properties:
              errors:
                type: array
                description: List of authorization errors
                example: ["Resource access restricted: missing course permission(s) admin, seePrivate"]

        responses:
          200:
            description: Stored user data for the currently logged in user
            schema:
              $ref: '#/definitions/User'
          403:
            description: Unable to retrieve current user data
            schema:
              $ref: '#/definitions/403Message'



        """
        return current_user.to_son().to_dict()
