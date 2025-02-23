import express from "express";
import {viewAllSupplements} from "../controllers/supplement.js";
const router = express.Router();

router.get("/all", viewAllSupplements);

export default router;