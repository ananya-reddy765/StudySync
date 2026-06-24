import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join Room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined ${roomId}`);
    });

    // Chat
    socket.on("send-message", (data) => {
      io.to(data.roomId).emit("receive-message", data);
    });

    // Whiteboard
    socket.on("draw", (data) => {
      socket.to(data.roomId).emit("draw", data);
    });

    socket.on("clear-board", (roomId) => {
      io.to(roomId).emit("clear-board");
    });

    // Video
    socket.on("user-connected", (data) => {
      socket.to(data.roomId).emit("user-connected", data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;