import {db} from "../config/connectDatabase.js";
// import PDFDocument from 'pdfkit';
import PDFDocument from 'pdfkit-table';
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from "axios";

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import  {ChartJSNodeCanvas} from 'chartjs-node-canvas';
import tmp from 'tmp';
import fs from 'fs';

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
        case 'revenue':
            fetchDataFn = getRevenueData;
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
        case 'revenue':
            fetchDataFn = getRevenueData;
            reportTitle = 'Monthly Revenue Report';
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

function getAttendanceData(startDate, endDate, callback) {
    const query = `SELECT attendance.attendance_date, gym_members.member_id, users.full_name, attendance.attended
                   FROM attendance
                            JOIN gym_members ON gym_members.member_id = attendance.member_id
                            JOIN users ON gym_members.user_id = users.id
                   WHERE DATE(attendance.attendance_date) BETWEEN ? AND ?
                   ORDER BY attendance.attendance_date ASC;
    `;

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

// Add this function to fetch revenue data
function getRevenueData(startDate, endDate, callback) {
    const query = `SELECT
                       p.payment_id as id,
                       u.full_name as name,
                       pl.plan_name as plan,
                       p.amount,
                       p.payment_date,
                       p.payment_method,
                       'plan_payment' as payment_type
                   FROM plan_payments p
                            JOIN gym_members gm ON p.member_id = gm.member_id
                            JOIN users u ON gm.user_id = u.id
                            JOIN plans pl ON gm.plan_id = pl.plan_id
                   WHERE DATE(p.payment_date) BETWEEN ? AND ?

                   UNION ALL

    SELECT
        sp.payment_id as id,
        u.full_name as name,
        s.supplement_name as plan,
        sp.amount,
        sp.payment_date,
        sp.payment_method,
        'supplement_payment' as payment_type
    FROM supplement_payments sp
             JOIN users u ON sp.user_id = u.id
             JOIN supplements s ON sp.supplement_id = s.supplement_id
    WHERE DATE(sp.payment_date) BETWEEN ? AND ?

    ORDER BY payment_date DESC`;

    db.query(query, [startDate, endDate, startDate, endDate], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        // Separate results by payment type for summary calculations
        const planPayments = results.filter(payment => payment.payment_type === 'plan_payment');
        const supplementPayments = results.filter(payment => payment.payment_type === 'supplement_payment');

        // Calculate totals
        const totalRevenue = results.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const planRevenue = planPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const supplementRevenue = supplementPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

        // Return a single data structure with all payments and summary information
        callback(null, {
            allPayments: results,
            planPayments: planPayments,
            supplementPayments: supplementPayments,
            summary: {
                totalRevenue: totalRevenue.toFixed(2),
                planRevenue: planRevenue.toFixed(2),
                supplementRevenue: supplementRevenue.toFixed(2),
                paymentCount: results.length,
                planPaymentCount: planPayments.length,
                supplementPaymentCount: supplementPayments.length
            }
        });
    });
}




// ------------------------------------
// Report File Generators
// ------------------------------------

// Report File Generators
async function generatePDF(res, data, title, startDate, endDate, gymName, logoPath, contactInfo = {}) {
    // Default contact info
    const defaultLogoPath = path.join(__dirname, '..', 'public', 'logo.png');
    const address = contactInfo.address || 'Sarayadi,PointPedro';
    const email = contactInfo.email || 'jkfitnessppt@gmail.com';
    const phone = contactInfo.phone || '077 529 8455';

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

    // Add SUMMARY SECTION TOPIC with underline
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
        .text('Summary Overview', 50, doc.y + 20, { align: 'left' });

    // Add underline below the heading
    const summaryHeadingWidth = doc.widthOfString('Summary Overview');
    doc.moveTo(50, doc.y).lineTo(50 + summaryHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
    doc.moveDown(1);

    // Add summary section with a card-like design
    if (title === 'Monthly Revenue Report' || title === 'Revenue Report') {
        // Revenue Report Summary with Cards
        const summaryY = doc.y + 20;
        const cardWidth = 160;
        const cardHeight = 70;
        const spacing = 20;

        // For Revenue Report, we expect data to have a summary object
        if (data && data.summary) {
            // Card 1: Total Revenue
            doc.save()
                .rect(50 + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50, summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50, summaryY, cardWidth, 10).fill('#3F51B5');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('TOTAL REVENUE', 60, summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(`Rs.${data.summary.totalRevenue}`, 60, summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text('All Payments', 60, summaryY + 45);

            // Card 2: Plan Revenue
            doc.save()
                .rect(50 + cardWidth + spacing + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50 + cardWidth + spacing, summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50 + cardWidth + spacing, summaryY, cardWidth, 10).fill('#306c32');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('PLAN REVENUE', 60 + cardWidth + spacing, summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(`Rs.${data.summary.planRevenue}`, 60 + cardWidth + spacing, summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text(`${data.summary.planPaymentCount} Payments`, 60 + cardWidth + spacing, summaryY + 45);

            // Card 3: Supplement Revenue
            doc.save()
                .rect(50 + 2 * (cardWidth + spacing) + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50 + 2 * (cardWidth + spacing), summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50 + 2 * (cardWidth + spacing), summaryY, cardWidth, 10).fill('#ac281f');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('SUPPLEMENT REVENUE', 60 + 2 * (cardWidth + spacing), summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(`Rs.${data.summary.supplementRevenue}`, 60 + 2 * (cardWidth + spacing), summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text(`${data.summary.supplementPaymentCount} Payments`, 60 + 2 * (cardWidth + spacing), summaryY + 45);

            doc.moveDown(6);
        }
    } else if (title === 'Membership Report') {
        if (data && data.length > 0) {
            const activeMembers = data.filter(item => item.status === 'Active').length;
            const expiredMembers = data.filter(item => item.status === 'Expired').length;
            const summaryY = doc.y + 20;
            const cardWidth = 160;
            const cardHeight = 70;
            const spacing = 20;

            // Card 1: Total Members
            doc.save()
                .rect(50 + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore(); // Shadow effect
            doc.rect(50, summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50, summaryY, cardWidth, 10).fill('#3F51B5'); // Colored header strip
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('TOTAL MEMBERS', 60, summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(totalActiveMembers, 60, summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text('All Members', 60, summaryY + 45);

            // Card 2: Active Members
            doc.save()
                .rect(50 + cardWidth + spacing + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50 + cardWidth + spacing, summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50 + cardWidth + spacing, summaryY, cardWidth, 10).fill('#306c32');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('ACTIVE', 60 + cardWidth + spacing, summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(activeMembers, 60 + cardWidth + spacing, summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text('Current Members', 60 + cardWidth + spacing, summaryY + 45);

            // Card 3: Expired Members
            doc.save()
                .rect(50 + 2 * (cardWidth + spacing) + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50 + 2 * (cardWidth + spacing), summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50 + 2 * (cardWidth + spacing), summaryY, cardWidth, 10).fill('#ac281f');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('EXPIRED', 60 + 2 * (cardWidth + spacing), summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(expiredMembers, 60 + 2 * (cardWidth + spacing), summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text('Past Members', 60 + 2 * (cardWidth + spacing), summaryY + 45);

            doc.moveDown(6);
        }
    } else if (title === 'Attendance Report') {
        // Attendance Report Summary with Cards
        if (data && data.length > 0) {
            const checkedIn = data.length;
            const attendanceRate = Math.round((checkedIn / (totalActiveMembers * 30)) * 100);
            const summaryY = doc.y;
            const cardWidth = 150;
            const cardHeight = 70;
            const spacing = 20;

            // Card 1: Total Members
            doc.save()
                .rect(50 + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50, summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50, summaryY, cardWidth, 10).fill('#234a71');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('TOTAL MEMBERS', 60, summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(totalActiveMembers, 60, summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text('All Members', 60, summaryY + 45);

            // Card 2: Checked In
            doc.save()
                .rect(50 + cardWidth + spacing + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50 + cardWidth + spacing, summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50 + cardWidth + spacing, summaryY, cardWidth, 10).fill('#234a71');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('CHECKED IN', 60 + cardWidth + spacing, summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(checkedIn, 60 + cardWidth + spacing, summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text('Attendance Count', 60 + cardWidth + spacing, summaryY + 45);

            // Card 3: Attendance Rate
            doc.save()
                .rect(50 + 2 * (cardWidth + spacing) + 2, summaryY + 2, cardWidth, cardHeight)
                .fillOpacity(0.1)
                .fill('#000000')
                .restore();
            doc.rect(50 + 2 * (cardWidth + spacing), summaryY, cardWidth, cardHeight).fill('#FFFFFF').stroke('#CCCCCC');
            doc.rect(50 + 2 * (cardWidth + spacing), summaryY, cardWidth, 10).fill('#234a71');
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
                .text('ATTENDANCE RATE', 60 + 2 * (cardWidth + spacing), summaryY + 2);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#333333')
                .text(`${attendanceRate}%`, 60 + 2 * (cardWidth + spacing), summaryY + 25);
            doc.font('Helvetica').fontSize(9).fillColor('#666666')
                .text('Monthly Rate', 60 + 2 * (cardWidth + spacing), summaryY + 45);

            doc.moveDown(6);
        }
    }

    // Add Revenue Trend Chart for Revenue Report
    if (title === 'Monthly Revenue Report' || title === 'Revenue Report') {
        try {
            // Add CHART SECTION TOPIC with underline
            doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
                .text('Revenue Analytics', 50, doc.y + 10, { align: 'left' });

            const chartHeadingWidth = doc.widthOfString('Revenue Analytics');
            doc.moveTo(50, doc.y).lineTo(50 + chartHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
            doc.moveDown(1);

            // Initialize ChartJSNodeCanvas
            const width = 500;
            const height = 300;
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

            // Process data for chart
            const revenueByDate = {};
            const planRevenueByDate = {};
            const supplementRevenueByDate = {};

            // Initialize all dates in range
            const start = new Date(startDate);
            const end = new Date(endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                revenueByDate[dateStr] = 0;
                planRevenueByDate[dateStr] = 0;
                supplementRevenueByDate[dateStr] = 0;
            }

            // Populate revenue data by date
            if (data.allPayments && data.allPayments.length > 0) {
                data.allPayments.forEach(payment => {
                    if (payment && payment.payment_date) {
                        const date = new Date(payment.payment_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short'
                        });

                        const amount = parseFloat(payment.amount);
                        revenueByDate[date] = (revenueByDate[date] || 0) + amount;

                        if (payment.payment_type === 'plan_payment') {
                            planRevenueByDate[date] = (planRevenueByDate[date] || 0) + amount;
                        } else {
                            supplementRevenueByDate[date] = (supplementRevenueByDate[date] || 0) + amount;
                        }
                    }
                });
            }

            // Create labels and data arrays
            const labels = Object.keys(revenueByDate).sort((a, b) => {
                const dateA = new Date(a.split(' ')[1] + ' ' + a.split(' ')[0] + ' ' + new Date().getFullYear());
                const dateB = new Date(b.split(' ')[1] + ' ' + b.split(' ')[0] + ' ' + new Date().getFullYear());
                return dateA - dateB;
            });

            const totalRevenueData = labels.map(date => revenueByDate[date]);
            const planRevenueData = labels.map(date => planRevenueByDate[date]);
            const supplementRevenueData = labels.map(date => supplementRevenueByDate[date]);

            // Chart configuration
            const configuration = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Revenue',
                            data: totalRevenueData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Plan Revenue',
                            data: planRevenueData,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Supplement Revenue',
                            data: supplementRevenueData,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Revenue (Rs)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Revenue Trend Over Time'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            };

            // Render chart to buffer
            const chartBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

            // Add chart to PDF
            const chartY = doc.y + 20;
            doc.image(chartBuffer, 50, chartY, { width: 500, height: 300 });

            doc.moveDown(26);

            // Add payment distribution pie chart
            doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
                .text('Payment Distribution', 50, doc.y + 20, { align: 'left' });

            const pieHeadingWidth = doc.widthOfString('Payment Distribution');
            doc.moveTo(50, doc.y).lineTo(50 + pieHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
            doc.moveDown(1);

            // Data for pie chart
            const pieData = [
                parseFloat(data.summary.planRevenue),
                parseFloat(data.summary.supplementRevenue)
            ];

            // Pie chart configuration
            const pieConfiguration = {
                type: 'pie',
                data: {
                    labels: ['Plan Payments', 'Supplement Payments'],
                    datasets: [{
                        data: pieData,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(255, 99, 132, 0.8)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 15,
                                padding: 15
                            }
                        },
                        title: {
                            display: true,
                            text: 'Revenue Distribution by Payment Type',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            };

            // Render chart to buffer
            const pieChartBuffer = await chartJSNodeCanvas.renderToBuffer(pieConfiguration);

            // Add chart to PDF
            const pieChartY = doc.y + 20;
            doc.image(pieChartBuffer, 50, pieChartY, { width: 500, height: 300 });

            doc.moveDown(9);
        } catch (chartError) {
            console.error('Error generating revenue charts:', chartError);
            doc.fontSize(10).fillColor('#FF0000').text('Unable to generate revenue charts.', 50, doc.y + 20);
            doc.moveDown(2);
        }
    }
    // Add Attendance Trend Chart below the cards for Attendance Report
    else if (title === 'Attendance Report') {
        try {
            // Add CHART SECTION TOPIC with underline
            doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
                .text('Attendance Analytics', 50, doc.y + 10, { align: 'left' });

            // Add underline below the heading
            const chartHeadingWidth = doc.widthOfString('Attendance Analytics');
            doc.moveTo(50, doc.y).lineTo(50 + chartHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
            doc.moveDown(1);

            // Initialize ChartJSNodeCanvas for server-side chart rendering
            const width = 500; // Canvas width in pixels
            const height = 300; // Canvas height in pixels
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

            // Process data to create labels and counts for the chart - FIXED VERSION
            const attendanceByDate = {};
            let totalChartAttendance = 0;

            // First pass: initialize all dates in the range with zero
            const start = new Date(startDate);
            const end = new Date(endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                attendanceByDate[dateStr] = 0;
            }

            // Second pass: count attendance for each date
            data.forEach(item => {
                if (item && item.attendance_date) {
                    const date = new Date(item.attendance_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short'
                    });

                    // Increment regardless of attended status - adjust this logic if needed
                    // based on how your 'attended' field is structured
                    if (item.attended === 1 || item.attended === '1' ||
                        item.attended === true || item.attended === 'Present') {
                        attendanceByDate[date]++;
                        totalChartAttendance++;
                    }
                }
            });

            // Verify total matches
            console.log(`Chart total attendance: ${totalChartAttendance}, Card total: ${data.length}`);

            // Create labels and data arrays for the chart
            const labels = Object.keys(attendanceByDate).sort((a, b) => {
                // Sort dates properly
                const dateA = new Date(a.split(' ')[1] + ' ' + a.split(' ')[0] + ' ' + new Date().getFullYear());
                const dateB = new Date(b.split(' ')[1] + ' ' + b.split(' ')[0] + ' ' + new Date().getFullYear());
                return dateA - dateB;
            });
            const attendanceCounts = labels.map(date => attendanceByDate[date]);

            // Chart configuration for a bar chart - IMPROVED VERSION
            const configuration = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Attendance',
                        data: attendanceCounts,
                        backgroundColor: 'rgba(0, 102, 204, 0.7)', // Solid blue for bars
                        borderColor: 'rgba(0, 102, 204, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Attendees'
                            },
                            ticks: {
                                stepSize: 1,
                                precision: 0 // Force integer ticks
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Attendance Trend Over Time'
                        },
                        tooltip: {
                            callbacks: {
                                title: function(tooltipItems) {
                                    return tooltipItems[0].label;
                                },
                                label: function(context) {
                                    return `Attendees: ${context.parsed.y}`;
                                }
                            }
                        }
                    }
                }
            };

            // Render chart to buffer (PNG image)
            const chartBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

            // Add chart title and image to PDF below the cards
            const chartY = doc.y + 20;
            doc.moveDown(chartY);
            doc.image(chartBuffer, 50, chartY, { width: 500, height: 300 });

            doc.moveDown(6);
        } catch (chartError) {
            console.error('Error generating bar chart:', chartError);
            doc.fontSize(10).fillColor('#FF0000').text('Unable to generate attendance bar chart.', 50, doc.y + 20);
            doc.moveDown(2);
        }
    }
    // Add Membership Distribution Pie Chart for Membership Report
    else if (title === 'Membership Report') {
        try {
            // Add CHART SECTION TOPIC with underline
            doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
                .text('Membership Distribution', 50, doc.y + 20, { align: 'left' });

            // Add underline below the heading
            const chartHeadingWidth = doc.widthOfString('Membership Distribution');
            doc.moveTo(50, doc.y).lineTo(50 + chartHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
            doc.moveDown(1);

            // Initialize ChartJSNodeCanvas for server-side chart rendering
            const width = 500; // Canvas width in pixels
            const height = 300; // Canvas height in pixels
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

            // Process data to create pie chart data
            // Option 1: Distribution by membership type
            const membershipTypes = {};
            data.forEach(item => {
                if (item && item.membership_type) {
                    membershipTypes[item.membership_type] = membershipTypes[item.membership_type] || 0;
                    membershipTypes[item.membership_type]++;
                }
            });

            // Option 2: Distribution by status (Active vs Expired)
            const statusDistribution = {
                'Active': data.filter(item => item.status === 'Active').length,
                'Expired': data.filter(item => item.status === 'Expired').length
            };

            // Create labels and data arrays for the chart
            const typeLabels = Object.keys(membershipTypes);
            const typeCounts = typeLabels.map(type => membershipTypes[type]);

            // Create color array - one color for each membership type
            const backgroundColors = [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(199, 199, 199, 0.8)',
                'rgba(83, 102, 255, 0.8)',
                'rgba(40, 159, 64, 0.8)',
                'rgba(210, 199, 199, 0.8)'
            ];

            // Pie chart configuration for membership types
            const typeConfiguration = {
                type: 'pie',
                data: {
                    labels: typeLabels,
                    datasets: [{
                        data: typeCounts,
                        backgroundColor: backgroundColors.slice(0, typeLabels.length),
                        borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 15,
                                padding: 15
                            }
                        },
                        title: {
                            display: true,
                            text: 'Membership Types Distribution',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            };

            // Render chart to buffer (PNG image)
            const chartBuffer = await chartJSNodeCanvas.renderToBuffer(typeConfiguration);

            // Add chart image to PDF
            const chartY = doc.y + 20;
            doc.image(chartBuffer, 50, chartY, { width: 500, height: 300 });

            doc.moveDown(15);
        } catch (chartError) {
            console.error('Error generating pie chart:', chartError);
            doc.fontSize(10).fillColor('#FF0000').text('Unable to generate membership distribution chart.', 50, doc.y + 20);
            doc.moveDown(2);
        }
    }

    doc.moveDown(15);

    // Add TABLE SECTION TOPIC with underline
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
        .text('Detailed Data', 50, doc.y + 20, { align: 'left' });

    // Add underline below the heading
    const tableHeadingWidth = doc.widthOfString('Detailed Data');
    doc.moveTo(50, doc.y).lineTo(50 + tableHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
    doc.moveDown(1);

    // Handle table data based on report type
    // Handle table data for Revenue Report with separate tables
    if (title === 'Monthly Revenue Report' || title === 'Revenue Report') {
        // Add TABLE SECTION TOPIC with underline for Plan Payments
        doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
            .text('Plan Payment Details', 50, doc.y + 20, { align: 'left' });

        // Add underline below the heading
        const planTableHeadingWidth = doc.widthOfString('Plan Payment Details');
        doc.moveTo(50, doc.y).lineTo(50 + planTableHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
        doc.moveDown(1);

        // Create table for plan payment data
        if (data.planPayments && data.planPayments.length > 0) {
            const planTableData = data.planPayments.map(payment => ({
                id: payment.id,
                name: payment.name,
                plan: payment.plan,
                amount: `Rs.${parseFloat(payment.amount).toFixed(2)}`,
                date: new Date(payment.payment_date).toLocaleDateString(),
                method: payment.payment_method
            }));

            // Define table columns for plan payments
            const planTableColumns = [
                { header: 'ID', key: 'id', width: 40 },
                { header: 'Member', key: 'name', width: 120 },
                { header: 'Plan', key: 'plan', width: 120 },
                { header: 'Amount', key: 'amount', width: 80 },
                { header: 'Date', key: 'date', width: 80 },
                { header: 'Method', key: 'method', width: 80 }
            ];

            // Create table
            const planTable = {
                headers: planTableColumns.map(col => ({
                    label: col.header,
                    property: col.key,
                    width: col.width,
                    headerColor: "#1e5d8c",
                    headerOpacity: 1,
                    align: 'left'
                })),
                rows: planTableData.map(row =>
                    planTableColumns.map(col => row[col.key])
                )
            };

            // Add table to PDF
            doc.table(planTable, {
                prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF'),
                prepareRow: (row, indexColumn, indexRow, rectRow) => {
                    doc.font('Helvetica').fontSize(9).fillColor('#333333');
                    indexColumn === 0 && doc.addBackground(rectRow, indexRow % 2 ? "#FFFFFF" : "#F5F9FC", 1);
                },
                x: 50,
                columnSpacing: 5
            });
        } else {
            doc.text('No plan payment data available for the selected period.', 50, doc.y + 20);
        }

        doc.moveDown(20);

        // Add TABLE SECTION TOPIC with underline for Supplement Payments
        doc.fontSize(13).font('Helvetica-Bold').fillColor('#234a71')
            .text('Supplement Payment Details', 50, doc.y + 20, { align: 'left' });

        // Add underline below the heading
        const supplementTableHeadingWidth = doc.widthOfString('Supplement Payment Details');
        doc.moveTo(50, doc.y).lineTo(50 + supplementTableHeadingWidth, doc.y).lineWidth(1).stroke('#234a71');
        doc.moveDown(1);

        // Create table for supplement payment data
        if (data.supplementPayments && data.supplementPayments.length > 0) {
            const supplementTableData = data.supplementPayments.map(payment => ({
                id: payment.id,
                name: payment.name,
                supplement: payment.plan,
                amount: `Rs.${parseFloat(payment.amount).toFixed(2)}`,
                date: new Date(payment.payment_date).toLocaleDateString(),
                method: payment.payment_method
            }));

            // Define table columns for supplement payments
            const supplementTableColumns = [
                { header: 'ID', key: 'id', width: 40 },
                { header: 'Member', key: 'name', width: 120 },
                { header: 'Supplement', key: 'supplement', width: 120 },
                { header: 'Amount', key: 'amount', width: 80 },
                { header: 'Date', key: 'date', width: 80 },
                { header: 'Method', key: 'method', width: 80 }
            ];

            // Create table
            const supplementTable = {
                headers: supplementTableColumns.map(col => ({
                    label: col.header,
                    property: col.key,
                    width: col.width,
                    headerColor: "#1e5d8c",
                    headerOpacity: 1,
                    align: 'left'
                })),
                rows: supplementTableData.map(row =>
                    supplementTableColumns.map(col => row[col.key])
                )
            };

            // Add table to PDF
            doc.table(supplementTable, {
                prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF'),
                prepareRow: (row, indexColumn, indexRow, rectRow) => {
                    doc.font('Helvetica').fontSize(9).fillColor('#333333');
                    indexColumn === 0 && doc.addBackground(rectRow, indexRow % 2 ? "#FFFFFF" : "#F5F9FC", 1);
                },
                x: 50,
                columnSpacing: 5
            });
        } else {
            doc.text('No supplement payment data available for the selected period.', 50, doc.y + 20);
        }
    }
    else {
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

        // Render table with modern grid design
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
    }

    // Add footer with line, page numbers, and brand name
    const pageCount = doc.bufferedPageRange().count;
    const today = new Date().toLocaleDateString();

    for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        const footerY = doc.page.height - 70;

        // Add "Generated on" text only on the last page, above the footer line on the right side
        if (i === pageCount - 1) {
            doc.fontSize(8).font('Helvetica').fillColor('#666666')
                .text(`Generated on: ${today}`, doc.page.width - 150, footerY - 15, {
                    width: 100,
                    align: 'right'
                });
        }

        // Add horizontal line above footer
        doc.moveTo(50, footerY).lineTo(doc.page.width - 50, footerY).stroke();

        // Create footer with three columns: brand name, date, page numbers
        const footerWidth = doc.page.width - 100; // Total width minus margins
        const columnWidth = footerWidth / 3;

        // Left column: Brand name
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#234a71')
            .text('JK FITNESS', 50, footerY + 10, {
                width: columnWidth,
                align: 'left'
            });

        // Right column: Page numbers
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#333333')
            .text(`Page ${i + 1} of ${pageCount}`, 50 + 2 * columnWidth, footerY + 10, {
                width: columnWidth,
                align: 'right'
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
