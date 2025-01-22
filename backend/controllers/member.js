import { db } from "../config/connectDatabase.js";

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
            gm.gender,
            gm.height,
            gm.weight,
            gm.blood_group,
            gm.current_fitness_level,
            gm.fitness_goal,
            gm.plan_id,
            gm.schedule_id,
            gm.health_issues
        FROM 
            gym_members gm
        JOIN 
            users u 
        ON 
            gm.user_id = u.id;
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("No members found!");

        res.status(200).json(data); // Return all members' details
    });
};



export const addMember = (req, res) => {

}

export const editMember = (req, res) => {

}

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

        // Delete from gym_members table
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

            // Delete from users table
            const deleteUserQuery = `DELETE FROM users WHERE id = ?`;
            db.query(deleteUserQuery, [memberId], (err, result) => {
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
};


