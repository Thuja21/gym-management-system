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


export const addEquipment = (req, res) => {
    const q = "SELECT * FROM users WHERE user_name = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Trainer already exists!");

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // Start transaction
        db.beginTransaction((err) => {
            if (err) return res.status(500).json(err);

            // Insert into users table
            const userInsertQuery =
                "INSERT INTO users (`user_name`,`full_name`,`password`, `email`,  `contact_no`, `user_type` , `address` ) VALUES (?)";
            const userValues = [
                req.body.username,
                req.body.fullname,
                hashedPassword,
                req.body.email,
                req.body.contactNo,
                "TRAINER",
                req.body.address,
            ];

            db.query(userInsertQuery, [userValues], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }


                console.log("##33",req.body);

                const subTableInsertQuery =
                    "INSERT INTO trainers (`user_id`, `dob`, `age`, `specialization`,`registered_date` ) VALUES (?)";
                const subTableValues = [result.insertId,req.body.dob, req.body.age, req.body.specialization, new Date()];

                db.query(subTableInsertQuery, [subTableValues], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    // Commit the transaction if both queries succeed
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        // Send success response
                        res.status(200).json("Trainer has been created.");
                    });
                });
            });
        });
    });
}

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

