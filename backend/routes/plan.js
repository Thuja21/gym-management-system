import express from "express";
import {viewAllPlans, editPlan, addPlan} from "../controllers/plan.js";
import {editMember} from "../controllers/member.js";
const router = express.Router();

router.get("/all" , viewAllPlans);
router.put("/edit/:id", editPlan);
router.post("/add", addPlan);

export default router;