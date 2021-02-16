from flask import Flask
from flask_restful import Api
import config
import os
# Import API endpoints here:
from resources.demo import Demo
# Auth imports
from auth import oauth, auth_routes

app = Flask(__name__)
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

if __name__ == '__main__':
    app.run(debug=True)
