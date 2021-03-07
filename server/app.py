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
from resources.comments import Comments
from resources.replies import Replies
from resources.join import Join
# Auth imports
from auth import oauth, auth_routes

app = Flask(__name__, static_url_path="",
            static_folder='../client/build',
            template_folder='../client/build')

app.config['CORS_HEADERS'] = 'Content-Type'


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin',
                         'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
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
api.add_resource(Posts, '/courses/<string:course_id>/posts')
api.add_resource(
    Comments, '/posts/<string:post_id>/comments')
api.add_resource(
    Replies, '/posts/<string:post_id>/comments/<string:comment_id>/replies')
api.add_resource(Join, '/join')

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
