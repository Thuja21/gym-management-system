import {db} from "../config/connectDatabase.js";


export const viewAllPlans = (req, res) => {
    const q = "SELECT * FROM plans";

    db.query(q, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    })
}