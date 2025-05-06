import express from "express";
import {
    viewAllSupplements,
    editSupplement,
    deleteSupplement,
    getAllSupplementCategories
} from "../controllers/supplement.js";
const router = express.Router();

// Routes for supplements
router.get("/all", viewAllSupplements);
// router.post("/"/upload", upload.single("image"", addSupplement); // Using router.post
router.put("/editR/:id", editSupplement); // Using router.put
router.delete("/delete/:id", deleteSupplement);

router.get("/categories", getAllSupplementCategories);


export default router;
