import express from "express";
import {addEquipment, deleteEquipment, editEquipment, viewAllEquipments} from "../controllers/equipment.js";
const router = express.Router();

router.get('/all' , viewAllEquipments);


router.post("/add", addEquipment);

// Edit an existing member by ID
router.put("/edit/:id", editEquipment);


// Delete a member by ID
router.delete("/delete/:id", deleteEquipment);

export default router;


