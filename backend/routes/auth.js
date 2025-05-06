import express from "express";
import { login, register, logout } from "../controllers/auth.js";
import {verifyToken} from "../middleware/verifyToken.js";
import {getLoggedInMemberPlan} from "../controllers/plan.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);


export default router;
