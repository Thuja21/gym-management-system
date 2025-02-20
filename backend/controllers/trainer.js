import { db } from "../config/connectDatabase.js";
import bcrypt from "bcryptjs";

export const viewAllTrainers = (req, res) => {
    const q = `
        SELECT 
            tr.trainer_id,
            u.id AS user_id,
            u.user_name,
            u.full_name,
            u.email,
            u.contact_no,
            u.address,
            tr.specialization,
            tr.registered_date, 
            tr.dob,
            tr.age
        FROM
            trainers tr
        JOIN 
            users u 
        ON
            tr.user_id = u.id;
    `;

    console.log("###",q);
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("No trainers found!");

        res.status(200).json(data); // Return all trainers' details
    });
};

export const addTrainer = (req, res) => {
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

// export const editTrainer = async (req, res) => {
//     const trainerId = req.params.id;
//
//     console.log("Updating Member ID:", memberId);
//
//     if (!memberId) {
//         return res.status(400).json({ error: "Member ID is required." });
//     }
//
//     try {
//         // Validate if the member exists
//         const queryCheckMember = "SELECT user_id FROM gym_members WHERE member_id = ?";
//         const [result] = await db.promise().query(queryCheckMember, [memberId]);
//
//         if (result.length === 0) {
//             return res.status(404).json({ error: "Member not found." });
//         }
//
//         const userId = result[0].user_id;
//         console.log("Updating user ID:", userId);
//
//         await db.promise().beginTransaction();
//
//         // Update `gym_members` table
//         const queryUpdateMember = `
//             UPDATE gym_members
//             SET age = ?, gender = ?, height = ?, weight = ?, blood_group = ?,
//                 current_fitness_level = ?, fitness_goal = ?, health_issues = ?, plan_id = ?
//             WHERE member_id = ?
//         `;
//         const memberValues = [
//             req.body.age || null,
//             req.body.gender || null,
//             req.body.height || null,
//             req.body.weight || null,
//             req.body.blood_group || null,
//             req.body.current_fitness_level || null,
//             req.body.fitness_goal || null,
//             req.body.health_issues || null,
//             req.body.plan_id || null,
//             memberId,
//         ];
//         await db.promise().query(queryUpdateMember, memberValues);
//
//         //console.log("Received request body:", req.body);
//         //console.log("Fitness Goal:", req.body.fitness_goal);
//
//
//         // Update `users` table
//         const queryUpdateUser = `
//             UPDATE users
//             SET user_name = ?, full_name = ?, email = ?, contact_no = ?, address = ?
//             WHERE id = ?
//         `;
//         const userValues = [
//             req.body.user_name,
//             req.body.full_name,
//             req.body.email,
//             req.body.contact_no,
//             req.body.address,
//             req.body.user_id,
//         ];
//         await db.promise().query(queryUpdateUser, userValues);
//
//         await db.promise().commit();
//
//         res.status(200).json({ message: "Member details updated successfully." });
//
//         console.log("Fitness Goal:", req.body.fitness_goal);
//     } catch (error) {
//         console.error("Error updating member:", error);
//         await db.promise().rollback();
//         res.status(500).json({ error: "Internal Server Error. Please try again." });
//     }
// };
