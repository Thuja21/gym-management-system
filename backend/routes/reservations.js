import express from "express";
import {
    viewAllReservations,
    addReservation,
    cancelReservation,
    deleteReservation,
    viewAllReservationsAdminView,
    updateReservationStatus,
    updateReservationStatusByAdmin
} from "../controllers/reservation.js";
import {verifyToken} from "../middleware/verifyToken.js";
const router = express.Router();

// Routes for reservations
router.get("/all", verifyToken, viewAllReservations);
router.post("/add", verifyToken, addReservation);
router.put("/cancel/:id", verifyToken, cancelReservation);
router.put("/status/:id", verifyToken, updateReservationStatus);

// Admin routes
router.get("/viewall",  viewAllReservationsAdminView);
router.delete("/:id", deleteReservation);
router.post("/update-status/:id", updateReservationStatusByAdmin);

export default router;
