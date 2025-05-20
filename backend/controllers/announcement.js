import {db} from "../config/connectDatabase.js";
import nodemailer from "nodemailer";
import crypto from "crypto"; // For generating reset token
import dotenv from "dotenv";
dotenv.config();

// Configure Nodemailer for sending emails
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

export const viewAllAnnouncements =(req,res)=> {
    const q = "SELECT * FROM announcements";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}

// export const addAnnouncement =(req,res)=> {
//     db.beginTransaction((err) => {
//         if (err) return res.status(500).json(err);
//
//         const userInsertQuery = "INSERT INTO announcements (`announcement_title` , `announcement_content` , `posted_date`) VALUES (?)"
//         const userValues = [
//             req.body.title,
//             req.body.content,
//             new Date(),
//            ];
//
//         db.query(userInsertQuery, [userValues], (err, insertResult) => {
//             if (err) {
//                 return db.rollback(() => {
//                     res.status(500).json(err);
//                 });
//             }
//
//             // Get the ID of the newly inserted announcement
//             const newAnnouncementId = insertResult.insertId;
//             console.log("New announcement ID:", newAnnouncementId);
//
//             // Fetch the newly created announcement to return it
//             const fetchQuery = "SELECT * FROM announcements WHERE announcement_id = ?";
//
//             db.query(fetchQuery, [newAnnouncementId], (err, fetchResult) => {
//                 if (err) {
//                     return db.rollback(() => {
//                         res.status(500).json(err);
//                     });
//                 }
//
//                 // Commit the transaction if both queries succeed
//                 db.commit((err) => {
//                     if (err) {
//                         return db.rollback(() => {
//                             res.status(500).json(err);
//                         });
//                     }
//                     console.log("fetchResult", fetchResult);
//                     // Send the newly created announcement as response
//                     res.status(200).json(fetchResult[0]);
//                 });
//             });
//         });
//     });
// };

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

export const addAnnouncement = (req, res) => {
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

                // Fetch all members' emails
                const getMembersQuery = "SELECT email FROM users WHERE user_type = 'MEMBER'";

                db.query(getMembersQuery, [], (err, memberResults) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    // Extract member emails
                    const memberEmails = memberResults.map(member => member.email);
                    console.log("Member emails:", memberEmails);

                    // If there are members to notify
                    if (memberEmails.length > 0) {
                        // Prepare email content
                        const mailOptions = {
                            from: 'jkfitnessppt@gmail.com',
                            to: memberEmails.join(','),
                            subject: `New Announcement: ${req.body.title}`,
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                                    <h2 style="color: #8B0000; margin-bottom: 20px;">${req.body.title}</h2>
                                    <p style="color: #333; line-height: 1.6;">${req.body.content}</p>
                                    <p style="color: #666; margin-top: 30px; font-size: 14px;">Posted on: ${new Date().toLocaleDateString()}</p>
                                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; color: #666; font-size: 12px;">
                                        <p>This is an automated notification. Please do not reply to this email.</p>
                                    </div>
                                </div>
                            `
                        };

                        // Send the email
                        transporter.sendMail(mailOptions, (emailErr, info) => {
                            if (emailErr) {
                                console.error("Error sending email notifications:", emailErr);
                                // Continue with the transaction even if email fails
                            } else {
                                console.log("Email notifications sent successfully:", info.messageId);
                            }

                            // Commit the transaction
                            db.commit((commitErr) => {
                                if (commitErr) {
                                    return db.rollback(() => {
                                        res.status(500).json(commitErr);
                                    });
                                }
                                console.log("fetchResult", fetchResult);
                                // Send the newly created announcement as response
                                res.status(200).json(fetchResult[0]);
                            });
                        });
                    } else {
                        // No members to notify, just commit the transaction
                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    res.status(500).json(commitErr);
                                });
                            }
                            console.log("fetchResult", fetchResult);
                            // Send the newly created announcement as response
                            res.status(200).json(fetchResult[0]);
                        });
                    }
                });
            });
        });
    });
};
