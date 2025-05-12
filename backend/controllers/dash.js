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

export const recentSessionsByTrainerId = (req, res) => {
    const query = `
    WITH future_sessions AS (
        -- One-time schedules
        SELECT 
            s.schedule_id,
            s.title,
            s.schedule_date,
            s.schedule_time_slot AS start_time,
            s.end_time,
            s.notes,
            s.trainer_id,
            'one-time' AS schedule_type,
            TIMESTAMP(s.schedule_date, s.schedule_time_slot) AS session_datetime
        FROM 
            schedules s
        WHERE 
            TIMESTAMP(s.schedule_date, s.schedule_time_slot) > NOW()
        
        UNION ALL
        
        -- Weekly schedules - calculate next occurrence for each day
        SELECT 
            s.schedule_id,
            s.title,
            -- Calculate the next occurrence date for this weekday
            CASE 
                -- If today is the weekday and time hasn't passed yet
                WHEN DAYNAME(CURDATE()) = ws.day AND CURTIME() < ws.start_time 
                    THEN CURDATE()
                -- If weekday is later this week
                WHEN DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) > DAYOFWEEK(CURDATE())
                    THEN DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE())) DAY)
                -- Otherwise next week
                ELSE DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE()) + 7) DAY)
            END AS schedule_date,
            ws.start_time,
            ws.end_time,
            s.notes,
            s.trainer_id,
            'weekly' AS schedule_type,
            TIMESTAMP(
                CASE 
                    WHEN DAYNAME(CURDATE()) = ws.day AND CURTIME() < ws.start_time 
                        THEN CURDATE()
                    WHEN DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) > DAYOFWEEK(CURDATE())
                        THEN DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE())) DAY)
                    ELSE DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE()) + 7) DAY)
                END,
                ws.start_time
            ) AS session_datetime
        FROM 
            schedules s
        JOIN 
            weekly_schedule ws ON s.schedule_id = ws.schedule_id
        WHERE 
            s.schedule_type = 'weekly'
    )
    
    SELECT 
        schedule_id,
        title,
        schedule_date,
        start_time,
        end_time,
        TIMEDIFF(end_time, start_time) AS duration,
        notes,
        trainer_id,
        schedule_type
    FROM 
        future_sessions
    WHERE
        session_datetime > NOW()
    ORDER BY 
        session_datetime ASC
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

export const getLastWeekTotalAttendance = (req, res) => {
    const query = `
    SELECT COUNT(*) AS total
    FROM attendance
    WHERE attendance_date >= DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE()) + 7) DAY)
      AND attendance_date <  DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
  `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching last week total:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ total: results[0].total });
    });
};

export const getRecentSessions = (req, res) => {
    const query = `
    WITH future_sessions AS (
        -- One-time schedules
        SELECT 
            s.schedule_id,
            s.title,
            s.schedule_date,
            s.schedule_time_slot AS start_time,
            s.end_time,
            s.notes,
            s.trainer_id,
            'one-time' AS schedule_type,
            TIMESTAMP(s.schedule_date, s.schedule_time_slot) AS session_datetime
        FROM 
            schedules s
        WHERE 
            s.schedule_type = 'one-time'
            AND TIMESTAMP(s.schedule_date, s.schedule_time_slot) > NOW()
        
        UNION ALL
        
        -- Weekly schedules - calculate next occurrence for each day
        SELECT 
            s.schedule_id,
            s.title,
            -- Calculate the next occurrence date for this weekday
            CASE 
                -- If today is the weekday and time hasn't passed yet
                WHEN DAYNAME(CURDATE()) = ws.day AND CURTIME() < ws.start_time 
                    THEN CURDATE()
                -- If weekday is later this week
                WHEN DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) > DAYOFWEEK(CURDATE())
                    THEN DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE())) DAY)
                -- Otherwise next week
                ELSE DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE()) + 7) DAY)
            END AS schedule_date,
            ws.start_time,
            ws.end_time,
            s.notes,
            s.trainer_id,
            'weekly' AS schedule_type,
            TIMESTAMP(
                CASE 
                    WHEN DAYNAME(CURDATE()) = ws.day AND CURTIME() < ws.start_time 
                        THEN CURDATE()
                    WHEN DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) > DAYOFWEEK(CURDATE())
                        THEN DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE())) DAY)
                    ELSE DATE_ADD(CURDATE(), INTERVAL (DAYOFWEEK(CONCAT('2023-01-', FIELD(ws.day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))) - DAYOFWEEK(CURDATE()) + 7) DAY)
                END,
                ws.start_time
            ) AS session_datetime
        FROM 
            schedules s
        JOIN 
            weekly_schedule ws ON s.schedule_id = ws.schedule_id
        WHERE 
            s.schedule_type = 'weekly'
    )
    
    SELECT 
        fs.schedule_id,
        fs.title,
        fs.schedule_date,
        fs.start_time,
        fs.end_time,
        TIMEDIFF(fs.end_time, fs.start_time) AS duration,
        fs.notes,
        fs.trainer_id,
        fs.schedule_type,
        t.name AS trainer_name
    FROM 
        future_sessions fs
    LEFT JOIN
        trainers t ON fs.trainer_id = t.trainer_id
    WHERE
        fs.session_datetime > NOW()
    ORDER BY 
        fs.session_datetime ASC
    LIMIT 3
    `;

    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};
