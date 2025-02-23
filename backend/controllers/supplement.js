import {db} from "../config/connectDatabase.js";

export const viewAllSupplements = (req, res) => {
    const q = "SELECT * FROM supplements";
    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err.message);

        return res.status(200).send(data);
    })
}