import { db } from "../config/connectDatabase.js";

// View all schedules
export const viewAllSchedules = (req, res) => {
    const q = `
        SELECT
            schedules.schedule_id,
            schedules.title,
            schedules.schedule_date,
            schedules.schedule_time_slot,
            schedules.end_time,
            schedules.notes,
            schedules.trainer_id,
            schedules.schedule_type,
            users.full_name,
            JSON_ARRAYAGG(
                    JSON_OBJECT(
                            'day', weekly_schedule.day,
                            'start_time', weekly_schedule.start_time,
                            'end_time', weekly_schedule.end_time
                    )
            ) AS weekly_schedule
        FROM schedules
                 JOIN trainers ON trainers.trainer_id = schedules.trainer_id
                 JOIN users ON trainers.user_id = users.id
                 LEFT JOIN weekly_schedule ON weekly_schedule.schedule_id = schedules.schedule_id
        GROUP BY schedules.schedule_id
    `;

        db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

// Add a new schedule
export const addSchedule = (req, res) => {
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        const { title, notes, schedule_date, schedule_time_slot,end_time, weekly_schedule, schedule_type } = req.body;

        const insertScheduleQuery = "INSERT INTO schedules (`title`, `schedule_date`, `schedule_time_slot`, `end_time`, `notes`, `trainer_id`, `schedule_type`) VALUES (?)";
        const scheduleValues = [title, schedule_date, schedule_time_slot, end_time, notes, 1, schedule_type];

        db.query(insertScheduleQuery, [scheduleValues], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }

            const scheduleId = result.insertId;

            // Prepare the weekly slots insertion
            const insertWeeklyQuery = "INSERT INTO weekly_schedule (`schedule_id`, `day`, `start_time`, `end_time`) VALUES ?";
            const weeklyValues = weekly_schedule.map(slot => [
                scheduleId,
                slot.day,
                slot.start_time,
                slot.end_time
            ]);

            if (schedule_type === "weekly") {
                db.query(insertWeeklyQuery, [weeklyValues], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        res.status(200).json("Schedule with weekly slots has been created.");
                    });
                });
            } else {
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    res.status(200).json("Schedule (one-time) has been created.");
                });
            }

        });
    });
};

export const editSchedule = (req, res) => {
    const scheduleId = req.params.id;

    db.beginTransaction(async (err) => {
        if (err) return res.status(500).json(err);

        try {
            const { title, notes, schedule_date, schedule_time_slot, end_time, schedule_type, weekly_schedule } = req.body;

            // Convert schedule_date to YYYY-MM-DD
            const formattedDate = new Date(schedule_date).toISOString().split('T')[0];

            const updateQuery = `
                UPDATE schedules 
                SET title = ?, schedule_date = ?, schedule_time_slot = ?, end_time = ?, notes = ?, schedule_type = ?
                WHERE schedule_id = ?
            `;
            const updateValues = [title, formattedDate, schedule_time_slot, end_time, notes, schedule_type, scheduleId];

            await db.promise().query(updateQuery, updateValues);

            // Delete old weekly schedule slots for this schedule
            const deleteWeeklyQuery = "DELETE FROM weekly_schedule WHERE schedule_id = ?";
            await db.promise().query(deleteWeeklyQuery, [scheduleId]);

            // Insert new weekly schedule slots
            const insertWeeklyQuery = "INSERT INTO weekly_schedule (schedule_id, day, start_time, end_time) VALUES ?";
            const weeklyValues = weekly_schedule.map(slot => [
                scheduleId,
                slot.day,
                slot.start_time,
                slot.end_time
            ]);

            if (schedule_type === "weekly") {
                await db.promise().query(insertWeeklyQuery, [weeklyValues]);
            }

            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }
                res.status(200).json({ message: "Schedule and weekly slots updated successfully." });
            });

        } catch (error) {
            console.error("Error updating schedule:", error);
            db.rollback(() => {
                res.status(500).json({ error: "Internal Server Error. Please try again." });
            });
        }
    });
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
