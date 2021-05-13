import socketIOClient from "socket.io-client";
// Controls reconnect attempts
const io = socketIOClient(process.env.REACT_APP_SERVER_URL, {
  withCredentials: true,
  reconnectionAttempts: 3,
});

export default io;
