import { db } from "../config/connectDatabase.js";

export const viewAllEquipments =(req,res)=> {
    const q = `
            SELECT equipment_variants.*, equipments.*
            FROM equipments
            JOIN equipment_variants ON equipment_variants.equipment_id = equipments.equipment_id`;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}

export const deleteEquipment = (req, res) => {
    const equipmentId = req.params.id;
    console.log("Updating equipment ID:", equipmentId);

    // Delete query
    const deleteQuery = "DELETE FROM equipments WHERE equipment_id = ?";

    db.query(deleteQuery, [equipmentId], (err, result) => {
        if (err) {
            console.error("Error deleting equipment:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        res.status(200).json({ message: "Equipment deleted successfully!" });
    });
};

export const addEquipmentVariants = (req, res) => {
    const { equipment_name, category, brand, quantity, purchase_date, price, status } = req.body;

    if (!equipment_name || !category || !brand || !quantity || !purchase_date || !price || !status) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check if equipment already exists
    const checkEquipmentExists = `
        SELECT equipment_id FROM equipments
        WHERE equipment_name = ? AND category = ?
    `;

    db.query(checkEquipmentExists, [equipment_name, category], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking equipment existence', error: err });
        }

        if (result.length > 0) {
            // Equipment exists
            const equipment_id = result[0].equipment_id;
            insertVariants(equipment_id);
        } else {
            // Insert new equipment
            const insertEquipment = `
                INSERT INTO equipments (equipment_name, category, total_quantity)
                VALUES (?, ?, 0)
            `;

            db.query(insertEquipment, [equipment_name, category], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error inserting equipment', error: err });
                }

                const equipment_id = result.insertId;
                insertVariants(equipment_id);
            });
        }

        function insertVariants(equipment_id) {
            const insertVariant = `
                INSERT INTO equipment_variants (equipment_id, brand, quantity, purchase_date, price, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            let count = 0;

            for (let i = 0; i < quantity; i++) {
                db.query(insertVariant, [equipment_id, brand, 1, purchase_date, price, status], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error inserting variants', error: err });
                    }

                    count++;

                    if (count === quantity) {
                        // After inserting all variants, update equipment total_quantity
                        const updateEquipmentQuantity = `
                            UPDATE equipments
                            SET total_quantity = total_quantity + ?
                            WHERE equipment_id = ?
                        `;

                        db.query(updateEquipmentQuantity, [quantity, equipment_id], (err, result) => {
                            if (err) {
                                return res.status(500).json({ message: 'Error updating total quantity', error: err });
                            }

                            return res.status(201).json({ message: 'Equipment and variants added successfully' });
                        });
                    }
                });
            }
        }
    });
};

// Update equipment item
export const updateEquipmentItem = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(req.params);
    console.log(req.body);


    // Validate input
    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'Status is required'
        });
    }

    const updateQuery = `
        UPDATE equipment_variants
        SET status = ?
        WHERE variant_id = ?
    `;

    db.query(updateQuery, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating equipment item:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error updating equipment item',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipment item not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Equipment item updated successfully',
            data: {
                variant_id: id,
                status
            }
        });
    });
};

// In controllers/equipmentController.js
export const deleteEquipmentItem = (req, res) => {
    const variantId = req.params.variantId;
    console.log("Deleting equipment variant ID:", variantId);

    // Step 1: Get the current quantity
    const selectQuery = 'SELECT * FROM equipment_variants WHERE variant_id = ?';

    db.query(selectQuery, [variantId], (selectErr, selectResult) => {
        if (selectErr) {
            console.error("Error fetching equipment variant:", selectErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (!selectResult || selectResult.length === 0) {
            return res.status(404).json({ message: "Equipment item not found" });
        }

        const currentQuantity = selectResult[0].quantity;

        if (currentQuantity > 1) {
            // Step 2a: Decrease quantity
            const updateQuery = 'UPDATE equipment_variants SET quantity = quantity - 1 WHERE variant_id = ?';
            db.query(updateQuery, [variantId], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("Error updating equipment quantity:", updateErr);
                    return res.status(500).json({ message: "Internal server error" });
                }
                res.status(200).json({ message: "Equipment quantity decreased by 1" });
            });
        } else {
            // Step 2b: Delete the variant
            const deleteQuery = 'DELETE FROM equipment_variants WHERE variant_id = ?';
            db.query(deleteQuery, [variantId], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error("Error deleting equipment variant:", deleteErr);
                    return res.status(500).json({ message: "Internal server error" });
                }
                res.status(200).json({ message: "Equipment variant deleted successfully" });
            });
        }
    });
};
