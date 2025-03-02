import express from "express";
import {getAllMembers, viewAllPlanPayments,} from "../controllers/planPayment.js";
const router = express.Router();

router.get('/all' , viewAllPlanPayments);
router.get('/getmembers' , getAllMembers);

export default router;