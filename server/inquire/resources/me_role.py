'''
This file deals with the MeRole resource. It's responsible for handling the get request
to obtain the current_user's permissions.

Authors: Seth Tal
Group Name: 5 Bits in a Byte

Last Modified Date: 04/29/2021
'''
from flask import jsonify
from flask_restful import Resource, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *


class MeRole(Resource):
    @permission_layer([])
    def get(self, courseId=None):
        return current_user.permissions
