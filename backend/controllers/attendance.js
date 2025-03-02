import {db} from "../config/connectDatabase.js";

export const checkIn = (req, res) => {
    const { member_id, checkIn } = req.body;
    const date = new Date().toISOString().split('T')[0]; // Get today's date

    if (!member_id || !checkIn) {
        return res.status(400).json({ message: "Member ID and check-in time are required." });
    }

    // Start transaction
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        // Check if the member already checked in for the day
        const checkExistingQuery = "SELECT * FROM attendance WHERE member_id = ? AND attendance_date = ?";

        db.query(checkExistingQuery, [member_id, date], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }
            if (data.length) {
                return db.rollback(() => {
                    res.status(409).json({ message: "Member has already checked in today." });
                });
            }

            // Insert check-in record into attendance table
            const insertQuery =
                "INSERT INTO attendance (`member_id`, `check_in_time`, `check_out_time`, `attendance_date`, `attended`) VALUES (?, ?, NULL, ?, ?)";

            db.query(insertQuery, [member_id, checkIn, date, true], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                // Commit the transaction after successful insertion
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }
                    res.status(200).json({ message: "Check-in successful", attendance_id: result.insertId });
                });
            });
        });
    });
};


//
// // Check-out function
// export const checkOut = async (req, res) => {
//     const { member_id, checkOut } = req.body;
//
//     try {
//         const query = "UPDATE attendance SET check_out = ? WHERE member_id = ? AND date = CURDATE()";
//         const [result] = await db.query(query, [checkOut, member_id]);
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "No check-in record found for today" });
//         }
//
//         res.status(200).json({ message: "Check-out successful" });
//     } catch (error) {
//         console.error("Error in check-out:", error);
//         res.status(500).json({ error: "Failed to check out" });
//     }
// };
//


// Get attendance records for a specific date
// export const getAttendanceByDate = async (req, res) => {
//     const { date } = req.query; // Get the date from the query parameters
//
//     if (!date) {
//         return res.status(400).json({ error: "Date is required" });
//     }
//
//     try {
//         // Query to fetch records for the selected date
//         const [records] = await db.query("SELECT * FROM attendance WHERE attendance_date = ? ORDER BY attendance_date DESC", [date]);
//
//         if (records.length === 0) {
//             return res.status(404).json({ message: "No attendance records found for this date" });
//         }
//
//         res.status(200).json(records);
//     } catch (error) {
//         console.error("Error fetching attendance:", error);
//         res.status(500).json({ error: "Failed to retrieve attendance records" });
//     }
// };

export const getAttendanceByDate = (req, res) => {
    const { date } = req.query; // Get the date from the query parameters

    if (!date) {
        return res.status(400).json({ error: "Date is required" });
    }

    // const q = "SELECT * FROM attendance WHERE attendance_date = ?";

    const q = `SELECT attendance.*, users.full_name
               FROM attendance
                JOIN gym_members ON gym_members.member_id = attendance.member_id
                JOIN users ON gym_members.user_id = users.id
               WHERE DATE(attendance.attendance_date) = ? `;

    db.query(q, [date], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching attendance", details: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this date" });
        }

        return res.status(200).json(data);
    });
};
