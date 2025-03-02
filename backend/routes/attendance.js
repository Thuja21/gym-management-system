import express from "express";
import {checkIn, getAttendanceByDate} from "../controllers/attendance.js"
const router = express.Router();

router.post("/checkin", checkIn);
// router.post("/checkout", checkOut);
router.get("/all", getAttendanceByDate);

export default router;