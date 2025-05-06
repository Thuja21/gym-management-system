import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Printer } from 'lucide-react';
// import { downloadReport } from '../../services/reportService';
import ReportTable from './ReportTable';
import ReportChart from './ReportChart';

// Mock data for the membership report
const mockMembershipData = [
    { id: 1, name: 'John Doe', gender: 'Male', plan: 'Annual', status: 'Active', joinDate: '2023-01-15', expiryDate: '2024-01-15', lastVisit: '2023-06-15', visitsThisMonth: 12 },
    { id: 2, name: 'Jane Smith', gender: 'Female', plan: 'Monthly', status: 'Active', joinDate: '2023-03-10', expiryDate: '2023-07-10', lastVisit: '2023-06-18', visitsThisMonth: 8 },
    { id: 3, name: 'Mike Johnson', gender: 'Male', plan: 'Quarterly', status: 'Expired', joinDate: '2022-11-05', expiryDate: '2023-02-05', lastVisit: '2023-01-30', visitsThisMonth: 0 },
    { id: 4, name: 'Sarah Williams', gender: 'Female', plan: 'Premium', status: 'Active', joinDate: '2023-02-20', expiryDate: '2024-02-20', lastVisit: '2023-06-16', visitsThisMonth: 15 },
    { id: 5, name: 'David Brown', gender: 'Male', plan: 'Monthly', status: 'Frozen', joinDate: '2023-04-01', expiryDate: '2023-08-01', lastVisit: '2023-05-25', visitsThisMonth: 2 },
    { id: 6, name: 'Emily Davis', gender: 'Female', plan: 'Annual', status: 'Active', joinDate: '2022-09-12', expiryDate: '2023-09-12', lastVisit: '2023-06-17', visitsThisMonth: 10 },
    { id: 7, name: 'Ryan Miller', gender: 'Male', plan: 'Premium', status: 'Active', joinDate: '2023-01-30', expiryDate: '2024-01-30', lastVisit: '2023-06-14', visitsThisMonth: 20 },
    { id: 8, name: 'Amanda Wilson', gender: 'Female', plan: 'Quarterly', status: 'Pending', joinDate: '2023-06-01', expiryDate: '2023-09-01', lastVisit: 'N/A', visitsThisMonth: 0 },
];

const membershipColumns = [
    { key: 'name', label: 'Member Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'plan', label: 'Plan' },
    { key: 'status', label: 'Status' },
    { key: 'joinDate', label: 'Join Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'lastVisit', label: 'Last Visit' },
    { key: 'visitsThisMonth', label: 'Visits This Month' },
];

const MembershipReport = ({ isLoading, dateRange, filters }) => {
    const [viewMode, setViewMode] = useState('table');
    const [downloadingFormat, setDownloadingFormat] = useState(null);

    const filteredData = mockMembershipData.filter(member => {
        if (filters.status !== 'all' && member.status.toLowerCase() !== filters.status) return false;
        if (filters.plan !== 'all' && member.plan.toLowerCase() !== filters.plan) return false;
        if (filters.gender !== 'all' && member.gender.toLowerCase() !== filters.gender) return false;
        return true;
    });

    const handleDownload = (format) => {
        setDownloadingFormat(format);
        // Replace this with your actual download function
        setTimeout(() => {
            // downloadReport('membership', format, { dateRange, filters });
            setDownloadingFormat(null);
        }, 1500);
    };

    const chartData = {
        labels: ['Active', 'Expired', 'Pending', 'Frozen'],
        datasets: [
            {
                data: [
                    filteredData.filter(m => m.status === 'Active').length,
                    filteredData.filter(m => m.status === 'Expired').length,
                    filteredData.filter(m => m.status === 'Pending').length,
                    filteredData.filter(m => m.status === 'Frozen').length,
                ],
                backgroundColor: ['#4F46E5', '#EF4444', '#F59E0B', '#10B981'],
            },
        ],
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">Membership Report</h3>
                    <p className="text-sm text-gray-500">
                        Showing {filteredData.length} members •
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
                                viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'
                            } border border-gray-200`}
                            onClick={() => setViewMode('table')}
                        >
                            Table
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                viewMode === 'chart' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                                {['pdf', 'csv', 'xlsx'].map(format => (
                                    <button
                                        key={format}
                                        className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                            downloadingFormat === format ? 'opacity-50 cursor-wait' : ''
                                        }`}
                                        onClick={() => handleDownload(format)}
                                        disabled={downloadingFormat === format}
                                    >
                                        {downloadingFormat === format ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <FileSpreadsheet className="h-4 w-4 mr-3" />
                                        )}
                                        <span>{format.toUpperCase()} {format === 'pdf' ? 'Document' : 'Spreadsheet'}</span>
                                    </button>
                                ))}
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
                <ReportTable data={filteredData} columns={membershipColumns} isLoading={isLoading} />
            ) : (
                <div className="mt-4">
                    <ReportChart type="pie" data={chartData} title="Membership Status Distribution" isLoading={isLoading} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-2">Membership Plan Distribution</h4>
                            <ReportChart
                                type="bar"
                                data={{
                                    labels: ['Monthly', 'Quarterly', 'Annual', 'Premium'],
                                    datasets: [{
                                        data: [
                                            filteredData.filter(m => m.plan === 'Monthly').length,
                                            filteredData.filter(m => m.plan === 'Quarterly').length,
                                            filteredData.filter(m => m.plan === 'Annual').length,
                                            filteredData.filter(m => m.plan === 'Premium').length,
                                        ],
                                        backgroundColor: ['#93C5FD', '#A5B4FC', '#818CF8', '#4F46E5'],
                                    }]
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-2">Gender Distribution</h4>
                            <ReportChart
                                type="doughnut"
                                data={{
                                    labels: ['Male', 'Female'],
                                    datasets: [{
                                        data: [
                                            filteredData.filter(m => m.gender === 'Male').length,
                                            filteredData.filter(m => m.gender === 'Female').length,
                                        ],
                                        backgroundColor: ['#3B82F6', '#EC4899'],
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

export default MembershipReport;
