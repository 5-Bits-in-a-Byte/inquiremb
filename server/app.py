from mongo import *
from flask import Flask, render_template, request, send_from_directory
from flask_restful import Api
import config
import os
# Import API endpoints here:
from resources.demo import Demo
# Auth imports
from auth import oauth, auth_routes

app = Flask(__name__, static_url_path="",
            static_folder='../client/build',
            template_folder='../client/build')
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

api = Api(app)

# register endpoints from /resources folder here:
api.add_resource(Demo, '/demo')


@ app.route("/")
def hello():
    return render_template("index.html")


@app.route("/<path:path>")
def static_proxy(path):
    """static folder serve"""
    file_name = path.split("/")[-1]
    dir_name = os.path.join(app.static_folder, "/".join(path.split("/")[:-1]))
    return send_from_directory(dir_name, file_name)


@app.errorhandler(404)
def handle_404(e):
    if request.path.startswith("/api/"):
        return jsonify(message="Resource not found"), 404
    return send_from_directory(app.static_folder, "index.html")


if __name__ == '__main__':
    app.run(debug=True)
