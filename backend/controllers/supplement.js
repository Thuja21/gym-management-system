import {db} from "../config/connectDatabase.js";
import express from "express";

export const viewAllSupplements = (req, res) => {
    const q = "SELECT * FROM supplements";
    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err.message);

        return res.status(200).send(data);
    })
}

export const editSupplement = async (req, res) => {
    const supplementId = req.params.id;
    console.log("Updating supplement ID:", supplementId);

    const expiryDate = new Date(req.body.expiry_date).toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'

    const q = `
        UPDATE supplements 
        SET supplement_name = ?, description = ?, price = ?, quantity_in_stock = ?, 
            expiry_date = ?, category = ?, image_url = ?, size = ?, brand = ? 
        WHERE supplement_id = ?`; // Assuming 'id' is the primary key of the supplement

    const values = [
        req.body.supplement_name,
        req.body.description,
        req.body.price,
        req.body.quantity_in_stock,
        expiryDate,
        req.body.category,
        req.body.image_url,
        req.body.size,
        req.body.brand,
        supplementId
    ];
    db.query(q, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Supplement has been updated.");
    });
};


export const deleteSupplement = (req, res) => {
    const supplementId = req.params.id;
    console.log("Updating supplement ID:", supplementId);

    const deleteQuery = "DELETE FROM supplements WHERE supplement_id = ?";

    db.query(deleteQuery, [supplementId], (err, result) => {
        if (err) {
            console.error("Error deleting supplement:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Supplement not found" });
        }

        res.status(200).json({ message: "Supplement deleted successfully!" });
    });
};



