import { db } from "../config/connectDatabase.js";

export const viewAllEquipments =(req,res)=> {
    const q = "SELECT * FROM equipments";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}

export const addEquipment = async (req, res) => {
    const { equipment_name, category, brand, quantity, purchase_date, unit_price, status } = req.body;

    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(500).json({ error: "Transaction error!" });
            }

            // Check if the equipment already exists
            const [existingEquipment] = await db.promise().query(
                "SELECT * FROM equipments WHERE equipment_name = ?",
                [equipment_name]
            );

            let equipmentId;

            if (existingEquipment.length > 0) {
                // Equipment exists → Update quantity & category
                equipmentId = existingEquipment[0].equipment_id;

                await db.promise().query(
                    `UPDATE equipments 
                     SET category = ?, brand = ?, quantity = quantity + ?, status = ? 
                     WHERE equipment_id = ?`,
                    [category, brand, quantity, status, equipmentId]
                );
            } else {
                // Equipment doesn't exist → Insert new row
                const [insertResult] = await db.promise().query(
                    `INSERT INTO equipments (equipment_name, category, brand, quantity, status) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [equipment_name, category, brand, quantity, status]
                );

                equipmentId = insertResult.insertId;
            }

            // Insert into purchase history table
            await db.promise().query(
                `INSERT INTO equipment_purchases (equipment_id, purchase_date, unit_price, quantity) 
                 VALUES (?, ?, ?, ?)`,
                [equipmentId, purchase_date, unit_price, quantity]
            );

            db.commit((commitErr) => {
                if (commitErr) {
                    return db.rollback(() => {
                        res.status(500).json({ error: "Transaction commit failed!" });
                    });
                }
                res.status(200).json({ message: "Equipment added/updated successfully!", equipment_id: equipmentId });
            });
        });
    } catch (error) {
        db.rollback(() => {
            console.error("Database error:", error);
            res.status(500).json({ error: "Database error!" });
        });
    }
};



export const editEquipment = async (req, res) => {
    const equipmentId = req.params.id;
    console.log("Updating schedule ID:", equipmentId);

    try {
        const query = "UPDATE equipments SET plan_name = ?, plan_price = ?, plan_duration = ?, features = ? WHERE plan_id = ?";

        const updateValues = [
            req.body.plan_name,
            req.body.plan_price ,
            req.body.plan_duration,
            req.body.features,
            planId
        ];
        console.log(updateValues);

        await db.promise().query(query, updateValues);
        res.status(200).json({ message: "Plans details updated successfully." });

    } catch (error) {
        console.error("Error updating plan:", error);
        await db.promise().rollback();
        res.status(500).json({ error: "Internal Server Error. Please try again." });
    }
};



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

