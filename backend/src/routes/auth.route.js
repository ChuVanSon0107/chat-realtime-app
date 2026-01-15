import express from "express";
import { checkAuth, signin, signout, signup, updateProfile } from "../controllers/auth.controller.js";
import { checkToken } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/uploadImage.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

// Kiểm tra truy cập người dùng => gọi api khi chúng ta refresh lại page => kiểm tra truy cập người dùng
router.get("/check-auth", checkToken, checkAuth);

router.put("/update-profile", checkToken, upload.single('profilePic'), updateProfile);

export default router;