import express from "express";
import { checkAuth, signin, signout, signup, updateProfile } from "../controllers/auth.controller.js";
import { checkToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Đăng kí
router.post("/signup", signup);

// Đăng nhập
router.post("/signin", signin);

// Đăng xuất
router.post("/signout", signout);

// Kiểm tra truy cập người dùng => gọi api khi chúng ta refresh lại page => kiểm tra truy cập người dùng
router.get("/check-auth", checkToken, checkAuth);

// Cập nhật ảnh đại diện => phải kiểm tra jwt token trước khi đưa request cho server xử lý
router.put("/update-profile", checkToken, updateProfile);

export default router;