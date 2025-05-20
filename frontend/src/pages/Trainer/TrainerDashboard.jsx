import TrainerSideBar from "../Trainer/TrainerSideBar.jsx"
import React, {useEffect, useState} from 'react';
import {Activity, Users, Calendar, TrendingUp, Clock, CheckCircle} from 'lucide-react';
import axios from "axios";

const TrainerDashboard = () => {
    const [RecentSessions, setRecentSessions] = useState([]);
    const [totalActiveMembers, setTotalActiveMembers] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [totalRegistrations, setTotalRegistrations] = useState(0);

    const stats = [
        { title: 'Active Members', value: totalActiveMembers, icon: Users, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { title: 'New Registrations', value: totalRegistrations, icon: TrendingUp, color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
        { title: 'Sessions Today', value: count, icon: Calendar, color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
        { title: 'Sessions Last Week', value: completedSessions, icon: CheckCircle, color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-600' },
    ];

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     fetch('http://localhost:8800/api/schedules/sessionCount', {
    //         withCredentials: true
    //     })
    //         .then(res => res.json())
    //         .then(data => setCount(data.sessionCount))
    //         .catch(err => console.error(err));
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8800/api/schedules/sessionCount', {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                // Make sure to extract the sessionCount property
                setCount(data.sessionCount)
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8800/api/dash/completed-sessions', {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                // Make sure to extract the sessionCount property
                setCompletedSessions(data.completed_sessions)
            })
            .catch(err => console.error(err));
    }, []);

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


    useEffect(() => {
        setIsLoading(true);
        // Fetch recent 3 notices
        axios.get("http://localhost:8800/api/dash/recentSessions")
            .then(response => {
                console.log("API Response (Recent Sessions):", response.data);
                setRecentSessions(response.data); // assuming you're using a state like setRecentSessions
            })
            .catch(error => {
                console.error("Error fetching recent sessions:", error);
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

        axios.get("http://localhost:8800/api/dash/todaySessions") // Replace with your actual API endpoint
            .then(response => {
                console.log("API Response (Today Sessions):", response.data);
                setTotalSessions(response.data.total_sessions_today);
            })
            .catch(error => {
                console.error("Error fetching today's session count:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });

        axios.get("http://localhost:8800/api/dash/totalRegistration")
            .then(response => {
                console.log("API Response:", response.data);  // ✅ Debugging API response
                setTotalRegistrations(response.data.total_registrations);
                console.log(response.data.total_registrations);
            })
            .catch(error => {
                console.error("Error fetching total registrations:", error);
            });
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <TrainerSideBar/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ml-60 mt-5">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white rounded-lg shadow p-16 relative overflow-hidden border border-gray-100">
                        {/* Decorative element */}
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${stat.color}`}></div>

                        <div className="flex items-center relative z-10">
                            <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                                <p className="text-2xl font-bold text-gray-800">
                                    {isLoading ? (
                                        <span className="inline-block w-12 h-8 bg-gray-200 animate-pulse rounded"></span>
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Bottom border accent */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color}`}></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ml-60">
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Upcoming Sessions</h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4">
                                    <div className="w-2/3">
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                    <div className="w-1/3">
                                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse ml-auto"></div>
                                        <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse ml-auto"></div>
                                    </div>
                                </div>
                            ))
                        ) : RecentSessions.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">No upcoming sessions</div>
                        ) : (
                            RecentSessions.map((session) => (
                                <div key={session.schedule_id} className="flex items-center justify-between border-b pb-4 hover:bg-gray-50 p-2 rounded transition-colors">
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
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Recent Activities</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((activity) => (
                            <div key={activity} className="flex items-start space-x-4 hover:bg-gray-50 p-2 rounded transition-colors">
                                <div className="bg-gray-100 p-2 rounded-full">
                                    <Activity className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-medium text-gray-800">New session created</p>
                                        <span className="text-xs text-gray-500">2 hours ago</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${100 - activity * 20}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard;
