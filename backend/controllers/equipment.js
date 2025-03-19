import { db } from "../config/connectDatabase.js";


// export const viewAllEquipments =(req,res)=> {
//     res.json({
//         message: "Done",
//     })
// }

/*
export const viewAllEquipments =(req,res)=> {
    const q = "SELECT * FROM equipments";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);
    } )
}*/


export const viewAllEquipments =(req,res)=> {
    const q = "SELECT * FROM equipments";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}

// export const addEquipment = async (req, res) => {
//
//     db.beginTransaction((err) => {
//         const equipmentInsertQuery =
//             "INSERT INTO equipments(equipment_name, category, brand, quantity, purchase_date, price, status) VALUES (?) ";
//
//         const updateValues = [
//             req.body.equipment_name,
//             req.body.category,
//             req.body.brand,
//             req.body.quantity,
//             req.body.purchase_date,
//             req.body.price,
//             req.body.status,
//         ]
//
//         db.query(equipmentInsertQuery, [updateValues], (err, data) => {
//             if (err) {
//                 return db.rollback(() => {
//                     res.status(500).json(err);
//                 });
//             }
//         })
//         db.commit((err) => {
//             if (err) {
//                 return db.rollback(() => {
//                     res.status(500).json(err);
//                 });
//             }
//             res.status(200).json("Plan has been created.");
//         });
//     })
// }

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


// export const addEquipment = async (req, res) => {
//     const { equipment_name, category, brand, quantity, purchase_date, unit_price, status } = req.body;
//
//     // Validate input
//     if (!equipment_name || !category || !brand || !quantity || !purchase_date || !unit_price || !status) {
//         return res.status(400).json({ error: "All fields are required!" });
//     }
//
//     try {
//         // Check if the equipment already exists
//         const [existingEquipment] = await db.query(
//             "SELECT * FROM equipments WHERE equipment_name = ?",
//             [equipment_name]
//         );
//
//         if (existingEquipment.length > 0) {
//             // Equipment exists → Update existing row
//             const existing = existingEquipment[0];
//
//             await db.query(
//                 `UPDATE equipments
//                  SET category = ?, brand = ?, quantity = quantity + ?, purchase_date = ?, unit_price = ?, status = ?
//                  WHERE equipment_id = ?`,
//                 [category, brand, quantity, purchase_date, unit_price, status, existing.equipment_id]
//             );
//
//             return res.json({ message: "Equipment updated successfully!", equipment_id: existing.equipment_id });
//         } else {
//             // Equipment doesn't exist → Insert a new record
//             const [insertResult] = await db.query(
//                 `INSERT INTO equipments (equipment_name, category, brand, quantity, purchase_date, unit_price, status)
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
//                 [equipment_name, category, brand, quantity, purchase_date, unit_price, status]
//             );
//
//             return res.json({ message: "New equipment added!", equipment_id: insertResult.insertId });
//         }
//     } catch (error) {
//         console.error("Database error:", error);
//         return res.status(500).json({ error: "Database error!" });
//     }
// };

export const deleteEquipment = (req, res) => {
    console.log("Trainer ID received:", req.params.id); // Debugging
    const trainerId = req.params.id; // Get the trainer ID from the URL parameter
    console.log("Deleting trainer with ID:", trainerId);

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        // Step 1: Get the user_id from trainers table
        const getUserIdQuery = `SELECT user_id FROM trainers WHERE trainer_id = ?`;
        db.query(getUserIdQuery, [trainerId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }
            // Check if the trainer exists in trainers table
            if (result.length === 0) {
                return db.rollback(() => {
                    res.status(404).json("Trainer not found in trainers!");
                });
            }

            const userId = result[0].user_id; // Retrieve the user_id from the result

            // Step 2: Delete from trainers table
            const deleteTrainerQuery = `DELETE FROM trainers WHERE trainer_id = ?`;
            db.query(deleteTrainerQuery, [trainerId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                // Check if trainer exists
                if (result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(404).json("Trainer not found in trainers!");
                    });
                }

                // Step 3: Delete from users table using user_id from trainers
                const deleteUserQuery = `DELETE FROM users WHERE id = ?`;
                db.query(deleteUserQuery, [userId], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    // Check if user exists
                    if (result.affectedRows === 0) {
                        return db.rollback(() => {
                            res.status(404).json("User not found!");
                        });
                    }

                    // Commit the transaction if both deletions succeed
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        // Send success response
                        res.status(200).json("Trainer and associated user deleted successfully!");
                    });
                });
            });
        });
    });
};


export const editEquipment = async (req, res) => {
    const trainerId = req.params.id;

    console.log("Updating trainer ID:", trainerId);

    if (!trainerId) {
        return res.status(400).json({ error: "trainer ID is required." });
    }

    try {
        // Validate if the trainer exists
        const queryCheckTrainer = "SELECT user_id FROM trainers WHERE trainer_id = ?";
        const [result] = await db.promise().query(queryCheckTrainer, [trainerId]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Trainer not found." });
        }

        const userId = result[0].user_id;
        console.log("Updating user ID:", userId);

        await db.promise().beginTransaction();

        // Update `trainers` table
        const queryUpdateTrainer = `
            UPDATE trainers
            SET age = ?, specialization = ?
            WHERE trainer_id = ?
        `;
        const trainerValues = [
            req.body.age || undefined,
            req.body.specialization || undefined,
            trainerId,
        ];
        await db.promise().query(queryUpdateTrainer, trainerValues);

        //console.log("Received request body:", req.body);

        // Update `users` table
        const queryUpdateUser = `
            UPDATE users
            SET user_name = ?, full_name = ?, email = ?, contact_no = ?, address = ?
            WHERE id = ?
        `;
        const userValues = [
            req.body.user_name,
            req.body.full_name,
            req.body.email,
            req.body.contact_no,
            req.body.address,
            req.body.user_id,
        ];
        await db.promise().query(queryUpdateUser, userValues);

        await db.promise().commit();

        res.status(200).json({ message: "Trainer details updated successfully." });

    } catch (error) {
        console.error("Error updating trainer:", error);
        await db.promise().rollback();
        res.status(500).json({ error: "Internal Server Error. Please try again." });
    }
};

