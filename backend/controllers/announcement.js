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

        db.query(userInsertQuery, [userValues], (err, insertResult) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json(err);
                });
            }

            // Get the ID of the newly inserted announcement
            const newAnnouncementId = insertResult.insertId;
            console.log("New announcement ID:", newAnnouncementId);

            // Fetch the newly created announcement to return it
            const fetchQuery = "SELECT * FROM announcements WHERE announcement_id = ?";

            db.query(fetchQuery, [newAnnouncementId], (err, fetchResult) => {
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
                    console.log("fetchResult", fetchResult);
                    // Send the newly created announcement as response
                    res.status(200).json(fetchResult[0]);
                });
            });
        });
    });
};

export const deleteAnnouncement = (req, res) => {
    const announcementId = req.params.id;
    console.log("Updating announcement ID:", announcementId);


    // Check if the plan ID is provided
    if (!announcementId) {
        return res.status(400).json({ message: "Announcement ID is required" });
    }

    // Delete query
    const deleteQuery = "DELETE FROM announcements WHERE announcement_id = ?";

    db.query(deleteQuery, [announcementId], (err, result) => {
        if (err) {
            console.error("Error deleting announcement:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement deleted successfully!" });
    });
};
