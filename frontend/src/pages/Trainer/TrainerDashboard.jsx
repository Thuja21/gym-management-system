import TrainerSideBar from "../Trainer/TrainerSideBar.jsx"
import React, {useEffect, useState} from 'react';
import { Activity, Users, Calendar, TrendingUp } from 'lucide-react';
import axios from "axios";

const TrainerDashboard = () => {
    const [RecentSessions, setRecentSessions] = useState([]);
    const [totalActiveMembers, setTotalActiveMembers] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);

    const stats = [
        { title: 'Active Members', value: totalActiveMembers, icon: Users, color: 'bg-blue-500' },
        { title: 'Sessions Today', value: totalSessions, icon: Calendar, color: 'bg-green-500' },
        { title: 'Total Hours', value: '156', icon: Activity, color: 'bg-purple-500' },
        { title: 'Client Progress', value: '87%', icon: TrendingUp, color: 'bg-yellow-500' },
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


    useEffect(() => {
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
            });
}, []);


    return (
        <div>
            <TrainerSideBar/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ml-60">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white rounded-lg shadow p-16">
                        <div className="flex items-center">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                                <p className="text-2xl font-semibold">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ml-60">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
                    <div className="space-y-4">
                        {RecentSessions.map((session) => (
                            <div key={session.schedule_id} className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-sm text-gray-500 text-left">
                                        {new Date(session.schedule_date).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                        {new Date(`1970-01-01T${session.schedule_time_slot}`)
                                            .toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })
                                            .replace(":", ".")}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDuration(session.duration)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((activity) => (
                            <div key={activity} className="flex items-center space-x-4">
                                <div className="bg-gray-100 p-2 rounded-full">
                                    <Activity className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium">New workout plan created</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
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
