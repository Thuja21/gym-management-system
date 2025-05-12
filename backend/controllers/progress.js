import {db} from "../config/connectDatabase.js";

export const viewAllProgress = (req, res) => {
    const memberId = req.params.id;

    const query = `
        SELECT 
            id,
            member_id,
            date,
            weight,
            body_fat AS bodyFat,
            chest_size AS chestSize,
            waist_size AS waistSize,
            arm_size AS armSize,
            leg_size AS legSize,
            notes,
            created_at AS createdAt
        FROM progress
        WHERE member_id = ?
        ORDER BY date DESC
    `;

    db.query(query, [memberId], (err, results) => {
        if (err) {
            console.error("Error fetching progress:", err);
            return res.status(500).json({ message: "Failed to fetch progress data." });
        }

        return res.status(200).json(results);
    });
};


// export const addProgress = async (req, res) => {
//     const memberId = req.params.id;
//
//     const insertQuery = `
//         INSERT INTO progress
//         (member_id, date, weight, body_fat, chest_size, waist_size, arm_size, leg_size, notes)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//
//     const {
//         date,
//         weight,
//         bodyFat,
//         chestSize,
//         waistSize,
//         armSize,
//         legSize,
//         notes
//     } = req.body;
//
//     const values = [
//         memberId,
//         date,
//         weight,
//         bodyFat,
//         chestSize,
//         waistSize,
//         armSize,
//         legSize,
//         notes
//     ];
//
//     db.query(insertQuery, values, (err, result) => {
//         if (err) {
//             console.error("Error adding progress:", err);
//             return res.status(500).json("Failed to add progress.");
//         }
//         return res.status(200).json("Progress added successfully.");
//     });
// };

export const addProgress = async (req, res) => {
    const memberId = req.params.id;

    const {
        date,
        weight,
        bodyFat,
        chestSize,
        waistSize,
        armSize,
        legSize,
        notes
    } = req.body;

    // Check if progress for this member on the given date already exists
    const checkQuery = "SELECT id FROM progress WHERE member_id = ? AND date = ?";
    db.query(checkQuery, [memberId, date], (checkErr, checkResult) => {
        if (checkErr) {
            console.error("Error checking existing progress:", checkErr);
            return res.status(500).json("Error checking existing progress.");
        }

        if (checkResult.length > 0) {
            return res.status(409).json("Progress for this date already exists.");
        }

        // If not exists, insert new progress
        const insertQuery = `
            INSERT INTO progress 
            (member_id, date, weight, body_fat, chest_size, waist_size, arm_size, leg_size, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            memberId,
            date,
            weight,
            bodyFat,
            chestSize,
            waistSize,
            armSize,
            legSize,
            notes
        ];

        db.query(insertQuery, values, (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Error inserting progress:", insertErr);
                return res.status(500).json("Failed to add progress.");
            }
            return res.status(200).json("Progress added successfully.");
        });
    });
};
