import {db} from "../config/connectDatabase.js";


export const viewAllAnnouncements =(req,res)=> {
    const q = "SELECT * FROM announcements";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}