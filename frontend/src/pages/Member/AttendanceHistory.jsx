import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";

export default function AttendanceHistory() {
    const attendanceData = [
        { date: '2024-03-15', checkIn: '09:00 AM', checkOut: '10:30 AM', duration: '1h 30m' },
        { date: '2024-03-14', checkIn: '08:45 AM', checkOut: '10:15 AM', duration: '1h 30m' },
        { date: '2024-03-12', checkIn: '07:30 AM', checkOut: '09:00 AM', duration: '1h 30m' },
        { date: '2024-03-10', checkIn: '06:15 PM', checkOut: '07:45 PM', duration: '1h 30m' },
        { date: '2024-03-09', checkIn: '05:30 PM', checkOut: '07:00 PM', duration: '1h 30m' },
    ];

    return (
        <div className="min-h-screen bg-gray-50" style={{width:'100vw'}}>
            <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 mt-16 text-left" style={{fontFamily : "sans-serif"}}>Attendance History</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check In
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check Out
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceData.map((record, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-900">{record.date}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-900">{record.checkIn}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-red-500 mr-2" />
                                        <span className="text-sm text-gray-900">{record.checkOut}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.duration}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    );
}
