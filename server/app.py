import flask
from flask_restful import Api
# Import API endpoints here:
from resources.demo import Demo

app = flask.Flask(__name__)
api = Api(app)

# register endpoints from /resources folder here:
api.add_resource(Demo, '/demo')

if __name__ == '__main__':
    app.run(debug=True)
