import { db } from "../config/connectDatabase.js";

// View all schedules
export const viewAllSchedules = (req, res) => {
    const q = `SELECT schedules.*,  users.full_name
    FROM schedules
    JOIN trainers ON trainers.trainer_id = schedules.trainer_id
    JOIN users ON trainers.user_id = users.id`;

        db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

// Add a new schedule
export const addSchedule = (req, res) => {
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        const userInsertQuery = "INSERT INTO schedules (`title`, `schedule_date`, `schedule_time_slot`, `end_time`, `notes`, `trainer_id`) VALUES (?)";
        const userValues = [
            req.body.title,
            req.body.schedule_date,
            req.body.schedule_time_slot,
            req.body.end_time,
            req.body.notes,
            1,
        ];

        db.query(userInsertQuery, [userValues], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }
            // Commit the transaction if both queries succeed
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }
                // Send success response
                res.status(200).json("Schedule has been created.");
            });
        });
    });
};

export const editSchedule = async (req, res) => {
    const scheduleId = req.params.id;
    console.log("Updating schedule ID:", scheduleId);

    try {

        // Convert schedule_date to YYYY-MM-DD format
        const scheduleDate = new Date(req.body.schedule_date).toISOString().split('T')[0];

        const query = "UPDATE schedules SET title = ?, schedule_date = ?, schedule_time_slot = ?, end_time = ?,  notes = ? WHERE schedule_id = ?";

        const updateValues = [
            req.body.title,
            scheduleDate,
            req.body.schedule_time_slot,
            req.body.end_time,
            req.body.notes,
            scheduleId
        ];
        console.log(updateValues);

        await db.promise().query(query, updateValues);
        res.status(200).json({ message: "Schedules details updated successfully." });

    } catch (error) {
        console.error("Error updating schedule:", error);
        await db.promise().rollback();
        res.status(500).json({ error: "Internal Server Error. Please try again." });
    }
};

// Delete a schedule
export const deleteSchedule = (req, res) => {
    const scheduleId = req.params.id;
    console.log("Deleting schedule ID:", scheduleId);

    // Check if the schedule ID is provided
    if (!scheduleId) {
        return res.status(400).json({ message: "Schedule ID is required" });
    }

    // Delete query
    const deleteQuery = "DELETE FROM schedules WHERE schedule_id = ?";

    db.query(deleteQuery, [scheduleId], (err, result) => {
        if (err) {
            console.error("Error deleting schedule:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.status(200).json({ message: "Schedule deleted successfully!" });
    });
};
