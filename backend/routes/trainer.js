import express from "express";
import { viewAllTrainers ,addTrainer, deleteTrainer, editTrainer, getLoggedInTrainerDetails} from "../controllers/trainer.js";
import {verifyToken} from "../middleware/verifyToken.js";
import {getLoggedInMemberDetails} from "../controllers/member.js";
const router = express.Router();


router.get("/all", viewAllTrainers);
router.post("/add", addTrainer);
router.put("/edit/:id", editTrainer);
router.delete("/delete/:id", deleteTrainer);

router.get("/trainer", verifyToken, getLoggedInTrainerDetails); // use middleware here


export default router;