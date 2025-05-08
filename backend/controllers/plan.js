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

// export const updatePlanWithPayment = async (req, res) => {
//     const memberId = req.user.member_id;
//     const { plan_id } = req.body;
//
//     try {
//         const query = "UPDATE gym_members SET plan_id = ? WHERE member_id = ?";
//         await db.promise().query(query, [plan_id, memberId]);
//
//         res.status(200).json({ message: "Member's plan updated successfully." });
//     } catch (error) {
//         console.error("Error updating plan:", error);
//         res.status(500).json({ error: "Internal server error." });
//     }
// };

// export const updatePlanWithPayment = async (req, res) => {
//     const memberId = req.user.member_id;
//     const { plan_id, payment_method, payment_amount } = req.body;
//
//     try {
//         // Begin transaction to ensure both operations succeed or fail together
//         const connection = await db.promise().getConnection();
//         await connection.beginTransaction();
//
//         try {
//             // 1. Update the member's plan
//             const updatePlanQuery = "UPDATE gym_members SET plan_id = ? WHERE member_id = ?";
//             await connection.query(updatePlanQuery, [plan_id, memberId]);
//
//             // 2. Insert payment record into plan_payment table
//             const insertPaymentQuery =
//                 "INSERT INTO plan_payments (member_id, plan_id, payment_method, amount, payment_date, status) VALUES (?, ?, ?, ?, NOW(),?)";
//             await connection.query(insertPaymentQuery, [
//                 memberId,
//                 plan_id,
//                 'Credit',
//                 req.body.plan_price ,
//                 'Paid',
//             ]);
//
//             // If both operations succeed, commit the transaction
//             await connection.commit();
//             connection.release();
//
//             res.status(200).json({
//                 message: "Member's plan and payment information updated successfully."
//             });
//         } catch (error) {
//             // If any operation fails, rollback the transaction
//             await connection.rollback();
//             connection.release();
//             throw error;
//         }
//     } catch (error) {
//         console.error("Error updating plan and payment:", error);
//         res.status(500).json({ error: "Internal server error." });
//     }
// };


export const updatePlanWithPayment = async (req, res) => {
    const memberId = req.user.member_id;
    const { plan_id, payment_method, price } = req.body;

    // Generate payment ID
    // const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const paymentId = 'PAY-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    // Use direct query without getConnection
    try {
        // Update member's plan
        await db.promise().query(
            "UPDATE gym_members SET plan_id = ? WHERE member_id = ?",
            [plan_id, memberId]
        );

        // Insert payment record
        await db.promise().query(
            "INSERT INTO plan_payments (payment_id, member_id, plan_id, payment_method, amount, payment_date, status) VALUES (?,?, ?, ?, ?, NOW(),?)",
            [paymentId, memberId, plan_id,  'Card', price , 'Paid']
        );
        //                 "INSERT INTO plan_payments (member_id, plan_id, payment_method, amount, payment_date, status) VALUES (?, ?, ?, ?, NOW(),?)";
//             await connection.query(insertPaymentQuery, [
//                 memberId,
//                 plan_id,
//                 'Credit',
//                 req.body.plan_price ,
//                 'Paid',
//             ]);

        res.status(200).json({ message: "Member's plan and payment information updated successfully." });
    } catch (error) {
        console.error("Error updating plan and payment:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
