import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { pool } from "./db/index.js";

let io; // 🔥 singleton reference

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // adjust in production
    },
  });

  // 🔐 socket auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userRes = await pool.query(
        `SELECT id, username FROM users WHERE id = $1`,
        [decoded.id]
      );

      if (userRes.rows.length === 0) {
        return next(new Error("User not found"));
      }

      socket.user = userRes.rows[0]; // attach user
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 socket connected", socket.user.username);

    // join conversation rooms
    socket.on("join:conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });
socket.on("leave:conversation", (conversationId) => {
  socket.leave(`conversation:${conversationId}`);
});

    socket.on("disconnect", () => {
      console.log("🔴 socket disconnected", socket.user.username);
    });
  });

  return io;
};

// 🔥 used by REST controllers
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
