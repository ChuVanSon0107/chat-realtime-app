import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { getUserConversationsForSocketIO } from '../controllers/conversation.controller.js';

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Lưu online users
const onlineUsers = new Map();// {userId, socketId}

// Lắng nghe kết nối
io.on("connection", async (socket) => {
  console.log(`A user connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers.set(userId, socket.id);
  }

  // Gửi thông tin đến client
  io.emit("online-users", Array.from(onlineUsers.keys()));

  // join room
  const conversationdIds = await getUserConversationsForSocketIO(userId);
  conversationdIds.forEach((conversationId) => {
    socket.join(conversationId.toString());
  });

  // join room cho tạo conversation realtime
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId.toString());
  })
  

  // Lắng nghe ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
    onlineUsers.delete(userId);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

export { io, app, server, onlineUsers };

