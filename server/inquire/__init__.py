'''
This file puts the entire backend together. It sets up the app with a secret key and configuration
variables, creates routes for OAuth purposes, and establishes endpoints for resources.

Authors: Brian Gunnarson, Sam Peters, and Alec Springel
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
from flask import Flask
from flask_restful import Api
from flasgger import Swagger


def create_app(override_config=None, testing=False, include_socketio=True):
    app = Flask(__name__, static_url_path="",
                static_folder='../client/build',
                template_folder='../client/build')

    # CORS
    app.config['CORS_HEADERS'] = 'Content-Type'

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin',
                             config.CLIENT_URL)
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET,PUT,POST,DELETE,OPTIONS')
        return response

    # Adding secret key to app
    app.secret_key = '!secret'
    from inquire import config
    # Configuring flask app
    if override_config:
        app.config.from_object(override_config)
    else:
        app.config.from_object(config)

    app.config['include_socketio'] = include_socketio

    import pymodm.connection
    pymodm.connection.connect(app.config['MONGO_URI'], alias="my-app")
    # Direct reference to db connection, used during testing to reset database between tests
    if app.config['TESTING']:
        app.db = pymodm.connection._get_db('my-app')

    # Importing blueprints
    from inquire.auth import auth_routes
    from inquire.socketio_app import socketio_blueprint
    # Adding blueprints to app blueprints
    app.register_blueprint(auth_routes)
    app.register_blueprint(socketio_blueprint)

    from inquire.auth import oauth
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

    oauth.register(
        name='github',
        access_token_url='https://github.com/login/oauth/access_token',
        authorize_url='https://github.com/login/oauth/authorize',
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'read:user user:email'},
    )
    from inquire.resources import Demo, Me, Courses, Posts, Comments, Replies, Join, Reactions, Home, Roles

    api = Api(app, prefix="/api")

    # Adding Swagger API docs to app
    swagger = Swagger(app, config=config.swagger_config)

    # register endpoints from /resources folder here:
    api.add_resource(Roles, '/courses/<string:courseId>/roles')
    api.add_resource(Demo, '/demo')
    api.add_resource(Me, '/me')
    api.add_resource(Courses, '/courses')
    api.add_resource(Reactions, '/reactions')
    api.add_resource(Home, '/home')
    api.add_resource(Posts, '/courses/<string:courseId>/posts')
    api.add_resource(
        Comments, '/posts/<string:postId>/comments')
    api.add_resource(
        Replies, '/posts/<string:postId>/comments/<string:comment_id>/replies')
    api.add_resource(Join, '/join')
    if include_socketio:
        # Wrapping flask app in socketio wrapper
        from inquire.socketio_app import io
        io.init_app(app)
        app.socketio = io
        return io, app
    else:
        return app


if __name__ == '__main__':
    if False:
        io, app = create_app()
        io.run(app, host="0.0.0.0", debug=True, log_output=True)
    else:
        app = create_app(include_socketio=False)
        app.run(host="0.0.0.0", debug=True)
