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
                gm.plan_id = p.plan_id
        WHERE
            gm.is_deleted = 0 AND u.is_deleted = 0;
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("No members found!");

        res.status(200).json(data); // Return all members' details
    });
};

export const addMember = (req, res) => {
    const q = "SELECT * FROM users WHERE user_name = ? AND is_deleted = 0";

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
                "INSERT INTO users (`user_name`,`full_name`,`password`, `email`, `contact_no`, `user_type`, `address`, `is_deleted`) VALUES (?)";
            const userValues = [
                req.body.username,
                req.body.fullname,
                hashedPassword,
                req.body.email,
                req.body.contactNo,
                "MEMBER",
                req.body.address,
                0,
            ];

            db.query(userInsertQuery, [userValues], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                const userId = result.insertId;

                // Insert into gym_members table
                const subTableInsertQuery =
                    "INSERT INTO gym_members (`user_id`, `age`, `gender`, `dob`, `status`, `registered_date`, `height`, `weight`, `blood_group`, `current_fitness_level`, `fitness_goal`, `health_issues`, `plan_id`, `is_deleted`) VALUES (?)";
                const subTableValues = [
                    userId,
                    req.body.age,
                    req.body.gender,
                    req.body.dob,
                    1,
                    new Date(),
                    req.body.height,
                    req.body.weight,
                    req.body.bloodGroup,
                    req.body.currentFitnessLevel,
                    req.body.fitnessGoal,
                    req.body.healthIssues,
                    req.body.plan_id,
                    0,
                ];

                db.query(subTableInsertQuery, [subTableValues], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    const memberId = result.insertId;
                    const paymentId = 'PAY-' + Math.random().toString(36).slice(2, 8).toUpperCase();

                    // Insert into plan_payments table
                    const paymentInsertQuery =
                        "INSERT INTO plan_payments (`payment_id`, `member_id`, `plan_id`, `amount`, `payment_date`, `status`,payment_method) VALUES (?)";
                    const paymentValues = [
                        paymentId,
                        memberId,
                        req.body.plan_id,
                        req.body.payment.amount,
                        new Date(),
                        "paid", // Adjust based on your payment status logic
                        req.body.payment.paymentMethod
                    ];

                    db.query(paymentInsertQuery, [paymentValues], (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        // Commit the transaction if all queries succeed
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json(err);
                                });
                            }

                            // Send success response
                            res.status(200).json("Member and payment have been created.");
                        });
                    });
                });
            });
        });
    });
};

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


    export const getAllMembershipTypes = async (req, res) => {
    try {
        const q = "SELECT plan_id, plan_name, features, plan_price, plan_duration FROM plans WHERE is_deleted = 0";

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
        const getUserIdQuery = `SELECT user_id FROM gym_members WHERE member_id = ? AND is_deleted = 0`;
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
            const softDeleteGymMember = `UPDATE gym_members SET is_deleted = 1 WHERE member_id = ?`;
            db.query(softDeleteGymMember, [memberId], (err, result) => {
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
                const softDeleteUser = `UPDATE users SET is_deleted = 1 WHERE id = ?`;
                db.query(softDeleteUser, [userId], (err, result) => {
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
                        res.status(200).json("Member soft-deleted successfully!");
                    });
                });
            });
        });
    });
};

export const getLoggedInMemberDetails = (req, res) => {
    const memberId = req.user.member_id;

    const q = `
    SELECT gym_members.*, users.*, plans.*
    FROM plans
    JOIN gym_members ON plans.plan_id = gym_members.plan_id
    JOIN users ON users.id = gym_members.user_id
    WHERE gym_members.member_id = ?
  `;


    db.query(q, [memberId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching details", details: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "No member found" });
        }

        return res.status(200).json(data);
    });
};