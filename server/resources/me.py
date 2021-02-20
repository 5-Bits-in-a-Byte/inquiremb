from flask import jsonify
from flask_restful import Resource
from auth import current_user, permission_layer


class Me(Resource):
    @permission_layer(["admin", "write"], "course_id_1")
    def get(self):
        return current_user.to_son().to_dict()
