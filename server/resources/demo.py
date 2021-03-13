'''
This is a demo file for setting up a resource.

Author: Sam Peters

Last Modified Date: 02/10/21
'''
from flask_restful import Resource


class Demo(Resource):
    def get(self):
        return {'hello': 'world'}

    def delete(self, todo_id):
        return {'hello': 'delete'}

    def put(self, todo_id):
        return {'hello': 'put'}
