import express from "express";
import {addEquipment, deleteEquipment, editEquipment, viewAllEquipments} from "../controllers/equipment.js";
const router = express.Router();

router.get('/all' , viewAllEquipments);
router.post("/add", addEquipment);
router.put("/edit/:id", editEquipment);
router.delete("/delete/:id", deleteEquipment);

export default router;


