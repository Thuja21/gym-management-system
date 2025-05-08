import { db } from "../config/connectDatabase.js";

export const getPaymentDetails = (req, res) => {
    const memberId = req.user.member_id;

    const q = `
    SELECT plan_payments.*, plans.*
    FROM plan_payments
    JOIN plans ON plans.plan_id = plan_payments.plan_id
    WHERE plan_payments.member_id = ?
  `;

    db.query(q, [memberId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching details", details: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "No details found" });
        }

        return res.status(200).json(data);
    });
};

export const getAllPaymentDetails =(req,res)=> {
    const q = `
        SELECT plan_payments.*, plans.plan_name, gym_members.user_id, users.full_name
        FROM plan_payments
                 JOIN plans ON plans.plan_id = plan_payments.plan_id
                 JOIN gym_members ON gym_members.member_id = plan_payments.member_id
                 JOIN users ON users.id = gym_members.user_id
        ORDER BY plan_payments.payment_id DESC
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}



