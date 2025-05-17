import express from "express";
import { getAllPaymentDetails, getPaymentDetails} from "../controllers/planPayment.js";
import {verifyToken} from "../middleware/verifyToken.js";
const router = express.Router();


router.get('/details', verifyToken, getPaymentDetails);
router.get('/payments', getAllPaymentDetails);

export default router;