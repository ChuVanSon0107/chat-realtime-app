import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import cors from 'cors';

// load các biến môi trường để sử dụng
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// api để xác thực người dùng (đăng ký, đăng nhập, đăng xuất, kiểm tra người dùng)
app.use(express.json()); // Để server có thể đọc file json trong request
app.use(cookieParser()); // Để đọc được cookie 

// Cho phép frontend gửi request cho server
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);
});   