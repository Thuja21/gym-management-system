import { db } from "../config/connectDatabase.js";
import bcrypt from "bcryptjs";

export const viewAllMembers = (req, res) => {
    const q = `
        SELECT 
            gm.member_id,
            u.id AS user_id,
            u.user_name,
            u.full_name,
            u.email,
            u.contact_no,
            u.address,
            gm.age,
            gm.dob,
            gm.gender,
            gm.height,
            gm.weight,
            gm.blood_group,
            gm.current_fitness_level,
            gm.fitness_goal,
            p.plan_name,
            p.plan_id,
            gm.schedule_id,
            gm.health_issues,
            gm.registered_date,
            gm.status
        FROM 
            gym_members gm
        JOIN 
            users u 
        ON 
            gm.user_id = u.id
        LEFT JOIN
            plans p
            ON
                gm.plan_id = p.plan_id;
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("No members found!");

        res.status(200).json(data); // Return all members' details
    });
};

export const addMember = (req, res) => {
    const q = "SELECT * FROM users WHERE user_name = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Member already exists!");

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
                "MEMBER",
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
                    "INSERT INTO gym_members (`user_id`, `age`, `gender`, `dob`, `status`,`registered_date`, `height`, `weight`, `blood_group`, `current_fitness_level`, `fitness_goal`, `health_issues`, `plan_id`) VALUES (?)";
                const subTableValues = [result.insertId, req.body.age, req.body.gender, req.body.dob, 1, new Date(), req.body.height, req.body.weight, req.body.bloodGroup, req.body.currentFitnessLevel, req.body.fitnessGoal, req.body.healthIssues, req.body.plan_id];

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
                        res.status(200).json("Member has been created.");
                    });
                });
            });
        });
    });
}

export const editMember = async (req, res) => {
    const memberId = req.params.id;

    console.log("Updating Member ID:", memberId);

    if (!memberId) {
        return res.status(400).json({ error: "Member ID is required." });
    }

    try {
        // Validate if the member exists
        const queryCheckMember = "SELECT user_id FROM gym_members WHERE member_id = ?";
        const [result] = await db.promise().query(queryCheckMember, [memberId]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Member not found." });
        }

        const userId = result[0].user_id;
        console.log("Updating user ID:", userId);

        await db.promise().beginTransaction();

        // Update `gym_members` table
        const queryUpdateMember = `
            UPDATE gym_members
            SET age = ?, gender = ?, height = ?, weight = ?, blood_group = ?,
                current_fitness_level = ?, fitness_goal = ?, health_issues = ?, plan_id = ?
            WHERE member_id = ?
        `;
        const memberValues = [
            req.body.age || null,
            req.body.gender || null,
            req.body.height || null,
            req.body.weight || null,
            req.body.blood_group || null,
            req.body.current_fitness_level || null,
            req.body.fitness_goal || null,
            req.body.health_issues || null,
            req.body.plan_id || null,
            memberId,
        ];
        await db.promise().query(queryUpdateMember, memberValues);

        //console.log("Received request body:", req.body);
        //console.log("Fitness Goal:", req.body.fitness_goal);


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

        res.status(200).json({ message: "Member details updated successfully." });

        console.log("Fitness Goal:", req.body.fitness_goal);
    } catch (error) {
        console.error("Error updating member:", error);
        await db.promise().rollback();
        res.status(500).json({ error: "Internal Server Error. Please try again." });
    }
};



    //     try {
    //         // Validate if the user exists
    //         const queryCheckMember = "SELECT * FROM users WHERE user_id = ?";
    //         const [member] = await db.promise().query(queryCheckMember, [memberId]);
    //
    //         if (member.length === 0) {
    //             return res.status(404).json({ error: "Member not found." });
    //         }
    //
    //         // Start MySQL transaction
    //         await db.promise().beginTransaction();
    //
    //         //  First, update `gym_members` table
    //         const queryUpdateMember = `
    //         UPDATE gym_members
    //         SET age = ?, gender = ?, dob = ?, height = ?, weight = ?, blood_group = ?,
    //             current_fitness_level = ?, fitness_goal = ?, health_issues = ?, plan_id = ?
    //         WHERE user_id = ?
    //     `;
    //         const memberValues = [
    //             req.body.age,
    //             req.body.gender,
    //             req.body.dob,
    //             req.body.height,
    //             req.body.weight,
    //             req.body.bloodGroup,
    //             req.body.currentFitnessLevel,
    //             req.body.fitnessGoal,
    //             req.body.healthIssues,
    //             req.body.plan_id,
    //             memberId,
    //         ];
    //         await db.promise().query(queryUpdateMember, memberValues);
    //
    //         // 2️⃣ Then, update `users` table
    //         const queryUpdateUser = `
    //         UPDATE users
    //         SET user_name = ?, full_name = ?, email = ?, contact_no = ?, address = ?
    //         WHERE user_id = ?
    //     `;
    //         const userValues = [
    //             req.body.username,
    //             req.body.fullname,
    //             req.body.email,
    //             req.body.contactNo,
    //             req.body.address,
    //             memberId,
    //         ];
    //         await db.promise().query(queryUpdateUser, userValues);
    //
    //         // Commit transaction
    //         await db.promise().commit();
    //
    //         res.status(200).json({ message: "Member details updated successfully." });
    //     } catch (error) {
    //         console.error("Error updating member:", error);
    //
    //         // Rollback transaction in case of an error
    //         await db.promise().rollback();
    //
    //         res.status(500).json({ error: "Internal Server Error. Please try again." });
    //     }
    // };



    export const getAllMembershipTypes = async (req, res) => {
    try {
        const q = "SELECT plan_id, plan_name FROM plans";

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json("No members found!");

            res.status(200).json(data);
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error fetching membership types:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const deleteMember = (req, res) => {
    const memberId = req.params.id; // Get the member ID from the URL parameter

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        // Step 1: Get the user_id from gym_members table
        const getUserIdQuery = `SELECT user_id FROM gym_members WHERE member_id = ?`;
        db.query(getUserIdQuery, [memberId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }

            // Check if the member exists in gym_members table
            if (result.length === 0) {
                return db.rollback(() => {
                    res.status(404).json("Member not found in gym_members!");
                });
            }

            const userId = result[0].user_id; // Retrieve the user_id from the result

            // Step 2: Delete from gym_members table
            const deleteGymMemberQuery = `DELETE FROM gym_members WHERE member_id = ?`;
            db.query(deleteGymMemberQuery, [memberId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                // Check if gym member exists
                if (result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(404).json("Member not found in gym_members!");
                    });
                }

                // Step 3: Delete from users table using user_id from gym_members
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
                        res.status(200).json("Member and associated user deleted successfully!");
                    });
                });
            });
        });
    });
};


