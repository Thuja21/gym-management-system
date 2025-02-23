import express from "express";
import {viewAllEquipments} from "../controllers/equipment.js";
const router = express.Router();

router.get('/all' , viewAllEquipments);

export default router;