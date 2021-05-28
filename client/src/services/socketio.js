import socketIOClient from "socket.io-client";
// Controls reconnect attempts
const io = socketIOClient(process.env.REACT_APP_SERVER_URL+"/socketio", {
  withCredentials: true,
  reconnectionAttempts: 1,
});

export default io;
