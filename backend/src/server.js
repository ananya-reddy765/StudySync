import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import quizRoutes from "./routes/quiz.routes.js";
import studyRoomRoutes from "./routes/studyRoomRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import tutorRequestRoutes from "./routes/tutorRequestRoutes.js";

// ================= DATABASE =================
connectDB();

// ================= EXPRESS =================
const app = express();
app.use("/api/admin", adminRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api/tutor-request",
  tutorRequestRoutes
);
// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ================= ROOT =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudySync API Running 🚀",
  });
});

// ================= ROUTES =================

// Auth
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);

// Groups
app.use("/api/groups", groupRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);

// Tutors
app.use("/api/tutors", tutorRoutes);

// Quest Arena / Quizzes
app.use("/api", quizRoutes);

// Study Rooms
app.use("/api/study-rooms", studyRoomRoutes);

// ================= HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ================= ROOM STORAGE =================
const roomUsers = new Map();
const roomStrokes = new Map();

const getRoomUsers = (roomId) =>
  roomUsers.get(roomId) || [];

const addUser = (roomId, user) => {
  const users = getRoomUsers(roomId);

  const filtered = users.filter(
    (u) => u.socketId !== user.socketId
  );

  filtered.push(user);

  roomUsers.set(roomId, filtered);

  return filtered;
};

const removeUser = (socketId, roomId) => {
  if (!roomUsers.has(roomId)) return [];

  const users = roomUsers
    .get(roomId)
    .filter((u) => u.socketId !== socketId);

  if (users.length === 0) {
    roomUsers.delete(roomId);
    roomStrokes.delete(roomId);
  } else {
    roomUsers.set(roomId, users);
  }

  return users;
};

const addStroke = (roomId, stroke) => {
  if (!roomStrokes.has(roomId)) {
    roomStrokes.set(roomId, []);
  }

  const strokes = roomStrokes.get(roomId);

  strokes.push(stroke);

  if (strokes.length > 3000) {
    strokes.shift();
  }
};

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("join-room", (payload) => {
    try {
      const roomId =
        typeof payload === "string"
          ? payload
          : payload.roomId;

      const userName =
        payload.userName || "Anonymous";

      const peerId =
        payload.peerId || null;

      socket.join(roomId);

      socket.data.roomId = roomId;
      socket.data.userName = userName;
      socket.data.peerId = peerId;

      const users = addUser(roomId, {
        socketId: socket.id,
        userName,
        peerId,
      });

      io.to(roomId).emit("room-users", users);

      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        userName,
        peerId,
      });

      const strokes =
        roomStrokes.get(roomId) || [];

      if (strokes.length) {
        socket.emit("draw-history", strokes);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("leave-room", () => {
    const roomId = socket.data.roomId;

    if (!roomId) return;

    socket.leave(roomId);

    const users = removeUser(
      socket.id,
      roomId
    );

    io.to(roomId).emit("room-users", users);

    socket.to(roomId).emit("user-left", {
      socketId: socket.id,
    });
  });

  socket.on(
    "send-message",
    ({ roomId, sender, message }) => {
      io.to(roomId).emit(
        "receive-message",
        {
          sender,
          message,
          createdAt: new Date(),
        }
      );
    }
  );

  socket.on(
    "typing",
    ({ roomId, userName }) => {
      socket.to(roomId).emit(
        "typing",
        userName
      );
    }
  );

  socket.on(
    "draw-start",
    ({ roomId, data }) => {
      socket.to(roomId).emit(
        "draw-start",
        data
      );

      addStroke(roomId, {
        ...data,
        type: "start",
      });
    }
  );

  socket.on(
    "draw",
    ({ roomId, data }) => {
      socket.to(roomId).emit(
        "draw",
        data
      );

      addStroke(roomId, {
        ...data,
        type: "draw",
      });
    }
  );

  socket.on("draw-end", ({ roomId }) => {
    socket.to(roomId).emit("draw-end");
  });

  socket.on("clear-board", (roomId) => {
    io.to(roomId).emit("clear-board");
    roomStrokes.delete(roomId);
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;

    if (!roomId) return;

    const users = removeUser(
      socket.id,
      roomId
    );

    io.to(roomId).emit("room-users", users);

    socket.to(roomId).emit("user-left", {
      socketId: socket.id,
    });

    console.log(
      "🔴 Disconnected:",
      socket.id
    );
  });
});

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});