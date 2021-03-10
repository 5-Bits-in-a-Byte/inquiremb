from flask_socketio import *
from auth import current_user
from flask import Blueprint, render_template

io = SocketIO(logger=True, engineio_logger=True, cors_allowed_origins="*")

# Blueprint stores authentication related routes
socketio_blueprint = Blueprint(
    'socketio_blueprint', __name__, template_folder='templates')


@io.on('connect')
def connect():
    print(current_user, "user")
    if current_user == None:
        raise ConnectionRefusedError('unauthorized testing!')
    else:
        print(current_user.first, "connected")
    return "connected"


@io.on('disconnect')
def test_disconnect():
    if current_user == None:
        print("Unauthorized user disconnected")
    else:
        print(f"{current_user.first} {current_user.last} disconnected")
    return "connected"


@io.on('blah')
def blah():
    return "blah"


@socketio_blueprint.route('/emit-msg')
def emit_msg():
    io.emit('test', {'msg': "abc", 'nums': [1, 2, 3]})
    return 'success'


@socketio_blueprint.route('/')
def index():
    return render_template("socketio.html")
