import express from "express";
import {viewAllProgress, addProgress} from "../controllers/progress.js";
const router = express.Router();

router.get("/get/:id" , viewAllProgress);
router.post("/add/:id", addProgress);

export default router;