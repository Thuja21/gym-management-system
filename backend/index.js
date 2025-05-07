import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import * as path from "node:path";
import {db} from "./config/connectDatabase.js";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import membersRoutes from "./routes/member.js";
import trainersRoutes from "./routes/trainer.js";
import equipmentsRoutes from "./routes/equipment.js";
import supplementsRoutes from "./routes/supplement.js";
import plansRoutes from "./routes/plan.js";
import announcementRoutes from "./routes/announcement.js";
import planPaymentRoutes from "./routes/planPayment.js";
import attendanceRoutes from "./routes/attendance.js";
import dashboardRoutes from "./routes/dashboard.js";
import scheduleRoutes from "./routes/schedule.js";
import reportRoutes from "./routes/report.js";
import report from "./routes/report.js";


//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,  // Allow credentials (cookies)
    })
);
app.use(cookieParser());

// these code I use for upload photo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set Multer Storage to Save in React's src/assets/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../frontend/src/assets/");

        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Serve the uploaded assets as static files
app.use("/assets", express.static(path.join(__dirname, '../frontend/src/assets/')));

// Upload Route
app.post("/addSupplement", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Save only the relative path in MySQL
    const imageUrl = `/assets/${req.file.filename}`;
    console.log("sdfa",imageUrl);
    const { supplement_name, description, price, quantity_in_stock, expiry_date, category, size, brand } = req.body;

    const sql = "INSERT INTO supplements (supplement_name, description, price, quantity_in_stock, expiry_date, category, image_url, size, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [supplement_name, description, price, quantity_in_stock, expiry_date, category, imageUrl, size, brand], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Supplement added successfully!", url: imageUrl, supplement_id: result.insertId});
    });
});

// Modified edit endpoint
app.put("/api/supplements/edit/:id", upload.single("image"), (req, res) => {
    const supplementId = req.params.id;

    const expiryDate = new Date(req.body.expiry_date).toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'

    // Use new image path if uploaded, else keep existing
    const imageUrl = req.file
        ? `/assets/${req.file.filename}`
        : req.body.image_url;

    const updatedSupplement = {
        ...req.body,
        image_url: imageUrl
    };

    const sql = `
        UPDATE supplements 
        SET 
            supplement_name = ?,
            description = ?,
            price = ?,
            quantity_in_stock = ?,
            expiry_date = ?,
            category = ?,
            image_url = ?,
            size = ?,
            brand = ?
        WHERE supplement_id = ?`;

    db.query(sql, [
        updatedSupplement.supplement_name,
        updatedSupplement.description,
        updatedSupplement.price,
        updatedSupplement.quantity_in_stock,
        expiryDate,
        updatedSupplement.category,
        updatedSupplement.image_url,
        updatedSupplement.size,
        updatedSupplement.brand,
        supplementId
    ], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({
            message: "Supplement updated!",
            ...updatedSupplement
        });
    });
});





app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/trainers" , trainersRoutes);
app.use("/api/equipments", equipmentsRoutes);
app.use("/api/supplements", supplementsRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/announcements", announcementRoutes)
app.use("/api/planpayments", planPaymentRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/dash", dashboardRoutes)
app.use("/api/schedules", scheduleRoutes)
app.use("/api/reports", reportRoutes)


//listen port
app.listen(8800, () => {
    console.log("API working!!!");
});


