import React, { useEffect, useState } from 'react';
import { Bell, Calendar, CreditCard, Award } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";
import Footer from "../../components/Member/Footer.jsx";

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const createdAt = new Date(timestamp);
        const secondsAgo = Math.floor((now - createdAt) / 1000);

        if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) return `${hoursAgo} hours ago`;
        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo < 7) return `${daysAgo} days ago`;
        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo < 4) return `${weeksAgo} weeks ago`;
        const monthsAgo = Math.floor(daysAgo / 30);
        if (monthsAgo < 12) return `${monthsAgo} months ago`;
        const yearsAgo = Math.floor(daysAgo / 365);
        return `${yearsAgo} years ago`;
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("http://localhost:8800/api/announcements/all"); // Update with your backend URL
                let data = await res.json();

                // Sort by newest first and format time
                data = data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((notif) => ({
                        ...notif,
                        timeAgo: getTimeAgo(notif.created_at),
                    }));

                setNotifications(data);
            } catch (err) {
                setError("Failed to load notifications.");
            }
        };
        fetchNotifications();
    }, []);


    const getIndexFromString = (str, arrLength) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % arrLength;
    };

    const getIconAndColor = (notification) => {
        const index = getIndexFromString(notification.announcement_id.toString(), icons.length);
        const icon = icons[index];
        const bgColor = bgColors[index % bgColors.length];
        const iconColor = iconColors[bgColor];

        return { icon, bgColor, iconColor };
    };

    const icons = [Bell, Calendar, CreditCard, Award];
    const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-red-100', 'bg-yellow-100', 'bg-purple-100'];
    const iconColors = {
        'bg-blue-100': 'text-blue-800',
        'bg-green-100': 'text-green-800',
        'bg-red-100': 'text-red-800',
        'bg-yellow-100': 'text-yellow-800',
        'bg-purple-100': 'text-purple-800',
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ width: '100vw' }}>
            <Navbar />
            <div className="max-w-[1370px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-1 mt-16">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>Notifications</h1>
                </div>

                <div className="flex items-center justify-between mb-[-15px] border-b pb-2">
                    <div className="flex space-x-6 ml-auto">
                        <button className="text-blue-600 hover:text-blue-700 text-[17px] font-medium">
                            clear all
                        </button>
                    </div>
                </div>


                {/* Notifications List */}
                <div className="space-y-4 mt-8">
                    {notifications.map((notification) => {
                        const { icon: Icon, bgColor, iconColor } = getIconAndColor(notification);

                        return (
                            <div
                                key={notification.announcement_id}
                                className="bg-white rounded-lg shadow-md p-4 flex items-start border-l-4 border-blue-500"
                            >
                                <div className={`${bgColor} p-3 rounded-full mr-4`}>
                                    <Icon className={`h-6 w-6 ${iconColor}`} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium" style={{ fontFamily: "Segoe UI" }}>{notification.announcement_title}</h3>
                                        <span className="text-sm text-gray-500">{notification.timeAgo}</span>
                                    </div>
                                    <p className="text-gray-600 mt-3 text-left">
                                        {notification.announcement_content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/*<Footer />*/}
        </div>
    );
}
