import express from "express";
import {checkIn,checkOut, getAttendanceByDate} from "../controllers/attendance.js"
const router = express.Router();

router.post("/checkin", checkIn);
router.post("/checkout/:id", checkOut);
router.get("/all", getAttendanceByDate);

export default router;