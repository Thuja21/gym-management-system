import express from "express";
const router = express.Router();
import {generateReport, downloadReport, getRecentReports} from "../controllers/report.js";

// Generate report data
router.get('/generate', generateReport);

// Download report in specified format
router.get('/download', downloadReport);

// Get recent reports
router.get('/recent', getRecentReports);


export default router;