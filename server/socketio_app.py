from flask_socketio import *
from auth import current_user, permission_layer
from flask import Blueprint, render_template

io = SocketIO(logger=True, engineio_logger=False, cors_allowed_origins="*")

# Blueprint stores authentication related routes
socketio_blueprint = Blueprint(
    'socketio_blueprint', __name__, template_folder='templates')


@io.on('connect')
def connect():
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


@socketio.on('join')
def on_join(data):
    room = data['room']
    room_type = data['room_type']
    status = False
    if room_type == "course":
        course = current_user.get_course(room)
        if course:
            status = True
    elif room_type == "post":
        post = Post.objects.raw({'_id': room}).first()
        if post is not None:
            course = current_user.get_course(post.courseid)
            if course:
                status = True
    if status:
        join_room(room)
    send(current_user.first + ' has entered the room.', room=room)


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)


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
