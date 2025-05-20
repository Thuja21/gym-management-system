import express from "express";
import { getAllPaymentDetails, getPaymentDetails, getAllSuppmentPaymentDetails, getSuppmentPaymentDetails} from "../controllers/planPayment.js";
import {verifyToken} from "../middleware/verifyToken.js";
const router = express.Router();


router.get('/details', verifyToken, getPaymentDetails);
router.get('/payments', getAllPaymentDetails);
router.get('/supplementPayments', getAllSuppmentPaymentDetails);
router.get('/supplePayments',verifyToken, getSuppmentPaymentDetails);

export default router;