import { db } from "../config/connectDatabase.js";

export const getPaymentDetails = (req, res) => {
    const memberId = req.user.member_id;

    const q = `
    SELECT plan_payments.*, plans.*
    FROM plan_payments
    JOIN plans ON plans.plan_id = plan_payments.plan_id
    WHERE plan_payments.member_id = ?
    ORDER BY plan_payments.payment_date DESC
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
        ORDER BY plan_payments.payment_date DESC
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}

export const getAllSuppmentPaymentDetails =(req,res)=> {
    const q = `
        SELECT supplement_payments.*, supplements.supplement_name, users.full_name
        FROM supplement_payments
                 JOIN supplements ON supplements.supplement_id = supplement_payments.supplement_id
                 JOIN users ON users.id = supplement_payments.user_id
        ORDER BY supplement_payments.payment_date DESC
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}

export const getSuppmentPaymentDetails = (req, res) => {
    const memberId = req.user.member_id;

    const q = `
    SELECT supplement_payments.*, supplements.*
    FROM supplement_payments
             JOIN supplements ON supplements.supplement_id = supplement_payments.supplement_id
             JOIN users ON users.id = supplement_payments.user_id
             JOIN gym_members ON gym_members.user_id = users.id
    WHERE gym_members.member_id = ?
    ORDER BY supplement_payments.payment_date DESC
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

