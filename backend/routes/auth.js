import express from "express";
import {login, register, logout, forgotPassword, verifyCode, resetPassword} from "../controllers/auth.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);


export default router;
