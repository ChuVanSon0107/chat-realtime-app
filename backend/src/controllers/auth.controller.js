import { generateToken } from "../lib/utils.js";
import { Users } from "../models/users.model.js";
import bcrypt from "bcryptjs";

// Đăng kí
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Kiểm tra xem trường nào còn trống không
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "Tất cả các trường phải được điền!" });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có chiều dài lớn hơn hoặc bằng 6!" });
    }
    
    // Tìm xem email này đã được đăng kí hay chưa
    const existingUser = await Users.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được đăng kí!" });
    }

    // Email chưa được đăng kí => cho phép tạo tài khoản mới
    const salt = await bcrypt.genSalt(10); // Tạo salt để băm cùng password
    const hashedPassword = await bcrypt.hash(password, salt); // băm mật khẩu

    const newUser = await Users.create({
      fullName,
      email, 
      hashedPassword
    });

    if (newUser) {
      // Tạo token và trả về cho client
      generateToken(newUser.id, res);

      return res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email
      });
    } else {
      // Không tạo được người dùng mới
      return res.status(400).json({ message: "Không tạo được tài khoản!" });
    }

  } catch (error) {
    console.error("❌ Lỗi trong signup controller: ", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};


// Đăng nhập
export const signin = async () => {
  console.log("Đăng nhập!");
};


// Đăng xuất
export const signout = async () => {
  console.log("Đăng xuất!");
};
