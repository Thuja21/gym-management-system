import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    Bell,
    TrendingUp,
    Clock,
    Banknote
} from 'lucide-react';
import AdminSideBar from "./AdminSideBar.jsx";
import "./Admin.css";
import {Box} from "@mui/material";

function AdminDashboard() {
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [totalActiveMembers, setTotalActiveMembers] = useState(0);
    const [RecentNotices, setRecentNotices] = useState([]);
    const [RecentSessions, setRecentSessions] = useState([]);
    const [totalAttendance, setTotal] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:8800/api/dash/totalRegistration")
            .then(response => {
                console.log("API Response:", response.data);  // ✅ Debugging API response
                setTotalRegistrations(response.data.total_registrations);
                console.log(response.data.total_registrations);
            })
            .catch(error => {
                console.error("Error fetching total registrations:", error);
            });

        // Fetch total active members
        axios.get("http://localhost:8800/api/dash/totalActiveMember")
            .then(response => {
                console.log("API Response (Active Members):", response.data);
                setTotalActiveMembers(response.data.total_active_members);
            })
            .catch(error => {
                console.error("Error fetching total active members:", error);
            });

        // Fetch recent 3 notices
        axios.get("http://localhost:8800/api/dash/recentNotices")
            .then(response => {
                console.log("API Response (Recent Notices):", response.data);
                setRecentNotices(response.data); // assuming you're using a state like setRecentNotices
            })
            .catch(error => {
                console.error("Error fetching recent notices:", error);
            });

        axios.get("http://localhost:8800/api/dash/recentSessions")
            .then(response => {
                console.log("API Response (Recent Sessions):", response.data);
                setRecentSessions(response.data); // assuming you're using a state like setRecentSessions
            })
            .catch(error => {
                console.error("Error fetching recent sessions:", error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8800/api/attendance/last-week-total')
            .then(res => setTotal(res.data.total))
            .catch(err => console.error(err));
    }, []);

    const attendanceRate = totalActiveMembers > 0
        ? ((totalAttendance / (totalActiveMembers * 7)) * 100).toFixed(2)
        : 0;

    const stats = [
        { title: 'Active Members', value: totalActiveMembers, icon: Users, trend: ' from last month', color: 'from-violet-500 to-violet-600', lightColor: 'bg-violet-50', textColor: 'text-violet-600' },
        { title: 'Monthly Revenue', value: 'Rs.24,890', icon: Banknote, trend: ' from last month', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { title: 'Class Attendance', value: attendanceRate + "%", icon: Calendar, trend: ' from last week', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { title: 'New Registrations', value: totalRegistrations, icon: Activity, trend: ' from this month',  color: 'from-pink-500 to-pink-600', lightColor: 'bg-pink-50', textColor: 'text-pink-600'},
    ];

    const formatDuration = (duration) => {
        if (!duration) return "";

        const [hours, minutes, seconds] = duration.split(":").map(Number);

        if (hours > 0 && minutes > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min${minutes > 1 ? "s" : ""}`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""}`;
        } else {
            return `${minutes} min${minutes > 1 ? "s" : ""}`;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 w-[100vw] ml-[117px]">
            {/* Header */}
            <AdminSideBar />
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 h-[160px]">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90`}></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.lightColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                    <div className="flex items-center text-white bg-white/20 rounded-full px-2 py-1 text-sm">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        {stat.trend}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white/80 mt-[-8px]">{stat.title}</h3>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Notices */}
                    <div className="bg-white shadow rounded-lg border border-gray-200">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Recent Notices</h2>
                                <Bell className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {RecentNotices.map((notice, index) => {
                                    const colors = ['bg-red-500', 'bg-yellow-500', 'bg-emerald-500']; // Define 3 colors
                                    const circleColor = colors[index % 3]; // Assign colors based on row index

                                    return (
                                        <div key={notice.announcement_id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                                            <div className={`w-2 h-2 rounded-full ${circleColor}`} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{notice.announcement_title}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(notice.posted_date).toLocaleDateString('en-GB')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    </div>

                    {/* Upcoming Classes */}
                    <div className="bg-white shadow rounded-lg border border-gray-200">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Upcoming Sessions</h2>
                                <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {RecentSessions.map((session) => (
                                    <div key={session.schedule_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div>
                                            <div className="flex items-center">
                                                <div className="bg-blue-50 p-1.5 rounded-md mr-2">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <p className="font-medium text-gray-800">{session.title}</p>
                                            </div>
                                            <p className="text-sm text-gray-500 text-left mt-1 ml-8">
                                                {new Date(session.schedule_date).toLocaleDateString('en-GB', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-800">
                                                {new Date(`1970-01-01T${session.start_time}Z`)
                                                        .toLocaleTimeString("en-US", {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        .replace(":", ".")
                                                    + " - " +
                                                    new Date(`1970-01-01T${session.end_time}Z`)
                                                        .toLocaleTimeString("en-US", {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        .replace(":", ".") }
                                            </p>
                                            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                                                {formatDuration(session.duration)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;