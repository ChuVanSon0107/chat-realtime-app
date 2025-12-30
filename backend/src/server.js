import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from './routes/user.route.js';
import friendRoutes from './routes/friend.route.js';
import friendRequestRoutes from './routes/friendRequest.route.js';
import conversationRoutes from './routes/conversation.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import { checkToken } from "./middlewares/auth.middleware.js";
import { app, server } from './lib/socket.js';

// load các biến môi trường để sử dụng
dotenv.config();

const PORT = process.env.PORT || 5000;

// api để xác thực người dùng (đăng ký, đăng nhập, đăng xuất, kiểm tra người dùng)
app.use(express.json({ limit: "5mb" })); // Để server có thể đọc file json trong request
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser()); // Để đọc được cookie 

// Cho phép frontend gửi request cho server
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// public routes
app.use("/api/auth", authRoutes);

// private routes
app.use(checkToken);
app.use("/api/friends", friendRoutes);
app.use("/api/friend-requests", friendRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);
});   