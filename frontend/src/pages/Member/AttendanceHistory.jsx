import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";
import axios from "axios";

export default function AttendanceHistory() {

    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/attendance/member', {
                withCredentials: true
            });
            console.log(response.data);
            setAttendanceData(response.data);
            setFilteredData(response.data); // Initialize filtered data
        } catch (error) {
            console.error('Error fetching attendance data', error);
            setAttendanceData([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, dateRange, customStartDate, customEndDate, sortField, sortDirection, attendanceData]);

    const applyFilters = () => {
        let filtered = [...attendanceData];

        // Apply date range filter
        const today = new Date().toISOString().split('T')[0];
        const getDateBefore = (days) => {
            const date = new Date();
            date.setDate(date.getDate() - days);
            return date.toISOString().split('T')[0];
        };

        if (dateRange === 'today') {
            filtered = filtered.filter(record => record.attendance_date === today);
        } else if (dateRange === 'week') {
            const weekAgo = getDateBefore(7);
            filtered = filtered.filter(record => record.attendance_date >= weekAgo);
        } else if (dateRange === 'month') {
            const monthAgo = getDateBefore(30);
            filtered = filtered.filter(record => record.attendance_date >= monthAgo);
        } else if (dateRange === 'year') {
            const yearAgo = getDateBefore(365);
            filtered = filtered.filter(record => record.attendance_date >= yearAgo);
        } else if (dateRange === 'custom' && (customStartDate || customEndDate)) {
            if (customStartDate) {
                filtered = filtered.filter(record => record.attendance_date >= customStartDate);
            }
            if (customEndDate) {
                filtered = filtered.filter(record => record.attendance_date <= customEndDate);
            }
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                record.attendance_date.toLowerCase().includes(term) ||
                (record.check_in_time && record.check_in_time.toLowerCase().includes(term)) ||
                (record.check_out_time && record.check_out_time.toLowerCase().includes(term))
            );
        }

        // Set filtered data instead of modifying original data
        setFilteredData(filtered);
    };

    const handleDateRangeChange = (range) => {
        setDateRange(range);
        if (range !== 'custom') {
            setShowDatePicker(false);
        } else {
            setShowDatePicker(true);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setDateRange('all');
        setCustomStartDate('');
        setCustomEndDate('');
        setShowDatePicker(false);
        setFilteredData(attendanceData); // Reset to original data
    };

    const formatSelectedDateRange = () => {
        if (dateRange === 'all') return 'All Time';
        if (dateRange === 'today') return 'Today Only';
        if (dateRange === 'week') return 'Last 7 Days';
        if (dateRange === 'month') return 'Last 30 Days';
        if (dateRange === 'year') return 'Last Year';
        if (dateRange === 'custom') {
            if (customStartDate && customEndDate) {
                return `${customStartDate} to ${customEndDate}`;
            } else if (customStartDate) {
                return `From ${customStartDate}`;
            } else if (customEndDate) {
                return `Until ${customEndDate}`;
            }
            return 'Custom Range';
        }
        return 'Select Range';
    };

    const calculateDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 'N/A';
        const [inHours, inMinutes] = checkIn.split(':').map(Number);
        const [outHours, outMinutes] = checkOut.split(':').map(Number);

        const inDate = new Date();
        inDate.setHours(inHours, inMinutes, 0);

        const outDate = new Date();
        outDate.setHours(outHours, outMinutes, 0);

        let diffMs = outDate - inDate;

        if (diffMs < 0) return 'Invalid'; // in case checkout is before checkin

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gray-100" style={{ width: '100vw' }}>
            <Navbar />
            <div className="max-w-[1370px] mx-auto px-4 py-8 ">
                <div className="mb-4 mt-[60px] text-left">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>Attendance History</h1>
                </div>
                <div className="bg-white rounded-xl border-1 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search records..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition w-full md:w-auto justify-between"
                                >
                                    <div className="flex items-center">
                                        <Filter className="h-5 w-5 text-gray-600 mr-2" />
                                        <span>Date: {formatSelectedDateRange()}</span>
                                    </div>
                                    {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                                </button>

                                {showFilters && (
                                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50 w-64 border border-gray-200">
                                        <div className="p-2">
                                            <div className="text-sm font-medium text-gray-700 p-2 border-b">Date Range</div>
                                            <div className="mt-1">
                                                <button
                                                    onClick={() => handleDateRangeChange('all')}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${dateRange === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
                                                >
                                                    All Time
                                                </button>
                                                <button
                                                    onClick={() => handleDateRangeChange('today')}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${dateRange === 'today' ? 'bg-blue-50 text-blue-700' : ''}`}
                                                >
                                                    Today Only
                                                </button>
                                                <button
                                                    onClick={() => handleDateRangeChange('week')}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${dateRange === 'week' ? 'bg-blue-50 text-blue-700' : ''}`}
                                                >
                                                    Last 7 Days
                                                </button>
                                                <button
                                                    onClick={() => handleDateRangeChange('month')}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${dateRange === 'month' ? 'bg-blue-50 text-blue-700' : ''}`}
                                                >
                                                    Last 30 Days
                                                </button>
                                                <button
                                                    onClick={() => handleDateRangeChange('year')}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${dateRange === 'year' ? 'bg-blue-50 text-blue-700' : ''}`}
                                                >
                                                    Last Year
                                                </button>
                                                <button
                                                    onClick={() => handleDateRangeChange('custom')}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${dateRange === 'custom' ? 'bg-blue-50 text-blue-700' : ''}`}
                                                >
                                                    Custom Range
                                                </button>
                                            </div>

                                            {showDatePicker && (
                                                <div className="p-2 border-t mt-2">
                                                    <div className="mb-2">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                                                        <input
                                                            type="date"
                                                            className="w-full p-1 text-sm border border-gray-300 rounded"
                                                            value={customStartDate}
                                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                                                        <input
                                                            type="date"
                                                            className="w-full p-1 text-sm border border-gray-300 rounded"
                                                            value={customEndDate}
                                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="border-t mt-2 pt-2 flex justify-end px-2">
                                                <button
                                                    onClick={resetFilters}
                                                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-7" style={{ minHeight: "430px" }}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    <div className="flex items-center">
                                        <span>Date</span>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    <div className="flex items-center">
                                        <span>Check In</span>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    <div className="flex items-center">
                                        <span>Check Out</span>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((record, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                                                <span className="text-sm text-gray-800">{new Date(record.attendance_date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 text-green-500 mr-2" />
                                                <span className="text-sm text-gray-800 ">{record.check_in_time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 text-red-500 mr-2" />
                                                <span className="text-sm text-gray-800">{record.check_out_time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            {calculateDuration(record.check_in_time, record.check_out_time)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No attendance records match your filters
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
