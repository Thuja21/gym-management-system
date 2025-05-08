import express from "express";
import {viewAllPlans, editPlan, addPlan, deletePlan, getLoggedInMemberPlan, updatePlanWithPayment} from "../controllers/plan.js";
import {verifyToken} from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/all" , viewAllPlans);
router.put("/edit/:id", editPlan);
router.post("/add", addPlan);
router.delete("/delete/:id", deletePlan);

router.get("/member", verifyToken, getLoggedInMemberPlan); // use middleware here
router.put('/update-plan-with-payment', verifyToken, updatePlanWithPayment);

export default router;