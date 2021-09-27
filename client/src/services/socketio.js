import socketIOClient from "socket.io-client";
// Controls reconnect attempts
// const io = socketIOClient(process.env.REACT_APP_SERVER_URL, {
//   withCredentials: true,
//   reconnectionAttempts: 1,
// });

let path = process.env.REACT_APP_SOCKETIO_PATH;


const io = socketIOClient("localhost:5000", {
  path: path,
  withCredentials: true,
  reconnectionAttempts: 1,
});


export default io;
