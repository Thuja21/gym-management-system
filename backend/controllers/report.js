import {db} from "../config/connectDatabase.js";
// import PDFDocument from 'pdfkit';
import PDFDocument from 'pdfkit-table';
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from "axios";
import fs from 'fs';


// Add this to your imports at the top
import { ChartJSNodeCanvas } from'chartjs-node-canvas';
import tmp from 'tmp';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let totalActiveMembers = 0;

axios.get("http://localhost:8800/api/dash/totalActiveMember")
    .then(response => {
        console.log("API Response (Active Members):", response.data);
        totalActiveMembers = response.data.total_active_members;

        // Use totalActiveMembers in your logic here
    })
    .catch(error => {
        console.error("Error fetching total active members:", error);
    });


// Generate report data based on type and date range (without async/await)
export const generateReport = (req, res) => {
    const { type, startDate, endDate } = req.query;

    let fetchDataFn;

    switch (type) {
        case 'attendance':
            fetchDataFn = getAttendanceData;
            break;
        case 'membership':
            fetchDataFn = getMembershipData;
            break;
        case 'payment':
            fetchDataFn = getPaymentData;
            break;
        default:
            return res.status(400).json({ error: 'Invalid report type' });
    }

    fetchDataFn(startDate, endDate, (err, reportData) => {
        if (err) {
            console.error('Error generating report:', err);
            return res.status(500).json({ error: 'Failed to generate report' });
        }

        res.json(reportData);
    });
};

// Download report in requested format (without async/await)
export const downloadReport = (req, res) => {
    const { type, startDate, endDate, format } = req.query;

    let fetchDataFn;
    let reportTitle = '';

    switch (type) {
        case 'attendance':
            fetchDataFn = getAttendanceData;
            reportTitle = 'Attendance Report';
            break;
        case 'membership':
            fetchDataFn = getMembershipData;
            reportTitle = 'Membership Report';
            break;
        case 'payment':
            fetchDataFn = getPaymentData;
            reportTitle = 'Payment Report';
            break;
        default:
            return res.status(400).json({ error: 'Invalid report type' });
    }

    fetchDataFn(startDate, endDate, (err, reportData) => {
        if (err) {
            console.error('Error downloading report:', err);
            return res.status(500).json({ error: 'Failed to download report' });
        }

        if (format === 'pdf') {
            generatePDF(res, reportData, reportTitle, startDate, endDate);
        } else if (format === 'xlsx') {
            generateExcel(res, reportData, reportTitle, startDate, endDate, type);
        } else if (format === 'csv') {
            generateCSV(res, reportData, type, startDate, endDate);
        } else {
            res.status(400).json({ error: 'Invalid format specified' });
        }
    });
};

// Sample recent reports
export const getRecentReports = (req, res) => {
    try {
        const recentReports = [
            { id: 1, name: "Attendance Report", date: "May 5, 2025", type: "PDF" },
            { id: 2, name: "Membership Summary", date: "May 3, 2025", type: "Excel" },
            { id: 3, name: "Payment Analysis", date: "May 1, 2025", type: "PDF" },
        ];

        res.json(recentReports);
    } catch (error) {
        console.error('Error fetching recent reports:', error);
        res.status(500).json({ error: 'Failed to fetch recent reports' });
    }
};

// ------------------------------------
// Data Fetching Functions (Callback-based)
// ------------------------------------
// function getAttendanceData(startDate, endDate, callback) {
//     // Replace with DB query as needed
//     const data = [
//         { id: 1, name: "John Doe", date: "2025-05-01", status: "Present" },
//         { id: 2, name: "Jane Smith", date: "2025-05-01", status: "Absent" },
//         { id: 3, name: "Mike Johnson", date: "2025-05-02", status: "Present" }
//     ];
//     callback(null, data);
// }

function getAttendanceData(startDate, endDate, callback) {
    const query = `SELECT attendance.attendance_date, gym_members.member_id, users.full_name, attendance.attended
               FROM attendance
                JOIN gym_members ON gym_members.member_id = attendance.member_id
                JOIN users ON gym_members.user_id = users.id
               WHERE DATE(attendance.attendance_date)  BETWEEN ? AND ? `;

    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getMembershipData(startDate, endDate, callback) {
    const query = `SELECT 
                    gym_members.member_id, 
                    users.full_name,
                    plans.plan_name as membership_type,
                    gym_members.start_date as start_date, 
                    gym_members.end_date,
                    CASE 
                        WHEN gym_members.end_date >= CURDATE() THEN 'Active' 
                        ELSE 'Expired' 
                    END as status
                FROM gym_members
                JOIN plans ON gym_members.plan_id = plans.plan_id
                JOIN users ON gym_members.user_id = users.id
                WHERE (gym_members.start_date BETWEEN ? AND ?) 
                OR (gym_members.end_date BETWEEN ? AND ?)
                OR (? BETWEEN gym_members.start_date AND gym_members.end_date)`;

    db.query(query, [startDate, endDate, startDate, endDate, startDate], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}




function getPaymentData(startDate, endDate, callback) {
    const data = [
        { id: 1, name: "John Doe", amount: 99.99, payment_date: "2025-05-01", payment_method: "Credit Card" },
        { id: 2, name: "Jane Smith", amount: 49.99, payment_date: "2025-05-02", payment_method: "PayPal" }
    ];
    callback(null, data);
}

// ------------------------------------
// Report File Generators
// ------------------------------------

async  function generatePDF(res, data, title, startDate, endDate, gymName, logoPath, contactInfo = {}) {
    // Default contact info
    const defaultLogoPath = path.join(__dirname, '..', 'public', 'logo.png');
    const address = contactInfo.address || 'Sarayadi,PointPedro';
    const email = contactInfo.email || 'contact@JKFitness.com';
    const phone = contactInfo.phone || '0771728778';

    const displayGymName = gymName || 'JK FITNESS';

    const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        info: {
            Title: title ? `${title} - ${startDate} to ${endDate}` : 'Gym Report',
            Author: displayGymName || 'JK FITNESS',
            Subject: 'Gym Report'
        },
        bufferPages: true
    });

    const filename = `${title.replace(/\s+/g, '_')}_${startDate}_to_${endDate}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Add header layout (left side - gym name, right side - contact info)
    try {
        // Left side - Gym name and tagline
        doc.fontSize(16).font('Helvetica-Bold').text(displayGymName, 100, 45);
        doc.fontSize(10).font('Helvetica').text('Professional Fitness Services', 100, 65, { color: '#555555' });

        // Right side - Contact information aligned right
        const rightMargin = 130;
        const pageWidth = doc.page.width - doc.page.margins.right - rightMargin;
        doc.fontSize(10).font('Helvetica').text(address, pageWidth, 45, { align: 'right' });
        doc.fontSize(10).font('Helvetica').text(email, pageWidth, 60, { align: 'right' });
        doc.fontSize(10).font('Helvetica').text(phone, pageWidth, 75, { align: 'right' });

        // Add logo if provided
        if (defaultLogoPath) {
            try {
                doc.image(defaultLogoPath, 50, 38, { width: 40, height: 40 });
            } catch (logoErr) {
                // Logo failed to load - already handled by displaying text only
            }
        }
    } catch (err) {
        // Fallback if header fails
        doc.fontSize(16).font('Helvetica-Bold').text(displayGymName, 50, 45);
    }

    // Add horizontal line
    doc.moveTo(50, 90).lineTo(doc.page.width - 50, 90).stroke();
    doc.moveDown(1);

    // Add title and date range
    const titleY = 120;
    doc.fontSize(16).font('Helvetica-Bold').text(title, 50, titleY, { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(`Period: ${startDate} to ${endDate}`, 50, titleY + 20, { align: 'center' });
    doc.moveDown(2);

    // Add summary section with enhanced styling
    if (data && data.length > 0) {
        if (title === 'Membership Report') {
            // Calculate member stats
            const activeMembers = data.filter(item => item.status === 'Active').length;
            const expiredMembers = data.filter(item => item.status === 'Expired').length;

            // Layout constants
            const summaryY = doc.y + 10;
            const summaryBoxWidth = (doc.page.width - 120) / 2.5; // Make summary box smaller
            const chartBoxWidth = (doc.page.width - 120) * 0.6; // Make chart area larger
            const chartX = 60 + summaryBoxWidth + 10; // Right of summary box

            // Draw summary box (left) with improved styling
            doc.roundedRect(60, summaryY, summaryBoxWidth, 70, 5).fillAndStroke('#f8f8f8', '#aaaaaa');

// Add title with better positioning
            doc.font('Helvetica-Bold').fontSize(13).fillColor('#333333')
                .text('MEMBERSHIP SUMMARY', 75, summaryY + 14, { align: 'center', width: summaryBoxWidth - 30 });

// Create consistent column layout for stats
            const leftColX = 80;
            const rightColX = leftColX + 90;

// Add stats with improved alignment
            doc.fontSize(11).fillColor('#555555')
                .text(`Total Members:`, leftColX, summaryY + 35)
                .text(`${data.length}`, rightColX, summaryY + 35)
                .text(`Active:`, leftColX, summaryY + 50)
                .text(`${activeMembers}`, rightColX, summaryY + 50)
                .text(`Expired:`, leftColX, summaryY + 65)
                .text(`${expiredMembers}`, rightColX, summaryY + 65);


            // Generate pie chart
            // Generate pie chart with increased dimensions
            const chartJSNodeCanvas = new ChartJSNodeCanvas({
                type: 'png',
                width: 400,  // Increased from 250
                height: 250, // Increased from 120
                backgroundColour: 'white'
            });

            const chartConfig = {
                type: 'pie',
                data: {
                    labels: ['Active', 'Expired'],
                    datasets: [{
                        data: [activeMembers, expiredMembers],
                        backgroundColor: ['#4caf50', '#f44336'],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Membership Status',
                            font: { size: 16 }  // Slightly larger title
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 14  // Larger legend text
                                },
                                padding: 15   // More padding around legend items
                            }
                        }
                    },
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 10
                        }
                    },
                    maintainAspectRatio: false  // Allows custom height/width ratio
                }
            };


            const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
            const tempImg = tmp.fileSync({ postfix: ".png" });
            fs.writeFileSync(tempImg.name, imageBuffer);

            // Draw chart (right)
            // Draw chart (right) with better sizing
            doc.image(tempImg.name, chartX, summaryY, {
                fit: [chartBoxWidth, 80],  // Increased height from 60
                align: 'center',
                valign: 'top'
            });


            doc.moveDown(5);
        }
        else {
            // For attendance report
            const checkedIn = data.length;
            const attendanceRate = Math.round((checkedIn / totalActiveMembers) * 100);

            // Summary box with enhanced styling
            const summaryY = doc.y + 10;

// Add a shadow effect first (optional)
            doc.rect(52, summaryY + 2, doc.page.width - 100, 40).fill('#e0e0e0');

// Main box with rounded corners
            doc.roundedRect(50, summaryY, doc.page.width - 100, 40, 5).fillAndStroke('#f8f8f8', '#aaaaaa');

// Title with more emphasis
            doc.font('Helvetica-Bold').fontSize(11).fillColor('#333333')
                .text('ATTENDANCE SUMMARY', 70, summaryY + 14);

// Data with better spacing and slightly larger font
            const x_total = 220;
            const x_checkedIn = x_total + 115;
            const x_attendanceRate = x_checkedIn + 100;

            doc.fontSize(10).fillColor('#555555')
                .text(`Total Members: ${totalActiveMembers}`, x_total, summaryY + 14);
            doc.text(`Checked In: ${checkedIn}`, x_checkedIn, summaryY + 14);
            doc.text(`Attendance Rate: ${attendanceRate}%`, x_attendanceRate, summaryY + 14);

            doc.moveDown(3);

        }
    }

    // Style customization for table
    const columnSpacing = 10;
    const columnWidths = {};
    const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

    // Format headers properly
    const formattedHeaders = headers.map(key => {
        let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

        // Custom labels based on report type
        if (title === 'Membership Report') {
            if (key === 'member_id') label = 'Member ID';
            if (key === 'full_name') label = 'Member Name';
            if (key === 'membership_type') label = 'Plan';
            if (key === 'start_date') label = 'Start Date';
            if (key === 'end_date') label = 'End Date';
            if (key === 'status') label = 'Status';
        } else {
            if (key === 'attendance_date') label = 'Date';
            if (key === 'member_id') label = 'Member ID';
            if (key === 'full_name') label = 'Member Name';
            if (key === 'attended') label = 'Status';
        }

        // Estimate width based on label + data
        let maxWidth = label.length * 7 + 10;

        if (data && data.length > 0) {
            data.forEach(item => {
                const value = item[key] ? item[key].toString() : '';
                const valueWidth = value.length * 5.5 + 10;
                maxWidth = Math.max(maxWidth, valueWidth);
            });
        }

        // Force reasonable minimum widths based on report type
        if (title === 'Membership Report') {
            if (key === 'member_id') maxWidth = 50;
            if (key === 'full_name') maxWidth = 125;
            if (key === 'membership_type') maxWidth = 80;
            if (key === 'start_date') maxWidth = 80;
            if (key === 'end_date') maxWidth = 80;
            if (key === 'status') maxWidth = 80;
        } else {
            if (key === 'attendance_date') maxWidth = 160;
            if (key === 'member_id') maxWidth = 90;
            if (key === 'full_name') maxWidth = 150;
            if (key === 'attended') maxWidth = 95;
        }

        columnWidths[key] = maxWidth;

        return {
            label: label,
            property: key,
            width: maxWidth,
            headerColor: "#1E5D8C",
            headerOpacity: 1,
            align: 'center'
        };
    });

    // Create table rows
    const rows = [];
    if (data && data.length > 0) {
        data.forEach(item => {
            const row = [];
            headers.forEach(key => {
                let value = item[key];
                if (value !== null && value !== undefined) {
                    if (key === 'attended') {
                        value = value.toString() === 'Present' ? 'Present' : 'Present';
                    } else if (key === 'start_date' || key === 'end_date' || key === 'attendance_date') {
                        const dateObj = new Date(value);
                        value = `${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`;
                    }
                    row.push(value.toString());
                }
            });
            rows.push(row);
        });
    }

    // Calculate actual table width dynamically
    const totalColumnWidth = Object.values(columnWidths).reduce((a, b) => a + b, 0);
    const totalSpacing = (formattedHeaders.length - 1) * columnSpacing;
    const finalTableWidth = totalColumnWidth + totalSpacing;

    // Render table
    if (formattedHeaders.length > 0) {
        const table = {
            headers: formattedHeaders,
            rows: rows,
            prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF'),
            prepareRow: (row, indexColumn, indexRow, rectRow) => {
                doc.font('Helvetica').fontSize(9).fillColor('#333333');
                doc.addBackground(rectRow, indexRow % 2 ? "#FFFFFF" : "#F5F9FC", 1);
            }
        };

        doc.table(table, {
            prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF'),
            prepareRow: (row, indexColumn, indexRow, rectRow) => {
                doc.font('Helvetica').fontSize(9).fillColor('#333333');
                indexColumn === 0 && doc.addBackground(rectRow, indexRow % 2 ? "#FFFFFF" : "#F5F9FC", 1);
            },
            x: 50,
            columnSpacing: columnSpacing,
            width: finalTableWidth
        });
    } else {
        doc.text('No data available for the selected period.', 50, doc.y + 20);
    }

    // Add footer with line and date
    const pageCount = doc.bufferedPageRange().count;
    const today = new Date().toLocaleDateString();

    for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        const footerY = doc.page.height - 50;
        doc.moveTo(50, footerY).lineTo(doc.page.width - 50, footerY).stroke();
        doc.fontSize(8).text(`Generated on: ${today}`, 50, footerY + 10, {
            height: 20,
            width: doc.page.width - 100,
            align: 'left'
        });
    }
    doc.end();
}


function generateExcel(res, data, title, startDate, endDate, type) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    const headers = Object.keys(data[0]).map(key =>
        key.charAt(0).toUpperCase() + key.slice(1)
    );
    worksheet.addRow(headers);

    data.forEach(row => {
        worksheet.addRow(Object.values(row));
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${startDate}_to_${endDate}.xlsx`);

    workbook.xlsx.write(res).then(() => res.end());
}

function generateCSV(res, data, type, startDate, endDate) {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${startDate}_to_${endDate}.csv`);
    res.send(csv);
}
