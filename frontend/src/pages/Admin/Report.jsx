import React, { useState, useEffect } from "react";
import { Calendar, Download, FileText, Users, CreditCard, File } from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";
import axios from "axios";
import {
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import Logo from "@/assets/images/logo.png";

function ReportDashboard() {
    const [reportType, setReportType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [exportFormat, setExportFormat] = useState("pdf");
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [totalActiveMembers, setTotalActiveMembers] = useState(0);

    // Fetch total active members
    useEffect(() => {
        axios.get("http://localhost:8800/api/dash/totalActiveMember")
            .then(response => {
                setTotalActiveMembers(response.data.total_active_members);
            })
            .catch(error => {
                console.error("Error fetching total active members:", error);
            });
    }, []);

    const handleGeneratePreview = async () => {
        if (!reportType || !startDate || !endDate) {
            alert("Please select report type and date range");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get('http://localhost:8800/api/reports/download', {
                params: {
                    type: reportType,
                    startDate: startDate,
                    endDate: endDate,
                    format: 'pdf'
                },
                responseType: 'blob'
            });

            // Create a blob URL for the PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
            setLoading(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF preview');
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!pdfUrl) return;

        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `${reportType}_report_${startDate}_to_${endDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getReportTitle = () => {
        switch(reportType) {
            case "attendance": return "Attendance Report";
            case "membership": return "Membership Report";
            case "revenue": return "Monthly Revenue Report";
            default: return "Select Report Type";
        }
    };

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", scrollbarWidth: "none", marginLeft: "-45px", marginTop: "10px" }}>
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4 mt-5" style={{ marginRight: "-5px" }}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#2D3748" }}>
                        Generate Report
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Report Type</InputLabel>
                            <Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                label="Report Type"
                            >
                                <MenuItem value="attendance">Attendance Report</MenuItem>
                                <MenuItem value="membership">Membership Report</MenuItem>
                                <MenuItem value="revenue">Monthly Revenue Report</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            fullWidth
                        />

                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            fullWidth
                        />
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Export Format</InputLabel>
                                <Select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    label="Export Format"
                                >
                                    <MenuItem value="pdf">PDF</MenuItem>
                                    <MenuItem value="xlsx">Excel</MenuItem>
                                    <MenuItem value="csv">CSV</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <Button
                            variant="contained"
                            onClick={handleGeneratePreview}
                            disabled={!reportType || !startDate || !endDate || loading}
                            className="bg-red-900 hover:bg-red-800"
                            sx={{ bgcolor: "#7f1d1d", "&:hover": { bgcolor: "#9b2c2c" } }}
                        >
                            {loading ? "Generating..." : "Generate Preview"}
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow mb-4" style={{ marginRight: "-5px" }}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h6" sx={{ color: "#2D3748" }}>
                                {getReportTitle()}
                            </Typography>

                            {pdfUrl && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Download size={16} />}
                                    onClick={handleDownload}
                                    sx={{ borderColor: "#CBD5E0", color: "#4A5568" }}
                                >
                                    Download PDF
                                </Button>
                            )}
                        </div>

                        {!pdfUrl && !loading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <FileText size={64} className="text-gray-300 mb-4" />
                                <p className="text-gray-500">Generate a report to preview the PDF</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-center py-12">
                                <p className="text-gray-500">Generating PDF preview...</p>
                            </div>
                        )}

                        {pdfUrl && (
                            <div style={{ height: "70vh", width: "100%" }}>
                                <iframe
                                    src={pdfUrl}
                                    style={{ width: "100%", height: "100%", border: "none" }}
                                    title="PDF Preview"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportDashboard;
