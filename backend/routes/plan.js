import express from "express";
import {viewAllPlans} from "../controllers/plan.js";
const router = express.Router();

router.get("/all" , viewAllPlans)

export default router;