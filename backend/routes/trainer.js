import express from "express";
import { viewAllTrainers } from "../controllers/trainer.js";
import {addMember, deleteMember, editMember} from "../controllers/member.js";

const router = express.Router();

router.get("/all", viewAllTrainers);

router.post("/add", addTrainer);

// Edit an existing member by ID
router.put("/edit/:id", editTrainer);


// Delete a member by ID
router.delete("/delete/:id", deleteTrainer);

export default router;