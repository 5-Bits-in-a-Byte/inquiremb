from mongo import *
from flask import Flask, render_template, request, send_from_directory, jsonify
from flask_restful import Api
from flasgger import Swagger
import config
import os
# Import API endpoints here:
from resources.demo import Demo
from resources.me import Me
from resources.courses import Courses
from resources.posts import Posts
# Auth imports
from auth import oauth, auth_routes
from flask_cors import CORS

app = Flask(__name__, static_url_path="",
            static_folder='../client/build',
            template_folder='../client/build')

# Allow requests from our localhost (react app in development)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


# Adding secret key to app
app.secret_key = '!secret'
# Configuring flask app
app.config.from_object(config)

# Blueprints
app.register_blueprint(auth_routes)

# Configuring OAuth object
oauth.init_app(app)
CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth.register(
    name='google',
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid email profile'
    }
)

api = Api(app, prefix="/api")
swagger = Swagger(app, config=config.swagger_config)
# register endpoints from /resources folder here:
api.add_resource(Demo, '/demo')
api.add_resource(Me, '/me')
api.add_resource(Courses, '/courses')
api.add_resource(Posts, '/courses/<string:course_id>/posts', endpoint='posts')
#api.add_resource(Comments, '/courses/<string:course_id>/posts/<string:post_id>')

# @ app.route("/")


def hello():
    return render_template("index.html")


# @app.route("/<path:path>")
def static_proxy(path):
    """static folder serve"""
    file_name = path.split("/")[-1]
    dir_name = os.path.join(app.static_folder, "/".join(path.split("/")[:-1]))
    return send_from_directory(dir_name, file_name)


# @app.errorhandler(404)
def handle_404(e):
    if request.path.startswith("/api/"):
        return jsonify(message="Resource not found"), 404
    return send_from_directory(app.static_folder, "index.html")


if __name__ == '__main__':
    app.run(debug=True)
