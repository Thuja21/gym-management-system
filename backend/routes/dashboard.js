import express from "express";
import {
    recentNotices,
    totalActiveMembers,
    totalRegistration,
    totalSessionsToday,
    getLastWeekTotalAttendance,
    getRecentSessions,
    recentSessionsByTrainerId,
    getLastWeekCompletedSessionsByTrainer
} from "../controllers/dash.js";
import {verifyToken} from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/totalActiveMember" , totalActiveMembers);
router.get("/totalRegistration" , totalRegistration);
router.get("/recentNotices" , recentNotices);
router.get("/recentSessions" , recentSessionsByTrainerId);
router.get("/recentSessionOverall" , getRecentSessions);
router.get("/todaySessions" , totalSessionsToday);
router.get("/last-week-total" , getLastWeekTotalAttendance);
router.get("/completed-sessions" , verifyToken, getLastWeekCompletedSessionsByTrainer);

export default router;
