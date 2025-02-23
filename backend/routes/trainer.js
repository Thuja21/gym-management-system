import express from "express";
import { viewAllTrainers ,addTrainer, deleteTrainer, editTrainer} from "../controllers/trainer.js";
const router = express.Router();


router.get("/all", viewAllTrainers);
router.post("/add", addTrainer);
router.put("/edit/:id", editTrainer);
router.delete("/delete/:id", deleteTrainer);


export default router;