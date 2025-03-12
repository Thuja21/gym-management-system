import {db} from "../config/connectDatabase.js";


export const viewAllAnnouncements =(req,res)=> {
    const q = "SELECT * FROM announcements";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}


export const addAnnouncement =(req,res)=> {
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        const userInsertQuery = "INSERT INTO announcements (`announcement_title` , `announcement_content` , `posted_date`) VALUES (?)"
        const userValues = [
            req.body.title,
            req.body.content,
            new Date(),
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
                res.status(200).json("Announcement has been created.");
            });
        });
    })
}