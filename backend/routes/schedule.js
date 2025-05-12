import express from "express";
import { viewAllSchedules, addSchedule, deleteSchedule, editSchedule, getLoggedInTrainerSchedule, getTodaySessionCount} from "../controllers/schedule.js";
import {verifyToken} from "../middleware/verifyToken.js";
import {getLoggedInMemberPlan} from "../controllers/plan.js";

const router = express.Router();

router.post("/add", verifyToken, addSchedule);
router.delete("/delete/:id", deleteSchedule);
router.put("/edit/:id", editSchedule);
router.get("/all", viewAllSchedules);

router.get("/all", viewAllSchedules);

router.get("/schedule", verifyToken, getLoggedInTrainerSchedule); // use middleware here
router.get("/sessionCount", verifyToken, getTodaySessionCount); // use middleware here

export default router;
