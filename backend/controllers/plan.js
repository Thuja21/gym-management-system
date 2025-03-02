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
