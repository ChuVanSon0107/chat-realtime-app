import jwt from "jsonwebtoken";
import { Users } from "../models/users.model.js";
import dotenv from "dotenv";

// load các biến môi trường và sử dụng
dotenv.config(); 

// middleware kiểm tra token trong cookie trước khi gửi cho server xử lý request
export const checkToken = async (req, res, next) => {
  try {
    // Lấy jwt token trong cookies => muốn đọc được cookie phải bật cookieParser()
    const token = req.cookies.jwt;

    // Kiểm tra jwt token có tồn tại hay không
    if (!token) {
      return res.status(401).json({ message: "Không có quyền truy cập!" });
    }

    // Kiểm tra xem jwt token có hợp lệ hay không => xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Nếu jwt token không hợp lệ
    if (!decoded) {
      return res.status(401).json({ message: "Không có quyền truy cập!" });
    }

    // Nếu jwt token hợp lệ => lấy id của user trong jwt token
    const userId = decoded.id;
    
    // Tìm user dựa vào id
    const user = await Users.findById(userId);

    // Nếu không tồn tại người dùng
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // Nếu tồn tại => đính vào request để gửi đến cho server xử lý
    req.user = user;

    // Gọi các middlewares hoặc các hàm tiếp theo
    next();
  } catch (error) {
    console.error("❌ Lỗi trong checkToken middleware: ", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  }
}