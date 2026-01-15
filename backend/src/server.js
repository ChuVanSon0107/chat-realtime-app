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
import path from 'path';

// dotenv
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

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
app.use("/uploads", express.static(path.join(process.cwd(), 'public', 'uploads')));
app.use("/api/friends", friendRoutes);
app.use("/api/friend-requests", friendRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);
});   