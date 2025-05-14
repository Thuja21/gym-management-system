import express from "express";
import {viewAllProgress, addProgress, getLoggedInMemberProgress} from "../controllers/progress.js";
import {verifyToken} from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/get/:id" , viewAllProgress);
router.post("/add/:id", addProgress);

router.get("/progress", verifyToken, getLoggedInMemberProgress);

export default router;