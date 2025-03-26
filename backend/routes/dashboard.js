import express from "express";
import {
    recentNotices,
    recentSessions,
    totalActiveMembers,
    totalRegistration,
    totalSessionsToday
} from "../controllers/dash.js";
const router = express.Router();

router.get("/totalActiveMember" , totalActiveMembers);
router.get("/totalRegistration" , totalRegistration);
router.get("/recentNotices" , recentNotices);
router.get("/recentSessions" , recentSessions);
router.get("/todaySessions" , totalSessionsToday);

export default router;
