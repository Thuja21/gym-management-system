import TrainerSideBar from "../Trainer/TrainerSideBar.jsx"
import React from 'react';
import { Activity, Users, Calendar, TrendingUp } from 'lucide-react';

const TrainerDashboard = () => {
    const stats = [
        { title: 'Active Clients', value: '24', icon: Users, color: 'bg-blue-500' },
        { title: 'Sessions Today', value: '8', icon: Calendar, color: 'bg-green-500' },
        { title: 'Total Hours', value: '156', icon: Activity, color: 'bg-purple-500' },
        { title: 'Client Progress', value: '87%', icon: TrendingUp, color: 'bg-yellow-500' },
    ];

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
                        {[1, 2, 3].map((session) => (
                            <div key={session} className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">John Doe</p>
                                    <p className="text-sm text-gray-500">Strength Training</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">2:00 PM</p>
                                    <p className="text-sm text-gray-500">45 mins</p>
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