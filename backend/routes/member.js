import express from "express";
import { viewAllMembers, addMember, editMember, deleteMember, getAllMembershipTypes, getLoggedInMemberDetails} from "../controllers/member.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/all", viewAllMembers);
router.get("/plans", getAllMembershipTypes);

router.post("/add", addMember);

// Edit an existing member by ID
router.put("/edit/:id", editMember);


// Delete a member by ID
router.delete("/delete/:id", deleteMember);

router.get("/member", verifyToken, getLoggedInMemberDetails); // use middleware here


export default router;
