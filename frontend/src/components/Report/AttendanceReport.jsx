import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Printer } from 'lucide-react';
// import { downloadReport } from '../../services/reportService';
import ReportTable from './ReportTable';
import ReportChart from './ReportChart';

const AttendanceReport = ({ isLoading, dateRange, filters }) => {
    const [viewMode, setViewMode] = useState('table');
    const [downloadingFormat, setDownloadingFormat] = useState(null);

    // Mock data for the attendance report
    const mockAttendanceData = [
        { id: 1, date: '2023-06-01', weekday: 'Thursday', members: 45, peakHour: '18:00-19:00', morningCount: 12, afternoonCount: 15, eveningCount: 18 },
        { id: 2, date: '2023-06-02', weekday: 'Friday', members: 50, peakHour: '17:00-18:00', morningCount: 10, afternoonCount: 18, eveningCount: 22 },
        { id: 3, date: '2023-06-03', weekday: 'Saturday', members: 38, peakHour: '10:00-11:00', morningCount: 22, afternoonCount: 10, eveningCount: 6 },
        { id: 4, date: '2023-06-04', weekday: 'Sunday', members: 30, peakHour: '11:00-12:00', morningCount: 18, afternoonCount: 8, eveningCount: 4 },
        { id: 5, date: '2023-06-05', weekday: 'Monday', members: 42, peakHour: '18:00-19:00', morningCount: 8, afternoonCount: 14, eveningCount: 20 },
        { id: 6, date: '2023-06-06', weekday: 'Tuesday', members: 48, peakHour: '19:00-20:00', morningCount: 11, afternoonCount: 15, eveningCount: 22 },
        { id: 7, date: '2023-06-07', weekday: 'Wednesday', members: 52, peakHour: '18:00-19:00', morningCount: 14, afternoonCount: 13, eveningCount: 25 },
        { id: 8, date: '2023-06-08', weekday: 'Thursday', members: 47, peakHour: '17:00-18:00', morningCount: 12, afternoonCount: 18, eveningCount: 17 },
        { id: 9, date: '2023-06-09', weekday: 'Friday', members: 55, peakHour: '17:00-18:00', morningCount: 13, afternoonCount: 17, eveningCount: 25 },
        { id: 10, date: '2023-06-10', weekday: 'Saturday', members: 40, peakHour: '10:00-11:00', morningCount: 25, afternoonCount: 10, eveningCount: 5 },
    ];

    const attendanceColumns = [
        { key: 'date', label: 'Date' },
        { key: 'weekday', label: 'Day of Week' },
        { key: 'members', label: 'Total Members' },
        { key: 'morningCount', label: 'Morning (6AM-12PM)' },
        { key: 'afternoonCount', label: 'Afternoon (12PM-5PM)' },
        { key: 'eveningCount', label: 'Evening (5PM-10PM)' },
        { key: 'peakHour', label: 'Peak Hour' },
    ];

    // Filter data based on selected filters
    const filteredData = mockAttendanceData.filter(attendance => {
        // Filter by time of day
        if (filters.timeOfDay === 'morning' && attendance.morningCount === 0) return false;
        if (filters.timeOfDay === 'afternoon' && attendance.afternoonCount === 0) return false;
        if (filters.timeOfDay === 'evening' && attendance.eveningCount === 0) return false;

        // Filter by weekday
        if (filters.weekday === 'weekday' && ['Saturday', 'Sunday'].includes(attendance.weekday)) return false;
        if (filters.weekday === 'weekend' && !['Saturday', 'Sunday'].includes(attendance.weekday)) return false;
        if (filters.weekday !== 'all' && filters.weekday !== 'weekday' && filters.weekday !== 'weekend' &&
            attendance.weekday.toLowerCase() !== filters.weekday) return false;

        return true;
    });

    const handleDownload = (format) => {
        setDownloadingFormat(format);

        // In a real application, this would call an API to generate the report
        setTimeout(() => {
            downloadReport('attendance', format, { dateRange, filters });
            setDownloadingFormat(null);
        }, 1500);
    };

    // Data for charts
    const dailyAttendanceData = {
        labels: filteredData.map(item => item.date),
        datasets: [
            {
                label: 'Total Attendance',
                data: filteredData.map(item => item.members),
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
            }
        ],
    };

    const timeOfDayData = {
        labels: ['Morning', 'Afternoon', 'Evening'],
        datasets: [
            {
                label: 'Average Attendance by Time of Day',
                data: [
                    Math.round(filteredData.reduce((sum, item) => sum + item.morningCount, 0) / filteredData.length),
                    Math.round(filteredData.reduce((sum, item) => sum + item.afternoonCount, 0) / filteredData.length),
                    Math.round(filteredData.reduce((sum, item) => sum + item.eveningCount, 0) / filteredData.length),
                ],
                backgroundColor: ['#93C5FD', '#A5B4FC', '#4F46E5'],
            }
        ],
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">Attendance Report</h3>
                    <p className="text-sm text-gray-500">
                        Showing {filteredData.length} days •
                        <span className="font-medium ml-1">
                            {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                viewMode === 'table'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            } border border-gray-200`}
                            onClick={() => setViewMode('table')}
                        >
                            Table
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                viewMode === 'chart'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            } border border-gray-200`}
                            onClick={() => setViewMode('chart')}
                        >
                            Chart
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            onClick={() => handleDownload('pdf')}
                        >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                        </button>

                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                                <button
                                    className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                        downloadingFormat === 'pdf' ? 'opacity-50 cursor-wait' : ''
                                    }`}
                                    onClick={() => handleDownload('pdf')}
                                    disabled={downloadingFormat === 'pdf'}
                                >
                                    {downloadingFormat === 'pdf' ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FileText className="h-4 w-4 mr-3" />
                                    )}
                                    <span>PDF Document</span>
                                </button>
                                <button
                                    className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                        downloadingFormat === 'csv' ? 'opacity-50 cursor-wait' : ''
                                    }`}
                                    onClick={() => handleDownload('csv')}
                                    disabled={downloadingFormat === 'csv'}
                                >
                                    {downloadingFormat === 'csv' ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FileSpreadsheet className="h-4 w-4 mr-3" />
                                    )}
                                    <span>CSV Spreadsheet</span>
                                </button>
                                <button
                                    className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                        downloadingFormat === 'xlsx' ? 'opacity-50 cursor-wait' : ''
                                    }`}
                                    onClick={() => handleDownload('xlsx')}
                                    disabled={downloadingFormat === 'xlsx'}
                                >
                                    {downloadingFormat === 'xlsx' ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FileSpreadsheet className="h-4 w-4 mr-3" />
                                    )}
                                    <span>Excel Spreadsheet</span>
                                </button>
                                <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="h-4 w-4 mr-3" />
                                    <span>Print Report</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {viewMode === 'table' ? (
                <ReportTable
                    data={filteredData}
                    columns={attendanceColumns}
                    isLoading={isLoading}
                />
            ) : (
                <div className="mt-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                        <h4 className="font-medium text-gray-700 mb-2">Daily Attendance Trend</h4>
                        <ReportChart
                            type="line"
                            data={dailyAttendanceData}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-2">Time of Day Distribution</h4>
                            <ReportChart
                                type="bar"
                                data={timeOfDayData}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-2">Day of Week Distribution</h4>
                            <ReportChart
                                type="bar"
                                data={{
                                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                                    datasets: [{
                                        label: 'Average Attendance by Day',
                                        data: [
                                            Math.round(filteredData.filter(a => a.weekday === 'Monday').reduce((sum, a) => sum + a.members, 0) /
                                                Math.max(1, filteredData.filter(a => a.weekday === 'Monday').length)),
                                            Math.round(filteredData.filter(a => a.weekday === 'Tuesday').reduce((sum, a) => sum + a.members, 0) /
                                                Math.max(1, filteredData.filter(a => a.weekday === 'Tuesday').length)),
                                            Math.round(filteredData.filter(a => a.weekday === 'Wednesday').reduce((sum, a) => sum + a.members, 0) /
                                                Math.max(1, filteredData.filter(a => a.weekday === 'Wednesday').length)),
                                            Math.round(filteredData.filter(a => a.weekday === 'Thursday').reduce((sum, a) => sum + a.members, 0) /
                                                Math.max(1, filteredData.filter(a => a.weekday === 'Thursday').length)),
                                            Math.round(filteredData.filter(a => a.weekday === 'Friday').reduce((sum, a) => sum + a.members, 0) /
                                                Math.max(1, filteredData.filter(a => a.weekday === 'Friday').length)),
                                            Math.round(filteredData.filter(a => a.weekday === 'Saturday').reduce((sum, a) => sum + a.members, 0) /
                                                Math.max(1, filteredData.filter(a => a.weekday === 'Saturday').length)),
                                            Math.round(filteredData.filter(a => a.weekday === 'Sunday').reduce((sum, a) => sum + a.members, 0) /
                                                Math.max(1, filteredData.filter(a => a.weekday === 'Sunday').length)),
                                        ],
                                        backgroundColor: [
                                            '#93C5FD', '#A5B4FC', '#818CF8', '#6366F1',
                                            '#4F46E5', '#4338CA', '#3730A3'
                                        ],
                                    }]
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceReport;