import {db} from "../config/connectDatabase.js";

export const checkIn = (req, res) => {
    const { member_id, check_in_time, attendance_date } = req.body;

    if (!member_id || !check_in_time) {
        return res.status(400).json({ message: "Member ID and check-in time are required." });
    }

    // Start transaction
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        // Check if the member already checked in for the day
        const checkExistingQuery = "SELECT * FROM attendance WHERE member_id = ? AND attendance_date = ?";

        db.query(checkExistingQuery, [member_id, attendance_date], (err, data) => {
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

            db.query(insertQuery, [member_id, check_in_time, attendance_date, true], (err, result) => {
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


export const checkOut = (req, res) => {
    const memberId = req.params.id;
    const { attendance_id, check_in_time, attendance_date } = req.body;

    const attendance_date_new = new Date(attendance_date);

    if (!memberId || !check_in_time) {
        return res.status(400).json({ message: "Member ID and check-in time are required." });
    }
    const checkOutTime = new Date().toISOString().slice(0, 19).replace("T", " "); // Full DateTime

    // Start transaction
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        // Check if the member already checked in for the day
        const checkExistingQuery = `SELECT * FROM attendance WHERE member_id = ? AND Date(attendance_date) = ? AND attendance_id = ?;`;
        console.log(checkExistingQuery);

        db.query(checkExistingQuery, [memberId, attendance_date_new, attendance_id], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }
            if (data.length) {
                console.log(data[0]);
                if (data[0].check_out_time != null) {
                    return db.rollback(() => {
                        res.status(409).json({ message: "Member has already checked out today." });
                    });
                }
            }

            const updateQuery = `
                UPDATE attendance 
                SET check_out_time = ? 
                WHERE member_id = ? 
                AND DATE(attendance_date) = ? 
                AND attendance_id = ?`;

            db.query(updateQuery, [checkOutTime, memberId, attendance_date_new, attendance_id], (err, result) => {
                if (err) {
                    return db.rollback(() => res.status(500).json(err));
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json(err));
                    }
                    res.status(200).json({ message: "Check-out successful" });
                });
            });
        });
    });
};

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


export const getLoggedInMemberAttendance = (req, res) => {
    const memberId = req.user.member_id;

    const q = `
    SELECT attendance.*, users.full_name
    FROM attendance
    JOIN gym_members ON gym_members.member_id = attendance.member_id
    JOIN users ON gym_members.user_id = users.id
    WHERE attendance.member_id = ?
  `;

    db.query(q, [memberId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching attendance", details: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        return res.status(200).json(data);
    });
};
