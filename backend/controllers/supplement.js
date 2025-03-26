import {db} from "../config/connectDatabase.js";

export const viewAllSupplements = (req, res) => {
    const q = "SELECT * FROM supplements";
    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err.message);

        return res.status(200).send(data);
    })
}


export const addSupplement = async (req, res) => {
    const q = "INSERT INTO supplements (supplement_name, description, price, quantity_in_stock, expiry_date, category, image_url, size, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        req.body.supplement_name,
        req.body.description,
        req.body.price,
        req.body.quantity_in_stock,
        req.body.expiry_date,
        req.body.category,
        req.body.image_url,
        req.body.size,
        req.body.brand
    ];

    db.query(q, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Supplement has been added.");
    });
};


export const editSupplement = async (req, res) => {
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

export const deleteSupplement = (req, res) => {
    const supplementId = req.params.id;
    console.log("Updating supplement ID:", supplementId);

    const deleteQuery = "DELETE FROM supplements WHERE supplement_id = ?";

    db.query(deleteQuery, [supplementId], (err, result) => {
        if (err) {
            console.error("Error deleting supplement:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Supplement not found" });
        }

        res.status(200).json({ message: "Supplement deleted successfully!" });
    });
};
