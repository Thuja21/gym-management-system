import {db} from "../config/connectDatabase.js";
import express from 'express';

export const viewAllReservations = (req, res) => {
    const userId = req.user.id;
    // const q = "SELECT * FROM reservations WHERE user_id = ?";
    const q = "SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC";
    db.query(q, userId, (err, data) => {
        if (err) return res.status(500).send(err.message);

        return res.status(200).send(data);
    })
}

export const addReservation = (req, res) => {
    const userId = req.user.id;
    console.log("User ID:", userId);
    const { supplementId, quantity, status, reservationDate, expiryDate, totalPrice } = req.body;

    if (!userId || !supplementId || !quantity || !totalPrice) {
        return res.status(400).send("Missing required fields");
    }

    const formatDateForMySQL = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const formattedReservationDate = formatDateForMySQL(reservationDate) ||
        formatDateForMySQL(new Date().toISOString());

    const formattedExpiryDate = formatDateForMySQL(expiryDate) ||
        formatDateForMySQL(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

    const q = `
        INSERT INTO reservations 
        (user_id, supplement_id, quantity, status, reservation_date, expiry_date, total_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        userId,
        supplementId,
        quantity,
        status || 'pending',
        formattedReservationDate,
        formattedExpiryDate,
        totalPrice
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).send(err.message);

        // After inserting reservation, update the supplement stock and reservation_quantity
        const updateSupplementQuery = `
            UPDATE supplements 
            SET 
                quantity_in_stock = quantity_in_stock - ?, 
                reservation_quantity = reservation_quantity + ? 
            WHERE supplement_id = ? AND quantity_in_stock >= ?
        `;

        db.query(updateSupplementQuery, [quantity, quantity, supplementId, quantity], (updateErr, updateData) => {
            if (updateErr) {
                return res.status(500).send("Reservation created but failed to update supplement: " + updateErr.message);
            }

            if (updateData.affectedRows === 0) {
                return res.status(400).send("Not enough stock to reserve the requested quantity");
            }

            return res.status(201).json({
                message: "Reservation created successfully",
                reservationId: data.insertId
            });
        });
    });
};

export const cancelReservation = (req, res) => {
    const reservationId = req.params.id;
    const userId = req.user.id;

    if (!reservationId) {
        return res.status(400).json({ error: "Reservation ID is required" });
    }

    const checkQuery = "SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ?";

    db.query(checkQuery, [reservationId, userId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "Reservation not found or you don't have permission to cancel it" });
        }

        const reservation = data[0];

        if (reservation.status === 'cancelled') {
            return res.status(400).json({ error: "This reservation is already cancelled" });
        }

        if (reservation.status === 'collected') {
            return res.status(400).json({ error: "Cannot cancel a collected reservation" });
        }

        const updateQuery = "UPDATE reservations SET status = 'cancelled' WHERE reservation_id = ?";

        db.query(updateQuery, [reservationId], (updateErr, updateData) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }

            if (updateData.affectedRows === 0) {
                return res.status(500).json({ error: "Failed to cancel reservation" });
            }

            // Now update the supplement quantities
            const updateSupplementQuery = `
                UPDATE supplements
                SET 
                    quantity_in_stock = quantity_in_stock + ?, 
                    reservation_quantity = reservation_quantity - ?
                WHERE supplement_id = ?
            `;

            db.query(updateSupplementQuery, [reservation.quantity, reservation.quantity, reservation.supplement_id], (suppErr) => {
                if (suppErr) {
                    return res.status(500).json({ error: "Cancelled, but failed to update supplement: " + suppErr.message });
                }

                return res.status(200).json({
                    message: "Reservation cancelled and supplement stock updated successfully",
                    reservationId: reservationId
                });
            });
        });
    });
};

export const updateReservationStatus = (req, res) => {
    const reservationId = req.params.id;
    const userId = req.user.id;

    if (!reservationId) {
        return res.status(400).json({ error: "Reservation ID is required" });
    }

    const checkQuery = "SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ?";

    db.query(checkQuery, [reservationId, userId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "Reservation not found or you don't have permission to update it" });
        }

        const reservation = data[0];

        if (reservation.status === 'expired') {
            return res.status(400).json({ error: "This reservation is already expired" });
        }

        if (reservation.status === 'collected') {
            return res.status(400).json({ error: "Cannot expire a collected reservation" });
        }

        const updateQuery = "UPDATE reservations SET status = 'expired' WHERE reservation_id = ?";

        db.query(updateQuery, [reservationId], (updateErr, updateData) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }

            if (updateData.affectedRows === 0) {
                return res.status(500).json({ error: "Failed to mark reservation as expired" });
            }

            // Update supplement quantities
            const updateSupplementQuery = `
                UPDATE supplements
                SET 
                    quantity_in_stock = quantity_in_stock + ?, 
                    reservation_quantity = reservation_quantity - ?
                WHERE supplement_id = ?
            `;

            db.query(updateSupplementQuery, [reservation.quantity, reservation.quantity, reservation.supplement_id], (suppErr) => {
                if (suppErr) {
                    return res.status(500).json({ error: "Reservation expired, but failed to update supplement: " + suppErr.message });
                }

                return res.status(200).json({
                    message: "Reservation marked as expired and supplement stock updated",
                    reservationId: reservationId
                });
            });
        });
    });
};

export const viewAllReservationsAdminView = (req, res) => {
    const q = `
        SELECT r.*,
               u.full_name,
               s.supplement_name
        FROM reservations r
                 INNER JOIN users u ON r.user_id = u.id
                 INNER JOIN supplements s ON r.supplement_id = s.supplement_id
        ORDER BY r.reservation_date DESC
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err.message);

        return res.status(200).send(data);
    });
};


export const deleteReservation = (req, res) => {
    const reservationId = req.params.id;
    console.log("Deleting Reservation ID:", reservationId);

    // First, get the reservation details to know which supplement and quantity to update
    const getReservationQuery = "SELECT supplement_id, quantity, status FROM reservations WHERE reservation_id = ?";

    db.query(getReservationQuery, [reservationId], (err, reservationData) => {
        if (err) {
            console.error("Error fetching reservation details:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (reservationData.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        const reservation = reservationData[0];

        // Begin transaction to ensure data consistency
        db.beginTransaction(err => {
            if (err) {
                console.error("Error starting transaction:", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            // Delete the reservation
            const deleteQuery = "DELETE FROM reservations WHERE reservation_id = ?";

            db.query(deleteQuery, [reservationId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Error deleting reservation:", err);
                        res.status(500).json({ message: "Internal server error" });
                    });
                }

                if (result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ message: "Reservation not found" });
                    });
                }

                // If reservation was pending, update supplement quantities
                if (reservation.status === 'pending') {
                    const updateSupplementQuery = `
                        UPDATE supplements 
                        SET 
                            quantity_in_stock = quantity_in_stock + ?,
                            reservation_quantity = reservation_quantity - ?
                        WHERE supplement_id = ?
                    `;

                    db.query(updateSupplementQuery, [
                        reservation.quantity,
                        reservation.quantity,
                        reservation.supplement_id
                    ], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Error updating supplement quantities:", err);
                                res.status(500).json({ message: "Failed to update supplement quantities" });
                            });
                        }

                        // Commit the transaction
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Error committing transaction:", err);
                                    res.status(500).json({ message: "Failed to complete operation" });
                                });
                            }

                            res.status(200).json({
                                message: "Reservation deleted successfully and supplement quantities updated!"
                            });
                        });
                    });
                } else {
                    // If reservation was not pending, just commit the deletion
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Error committing transaction:", err);
                                res.status(500).json({ message: "Failed to complete operation" });
                            });
                        }

                        res.status(200).json({ message: "Reservation deleted successfully!" });
                    });
                }
            });
        });
    });
};

export const updateReservationStatusByAdmin = (req, res) => {
    const reservationId = req.params.id;
    const { status } = req.body;

    // Validate that reservation ID exists
    if (!reservationId) {
        return res.status(400).json({ error: "Reservation ID is required" });
    }

    // First, check if the reservation exists
    const checkQuery = "SELECT * FROM reservations WHERE reservation_id = ?";

    db.query(checkQuery, [reservationId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        const reservation = data[0];
        const oldStatus = reservation.status;
        const supplementId = reservation.supplement_id;
        const quantity = reservation.quantity;
        const totalPrice = reservation.total_price;
        const userId = reservation.user_id;

        // Check if the reservation is already in the requested status
        if (oldStatus === status) {
            return res.status(400).json({ error: "This reservation is already changed to this status" });
        }

        // Start a transaction to ensure data consistency
        db.beginTransaction(err => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Update the reservation status
            const updateQuery = "UPDATE reservations SET status = ? WHERE reservation_id = ?";

            db.query(updateQuery, [status, reservationId], (updateErr, updateData) => {
                if (updateErr) {
                    return db.rollback(() => {
                        res.status(500).json({ error: updateErr.message });
                    });
                }

                if (updateData.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(500).json({ error: "Failed to change the status of the reservation" });
                    });
                }

                // Only update supplement quantities if changing from pending status
                if (oldStatus === 'pending') {
                    let updateSupplementQuery;
                    let queryParams;

                    if (status === 'collected') {
                        // For collected: Only reduce reservation_quantity
                        updateSupplementQuery = `
                            UPDATE supplements 
                            SET reservation_quantity = reservation_quantity - ?
                            WHERE supplement_id = ?
                        `;
                        queryParams = [quantity, supplementId];

                        // Add payment data to payment_table
                        const paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        const paymentId = 'PAY-' + Math.random().toString(36).slice(2, 8).toUpperCase();

                        const insertPaymentQuery = `
                            INSERT INTO supplement_payments (
                                payment_id,                             
                                user_id, 
                                amount, 
                                purchased_quantity,
                                payment_date, 
                                supplement_id,
                                payment_method
                            ) VALUES (?, ?, ?, ? ,?, ?, 'Cash')
                        `;

                        db.query(insertPaymentQuery, [paymentId, userId, totalPrice, quantity, paymentDate, supplementId], (paymentErr) => {
                            console.log("userId", userId);
                            console.log("totalPrice", totalPrice);
                            console.log("paymentDate", paymentDate);
                            console.log("supplementId", supplementId);
                            console.log("quant", quantity);

                            if (paymentErr) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: "Failed to add payment data: " + paymentErr.message });
                                });
                            }

                            // Execute the supplement update query
                            db.query(updateSupplementQuery, queryParams, (suppErr) => {
                                if (suppErr) {
                                    return db.rollback(() => {
                                        res.status(500).json({ error: "Reservation status updated, but failed to update supplement quantities: " + suppErr.message });
                                    });
                                }

                                // Commit the transaction
                                db.commit(err => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({ error: err.message });
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "Reservation status updated, supplement quantities updated, and payment recorded successfully",
                                        reservationId: reservationId
                                    });
                                });
                            });
                        });
                    } else if (status === 'cancelled') {
                        // For cancelled: Reduce reservation_quantity AND increase quantity_in_stock
                        updateSupplementQuery = `
                            UPDATE supplements 
                            SET 
                                reservation_quantity = reservation_quantity - ?,
                                quantity_in_stock = quantity_in_stock + ?
                            WHERE supplement_id = ?
                        `;
                        queryParams = [quantity, quantity, supplementId];

                        // Execute the supplement update query
                        db.query(updateSupplementQuery, queryParams, (suppErr) => {
                            if (suppErr) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: "Reservation status updated, but failed to update supplement quantities: " + suppErr.message });
                                });
                            }

                            // Commit the transaction
                            db.commit(err => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ error: err.message });
                                    });
                                }
                                return res.status(200).json({
                                    message: "Reservation status and supplement quantities updated successfully",
                                    reservationId: reservationId
                                });
                            });
                        });
                    } else {
                        // If status is something else, just commit the transaction
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err.message });
                                });
                            }
                            return res.status(200).json({
                                message: "Reservation status updated successfully",
                                reservationId: reservationId
                            });
                        });
                    }
                } else {
                    // If not changing from pending status, just commit the transaction
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err.message });
                            });
                        }
                        return res.status(200).json({
                            message: "Reservation status updated successfully",
                            reservationId: reservationId
                        });
                    });
                }
            });
        });
    });
};

