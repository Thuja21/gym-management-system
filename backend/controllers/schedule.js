import { db } from "../config/connectDatabase.js";
import nodemailer from "nodemailer";
import crypto from "crypto"; // For generating reset token
import dotenv from "dotenv";
dotenv.config();


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
// export const addSchedule = (req, res) => {
//
//     db.beginTransaction((err) => {
//         if (err) return res.status(500).json(err);
//
//         const { title, notes, schedule_date, schedule_time_slot,end_time, weekly_schedule, schedule_type } = req.body;
//         const trainerId = req.user.trainer_id;
//
//         const insertScheduleQuery = "INSERT INTO schedules (`title`, `schedule_date`, `schedule_time_slot`, `end_time`, `notes`, `trainer_id`, `schedule_type`) VALUES (?)";
//         const scheduleValues = [title, schedule_date, schedule_time_slot, end_time, notes, trainerId, schedule_type];
//
//         db.query(insertScheduleQuery, [scheduleValues], (err, result) => {
//             if (err) {
//                 return db.rollback(() => {
//                     res.status(500).json(err);
//                 });
//             }
//
//             const scheduleId = result.insertId;
//
//             // Prepare the weekly slots insertion
//             const insertWeeklyQuery = "INSERT INTO weekly_schedule (`schedule_id`, `day`, `start_time`, `end_time`) VALUES ?";
//             const weeklyValues = weekly_schedule.map(slot => [
//                 scheduleId,
//                 slot.day,
//                 slot.start_time,
//                 slot.end_time
//             ]);
//
//
//             if (schedule_type === "weekly") {
//                 db.query(insertWeeklyQuery, [weeklyValues], (err) => {
//                     if (err) {
//                         return db.rollback(() => {
//                             res.status(500).json(err);
//                         });
//                     }
//
//                     db.commit((err) => {
//                         if (err) {
//                             return db.rollback(() => {
//                                 res.status(500).json(err);
//                             });
//                         }
//
//                         res.status(200).json("Schedule with weekly slots has been created.");
//                     });
//                 });
//             } else {
//                 db.commit((err) => {
//                     if (err) {
//                         return db.rollback(() => {
//                             res.status(500).json(err);
//                         });
//                     }
//
//                     res.status(200).json("Schedule (one-time) has been created.");
//                 });
//             }
//
//         });
//     });
// };

export const addSchedule = (req, res) => {
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        const { title, notes, schedule_date, schedule_time_slot, end_time, weekly_schedule, schedule_type } = req.body;
        const trainerId = req.user.trainer_id;

        const insertScheduleQuery = "INSERT INTO schedules (`title`, `schedule_date`, `schedule_time_slot`, `end_time`, `notes`, `trainer_id`, `schedule_type`) VALUES (?)";
        const scheduleValues = [title, schedule_date, schedule_time_slot, end_time, notes, trainerId, schedule_type];

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

                        // After successful commit, send emails to all members
                        sendScheduleEmailToMembers({
                            title,
                            schedule_date,
                            schedule_time_slot,
                            end_time,
                            notes,
                            schedule_type: "weekly",
                            weekly_schedule
                        });

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

                    // After successful commit, send emails to all members
                    sendScheduleEmailToMembers({
                        title,
                        schedule_date,
                        schedule_time_slot,
                        end_time,
                        notes,
                        schedule_type: "one-time"
                    });

                    res.status(200).json("Schedule (one-time) has been created.");
                });
            }
        });
    });
};

// Function to send emails to all gym members
const sendScheduleEmailToMembers = (scheduleData) => {
    // Fetch all gym members' emails
    db.query('SELECT email FROM users where user_type= "MEMBER"', (err, results) => {
        if (err) {
            console.error('Error fetching emails:', err);
            return;
        }

        const emails = results.map(row => row.email);

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Gmail SMTP server
            port: 465,
            secure: true, // Use TLS (STARTTLS) for port 587
            auth: {
                user: 'jkfitnessppt@gmail.com', // Hardcoded email address
                pass: 'cyhubhjxgfjmsabs', // Replace with your actual password or App Password
            },
            timeout: 60000, // Increased timeout to 60 seconds to handle slow connections
        });

        // Create email content based on schedule type
        let emailText = `Dear member,\n\nA new schedule has been created:\nTitle: ${scheduleData.title}\n`;

        if (scheduleData.schedule_type === "one-time") {
            emailText += `Date: ${scheduleData.schedule_date}\nTime: ${scheduleData.schedule_time_slot} - ${scheduleData.end_time}\n`;
        } else {
            emailText += "Weekly Schedule:\n";
            scheduleData.weekly_schedule.forEach(slot => {
                emailText += `- ${slot.day}: ${slot.start_time} - ${slot.end_time}\n`;
            });
        }

        emailText += `\nNotes: ${scheduleData.notes || 'N/A'}\n\nBest regards,\nYour Gym Team`;

        // Email options
        const mailOptions = {
            from: 'jkfitnessppt@gmail.com',
            bcc: emails,  // Using BCC for privacy
            subject: `New Gym Schedule: ${scheduleData.title}`,
            text: emailText
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending schedule emails:', error);
            } else {
                console.log('Schedule notification emails sent successfully');
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


export const getLoggedInTrainerSchedule = (req, res) => {
    const trainerId = req.user.trainer_id;

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
WHERE schedules.trainer_id = ?
GROUP BY schedules.schedule_id
`;

    db.query(q, [trainerId], (err, data) => {
        if (err) {
            console.error("Error fetching schedules:", err);
            return res.status(500).json({ message: "Failed to fetch schedules." });
        }

        res.status(200).json(data);
    });
};

export const getTodaySessionCount = (req, res) => {
    const trainerId = req.user.trainer_id;
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Get day name
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dayOfWeek];

    console.log(dayName); // Will output the current day name (e.g., "Monday")

    console.log("Today's today:", today);
    console.log("Today's date:", todayDate);
    console.log("Today's dayOfWeek:", dayOfWeek);


    // // Convert JavaScript day (0-6) to your database day format if needed
    // const dbDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Adjust if needed

    // Using a simpler approach with UNION ALL and a single outer COUNT
    const query = `
        SELECT COUNT(*) as sessionCount FROM (
            -- One-time sessions for today
            SELECT schedule_id 
            FROM schedules 
            WHERE trainer_id = ? 
            AND schedule_date = ?
            AND (schedule_type = 'one-time' OR schedule_type IS NULL)
            
            UNION ALL
            
            -- Weekly sessions that fall on today's weekday
            SELECT s.schedule_id 
            FROM schedules s
            JOIN weekly_schedule ws ON s.schedule_id = ws.schedule_id
            WHERE s.trainer_id = ?
            AND s.schedule_type = 'weekly'
            AND ws.day = ?
        ) AS all_sessions
    `;



    db.query(query, [trainerId, todayDate, trainerId, dayName], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const sessionCount = result[0].sessionCount;
        res.status(200).json({ sessionCount });
    });
};

