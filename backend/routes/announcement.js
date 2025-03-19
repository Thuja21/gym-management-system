import express from "express";
import { viewAllAnnouncements, addAnnouncement, deleteAnnouncement} from "../controllers/announcement.js";
import {viewAllEquipments} from "../controllers/equipment.js";

const router = express.Router();

router.post("/add", addAnnouncement);
router.delete("/delete/:id", deleteAnnouncement);
// router.put("/edit/:id", editAnnouncement);
router.get("/all", viewAllAnnouncements);

export default router;
