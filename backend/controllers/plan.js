import {db} from "../config/connectDatabase.js";
import Op from "sequelize";

export const viewAllPlans = async (req, res) => {
    try {
        const q = "SELECT * FROM plans";

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json("No plans found!");

            res.status(200).json(data);
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error fetching data:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const addPlan = async (req, res) => {
    const q = "SELECT * FROM plans WHERE plan_name= ?";

    db.query(q, [req.body.plan_name], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Plan already exists!");
    })

    db.beginTransaction((err) => {
        const planInsertQuery =
            "INSERT INTO plans(plan_name, plan_duration, plan_price, features) VALUES (?) ";

        const updateValues = [
            req.body.plan_name ,
            req.body.plan_duration,
            req.body.plan_price ,
            req.body.features ,
        ]

        db.query(planInsertQuery, [updateValues], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }
        })
        db.commit((err) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }
            res.status(200).json("Plan has been created.");
        });
    })
}

export const editPlan = async (req, res) => {
    const planId = req.params.id;
    console.log("Updating plan ID:", planId);

    try {
        const query = "UPDATE plans SET plan_name = ?, plan_price = ?, plan_duration = ?, features = ? WHERE plan_id = ?";

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

export const deletePlan = (req, res) => {
    const planId = req.params.id;
    console.log("Updating plan ID:", planId);

    // Check if the plan ID is provided
    if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
    }

    // Delete query
    const deleteQuery = "DELETE FROM plans WHERE plan_id = ?";

    db.query(deleteQuery, [planId], (err, result) => {
        if (err) {
            console.error("Error deleting plan:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Plan not found" });
        }

        res.status(200).json({ message: "Plan deleted successfully!" });
    });
};

export const getLoggedInMemberPlan= (req, res) => {
    const memberId = req.user.member_id;

    const q = `
    SELECT plans.*
    FROM plans
    JOIN gym_members ON gym_members.plan_id = plans.plan_id
    WHERE gym_members.member_id = ?
  `;


    db.query(q, [memberId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching plan", details: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "No plan found" });
        }

        return res.status(200).json(data);
    });
};

export const updatePlan = async (req, res) => {
    const memberId = req.user.member_id;
    const { plan_id } = req.body;

    try {
        const query = "UPDATE gym_members SET plan_id = ? WHERE member_id = ?";
        await db.promise().query(query, [plan_id, memberId]);

        res.status(200).json({ message: "Member's plan updated successfully." });
    } catch (error) {
        console.error("Error updating plan:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


