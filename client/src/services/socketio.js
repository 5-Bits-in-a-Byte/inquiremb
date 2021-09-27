import socketIOClient from "socket.io-client";
// Controls reconnect attempts
// const io = socketIOClient(process.env.REACT_APP_SERVER_URL, {
//   withCredentials: true,
//   reconnectionAttempts: 1,
// });

let path = "/api/socket.io"; // process.env.REACT_APP_SOCKETIO_PATH;

const io = socketIOClient("https://inquiremb.com", {
  path: path,
  withCredentials: true,
  reconnectionAttempts: 1,
});

export default io;
