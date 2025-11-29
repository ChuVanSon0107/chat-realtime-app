import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Để load các biến môi trường và sử dụng
dotenv.config(); 

// Tạo token để đính vào cookie của response và trả về cho người dùng
// Để người dùng có thể dùng cái token này cho những request sau mà không cần đăng nhập lại
// Truyền vào id của user và response
export const generateToken = async (id, res) => {
  const TTL = 7; // số ngày

  // Kí => tạo token
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${TTL}d`, // Hạn sử dụng token
  });

  // Lưu token vào cookie của respone trả về
  res.cookie("jwt", token, {
    maxAge: TTL * 24 *  60 * 60 * 1000, // miliseconds
    httpOnly: true, // ngăn chặn tấn công XSS (cross-site scripting attacks)
    sameSite: "strict", // ngăn chặn tấn công  CSRF (cross-ste request forgery attacks)
    secure: process.env.NODE_ENV !== "development", // Gửi cookie chỉ qua HTTPS trong môi trường production
  });

  return token;
}