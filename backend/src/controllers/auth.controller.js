import { generateToken } from "../lib/utils.js";
import { Users } from "../models/users.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

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
      // Tạo token và trả về cho client => Không cần đăng nhập lại khi gửi request
      generateToken(newUser.id, res);

      return res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
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
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng dựa theo email
    const user = await Users.findByEmail(email);

    // Người dùng không tồn tại
    if (!user) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
    }

    // Kiểm tra mật khẩu
    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

    // Mật khẩu không đúng
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
    }

    // Mật khẩu đúng => Tạo token và đính vào response trả về
    generateToken(user.id, res);

    // Trả về thông tin người dùng
    return res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.error("❌ Lỗi trong signin controller: ", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};


// Đăng xuất
export const signout = async (req, res) => {
  try {
    // Đăng xuất => xóa jwt token trong cookie
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    console.error("❌ Lỗi trong signout controller: ", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};


// Kiểm tra quyền truy cập
export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("❌ Lỗi trong checkAuth controller: ", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};

// Cập nhật ảnh đại diện
export const updateProfile = async (req, res) => {
  try {
    // Lấy ảnh trong body
    const { profilePic } = req.body;
    const userId = req.user.id;

    if (!profilePic) {
      return res.status(400).json({ message: "Không có ảnh đại diện để cập nhật!" });
    }

    // upload ảnh lên cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await Users.updateProfilePic(userId, uploadResponse.secure_url);

    // Trả thông tin người dùng về cho client
    return res.status(200).json({
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic
    });

  } catch (error) {
    console.error("❌ Lỗi trong updateProfile controller: ", error.message);
    return res.status(500).json({ message: "Lỗi server!" });
  } 
};