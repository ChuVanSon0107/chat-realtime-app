import express from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

// Đăng kí
router.post("/signup", signup);

// Đăng nhập
router.post("/signin", signin);

// Đăng xuất
router.post("/signout", signout);

export default router;