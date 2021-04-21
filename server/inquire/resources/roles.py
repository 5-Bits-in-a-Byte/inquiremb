from flask import jsonify, request, current_app
from flask_restful import reqparse, Resource
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId
from inquire.socketio_app import io

class Roles(Resource):

    def post(self, courseId):
        parser = reqparse.RequestParser()
        parser.add_argument('permissions', type=dict)
        parser.add_argument('name')
        args = parser.parse_args()
        try:
            new_role = Role(roleName="test", permissions=args['permissions']).save()
            return {"status": "success", "role": self._serialize(new_role)}
        except Exception as exc:
            if type(exc) == list:
                return {"errors": [str(e) for e in exc]}
            else:
                return {"errors": str(exc)}

    def _serialize(self, role):
        j = role.to_son()
        j["_id"] = str(j["_id"])
        return j