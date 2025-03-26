import {db} from "../config/connectDatabase.js";

export const totalActiveMembers = (req, res) => {
    const query = `
    SELECT COUNT(*) AS total_active_members
    FROM gym_members
  `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Error fetching total active members" });
        }
        res.status(200).json({ total_active_members: results[0].total_active_members || 0 });
    });
};

export const totalRegistration = (req, res) => {
    const query = `
    SELECT COUNT(*) AS total_registrations
    FROM gym_members
    WHERE MONTH(registered_date) = MONTH(CURRENT_DATE)
      AND YEAR(registered_date) = YEAR(CURRENT_DATE)
  `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Error fetching total registrations" });
        }
        res.status(200).json({ total_registrations: results[0].total_registrations || 0 });
    });
};

export const recentNotices = (req, res) => {
    const query = `
        SELECT announcement_title , posted_date
        FROM announcements
        ORDER BY created_at DESC
        LIMIT 3
    `;

    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const recentSessions = (req, res) => {
    const query = `
    SELECT title, schedule_time_slot, end_time, 
        TIMEDIFF(end_time, schedule_time_slot) AS duration,
        schedule_date, trainer_id
    FROM schedules 
    ORDER BY schedule_date DESC 
    LIMIT 3
`;
    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const totalSessionsToday = (req, res) => {
    const query = `
    SELECT COUNT(*) AS total_sessions_today
    FROM schedules
    WHERE DATE(schedule_date) = CURDATE()
  `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Error fetching today's session count" });
        }
        res.status(200).json({ total_sessions_today: results[0].total_sessions_today || 0 });
    });
};


