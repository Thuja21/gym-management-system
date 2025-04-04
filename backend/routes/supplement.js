import express from "express";
import { viewAllSupplements, editSupplement, deleteSupplement } from "../controllers/supplement.js";
const router = express.Router();

// Routes for supplements
router.get("/all", viewAllSupplements);
// router.post("/"/upload", upload.single("image"", addSupplement); // Using router.post
router.put("/edit/:id", editSupplement); // Using router.put
router.delete("/delete/:id", deleteSupplement);


export default router;
