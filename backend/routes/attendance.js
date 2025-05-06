import express from "express";
import {checkIn,checkOut, getAttendanceByDate, getLoggedInMemberAttendance} from "../controllers/attendance.js"
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/checkin", checkIn);
router.post("/checkout/:id", checkOut);
router.get("/all", getAttendanceByDate);
router.get("/member", verifyToken, getLoggedInMemberAttendance); // use middleware here

export default router;