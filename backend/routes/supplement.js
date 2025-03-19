import express from "express";
import {viewAllSupplements, editSupplement, addSupplement, deleteSupplement } from "../controllers/supplement.js";
import {addPlan, deletePlan, editPlan} from "../controllers/plan.js";
const router = express.Router();

router.get("/all", viewAllSupplements);
router.put("/edit/:id", editSupplement);
router.post("/add", addSupplement);
router.delete("/delete/:id", deleteSupplement);

export default router;