import express from "express";
import { viewAllMembers, addMember, editMember, deleteMember, getAllMembershipTypes } from "../controllers/member.js";

const router = express.Router();

router.get("/all", viewAllMembers);
router.get("/membership-types", getAllMembershipTypes);

router.post("/add", addMember);

// Edit an existing member by ID
router.put("/edit/:id", editMember);

// Delete a member by ID
router.delete("/delete/:id", deleteMember);

export default router;
