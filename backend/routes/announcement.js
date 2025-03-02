import express from "express";
import { viewAllAnnouncements} from "../controllers/announcement.js";
import {viewAllEquipments} from "../controllers/equipment.js";

const router = express.Router();

// router.post("/add", addAnnouncement);
// router.delete("/delete", deleteAnnouncement);
// router.put("/edit", editAnnouncement);
router.get("/all", viewAllAnnouncements);

export default router;
