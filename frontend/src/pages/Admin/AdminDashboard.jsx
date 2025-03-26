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
    Award
} from 'lucide-react';
import AdminSideBar from "./AdminSideBar.jsx";
import "./Admin.css";
import {Box} from "@mui/material";

function AdminDashboard() {
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [totalActiveMembers, setTotalActiveMembers] = useState(0);
    const [RecentNotices, setRecentNotices] = useState([]);
    const [RecentSessions, setRecentSessions] = useState([]);


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

                const stats = [
        { title: 'Active Members', value: totalActiveMembers, icon: Users, trend: '+12% from last month', color: 'from-violet-500 to-violet-600', lightColor: 'bg-violet-50', textColor: 'text-violet-600' },
        { title: 'Monthly Revenue', value: 'Rs.24,890', icon: DollarSign, trend: '+8.2% from last month', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { title: 'Class Attendance', value: '89%', icon: Calendar, trend: '+4% from last week', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { title: 'New Registrations', value: totalRegistrations, icon: Activity, trend: '+6 from this month',  color: 'from-pink-500 to-pink-600', lightColor: 'bg-pink-50', textColor: 'text-pink-600'},
    ];

    const upcomingClasses = [
        { id: 1, name: 'CrossFit Basic', time: '10:00 AM', trainer: 'John Smith', attendees: 12 },
        { id: 2, name: 'Yoga Flow', time: '11:30 AM', trainer: 'Sarah Wilson', attendees: 8 },
        { id: 3, name: 'HIIT Training', time: '2:00 PM', trainer: 'Mike Johnson', attendees: 15 },
    ];

    const topTrainers = [
        {
            id: 1,
            name: 'Emma Davis',
            specialization: 'Strength Training',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=150&h=150&fit=crop'
        },
        {
            id: 2,
            name: 'James Wilson',
            specialization: 'CrossFit',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop'
        },
    ];

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
                                <h2 className="text-lg font-medium text-gray-900">Today's Classes</h2>
                                <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {RecentSessions.map((session) => (
                                    <div key={session.schedule_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <Calendar className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{session.title}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-indigo-600">
                                            <p className="text-sm font-medium">
                                                {new Date(`1970-01-01T${session.schedule_time_slot}`)
                                                    .toLocaleTimeString("en-US", {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })
                                                    .replace(":", ".")}
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