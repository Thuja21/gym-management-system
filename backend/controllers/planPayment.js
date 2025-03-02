import {db} from "../config/connectDatabase.js";

export const viewAllPlanPayments =(req,res)=> {

    const q = `
        SELECT
            pp.payment_id,
            pp.amount,
            pp.payment_date,
            pp.due_date,
            pp.status,
            p.plan_id,
            p.plan_name,
            p.plan_price,
            u.full_name,
            gm.member_id
            
        FROM
            plan_payments pp

        JOIN
            gym_members gm
        ON pp.member_id = gm.member_id
        
        JOIN
            users u
        ON gm.user_id = u.id
        JOIN
            plans p
        ON pp.plan_id = p.plan_id;
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}

export const getAllMembers = async (req, res) => {
    try {
        const q =`SELECT p.plan_id, plan_name, p.plan_price, u.full_name, gm.registered_date, gm.member_id
                  FROM plans p
                    JOIN gym_members gm ON p.plan_id = gm.plan_id
                    JOIN users u ON gm.user_id = u.id;`;


        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json("No members found!");

            res.status(200).json(data);
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error fetching data:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}