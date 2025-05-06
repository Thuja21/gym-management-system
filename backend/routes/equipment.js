import express from "express";
import {deleteEquipment, viewAllEquipments, addEquipmentVariants, updateEquipmentItem, deleteEquipmentItem} from "../controllers/equipment.js";
const router = express.Router();

router.get('/all' , viewAllEquipments);
router.post('/add', addEquipmentVariants);
router.put('/edit/:id', updateEquipmentItem);

router.delete("/delete/:id", deleteEquipment);
router.delete("/delete-item/:variantId", deleteEquipmentItem);

export default router;


