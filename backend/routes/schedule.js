import express from "express";
import { viewAllSchedules, addSchedule, deleteSchedule, editSchedule} from "../controllers/schedule.js";

const router = express.Router();

router.post("/add", addSchedule);
router.delete("/delete/:id", deleteSchedule);
router.put("/edit/:id", editSchedule);
router.get("/all", viewAllSchedules);

export default router;
