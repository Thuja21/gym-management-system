import { useState } from "react";
import AdminSideBar from "@/pages/Admin/AdminSideBar.jsx";

const REPORT_TYPES = [
    { value: "attendance", label: "Attendance" },
    { value: "membership", label: "Membership" },
    { value: "payment", label: "Payment" },
];

function ReportDashboard() {
    const [reportType, setReportType] = useState("attendance");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <div className="min-h-screen width-[100vw] bg-gray-50 p-6 flex flex-col items-center">
<AdminSideBar/>
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-4 text-center">Gym Reports (Admin)</h1>

                {/* Filter Section */}
                <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Report Type */}
                    <div>
                        <label className="font-medium mr-2">Report:</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                            {REPORT_TYPES.map((rt) => (
                                <option key={rt.value} value={rt.value}>
                                    {rt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <label className="font-medium">From:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                        <label className="font-medium">To:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>

                    {/* Generate Button */}
                    <button className="bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700">
                        Generate
                    </button>
                </div>

                {/* Report Content */}
                <div className="bg-white shadow rounded-lg p-6 min-h-[400px] flex flex-col gap-6">
                    {/* Chart Placeholder */}
                    <div>
                        <div className="font-semibold mb-2">
                            {REPORT_TYPES.find(r => r.value === reportType)?.label} Report Chart
                        </div>
                        <div className="h-48 flex items-center justify-center text-gray-400 border rounded bg-gray-100 select-none">
                            [Chart goes here]
                        </div>
                    </div>

                    {/* Table Placeholder */}
                    <div>
                        <div className="font-semibold mb-2">
                            {REPORT_TYPES.find(r => r.value === reportType)?.label} Data Table
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded">
                                <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-3 py-2 border">Column 1</th>
                                    <th className="px-3 py-2 border">Column 2</th>
                                    <th className="px-3 py-2 border">Column 3</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="even:bg-gray-50">
                                    <td className="px-3 py-2 border">Mock Data 1</td>
                                    <td className="px-3 py-2 border">Data here</td>
                                    <td className="px-3 py-2 border">...</td>
                                </tr>
                                <tr className="even:bg-gray-50">
                                    <td className="px-3 py-2 border">Mock Data 2</td>
                                    <td className="px-3 py-2 border">Data here</td>
                                    <td className="px-3 py-2 border">...</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Download Button */}
                    <div className="text-right">
                        <button className="bg-green-600 text-white px-4 py-1 rounded shadow hover:bg-green-700">
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportDashboard;
