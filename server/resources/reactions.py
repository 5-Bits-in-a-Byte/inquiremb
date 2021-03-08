from flask_restful import Resource

{'contentType': 'comment', 'reaction': 'like'}




class Reaction(Resource):
    def get(self):
        return {'hello': 'world'}

    def delete(self, todo_id):
        return {'hello': 'delete'}

    def put(self, todo_id):
        return {'hello': 'put'}