import jwt from "jsonwebtoken";
import { Users } from "../models/users.model.js";
import dotenv from "dotenv";

dotenv.config(); 

// middleware kiểm tra token trong cookie trước khi gửi cho server xử lý request
export const checkToken = async (req, res, next) => {
  try {
    // Lấy jwt token trong cookies => muốn đọc được cookie phải bật cookieParser()
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Không có quyền truy cập!" });
    }

    // xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Không có quyền truy cập!" });
    }

    // Nếu jwt token hợp lệ => lấy id của user trong jwt token
    const userId = decoded.id;
    
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // Đính vào request để gửi đến cho server xử lý
    req.user = user;

    next();
  } catch (error) {
    console.error("❌ Lỗi trong checkToken middleware: ", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  }
}