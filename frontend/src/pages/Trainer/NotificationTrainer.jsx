import React, { useState, useEffect, createContext, useContext } from "react";
import { Bell, Calendar, CreditCard, Award, Trash2, AlertTriangle, User, Info } from "lucide-react";
import TrainerSideBar from "./TrainerSideBar.jsx";
import { Paper, Typography, Divider } from "@mui/material";

// Create a context to share notification count with sidebar
export const NotificationContext = createContext(0);

function TrainerNotification() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

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

    // In TrainerNotification.jsx, update the useEffect that fetches notifications:

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8800/api/announcements/all");
                let data = await res.json();

                // Sort by newest first and format time
                data = data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((notif) => ({
                        ...notif,
                        timeAgo: getTimeAgo(notif.created_at)
                    }));

                setNotifications(data);

                // Calculate today's notifications
                const today = new Date().setHours(0, 0, 0, 0);
                const todayNotifications = data.filter(notification => {
                    const notifDate = new Date(notification.created_at).setHours(0, 0, 0, 0);
                    return notifDate >= today;
                });

                // Set unread count to today's notifications
                setUnreadCount(todayNotifications.length);

                // Update localStorage with today's count
                const notificationData = {
                    count: todayNotifications.length,
                    lastChecked: new Date().toISOString(),
                    date: new Date().toDateString()
                };
                localStorage.setItem("notificationData", JSON.stringify(notificationData));

            } catch (err) {
                setError("Failed to load notifications.");
                console.error("Error fetching notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);


    const deleteNotification = (id) => {
        const updatedNotifications = notifications.filter(
            notification => notification.announcement_id !== id
        );
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.length);
    };

    const getIndexFromString = (str, arrLength) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % arrLength;
    };

    const getIconAndColor = (notification) => {
        const icons = [Bell, Calendar, CreditCard, Award, User, Info, AlertTriangle];
        const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-red-100', 'bg-yellow-100', 'bg-purple-100'];
        const iconColors = {
            'bg-blue-100': 'text-blue-800',
            'bg-green-100': 'text-green-800',
            'bg-red-100': 'text-red-800',
            'bg-yellow-100': 'text-yellow-800',
            'bg-purple-100': 'text-purple-800',
        };

        const index = getIndexFromString(notification.announcement_id.toString(), icons.length);
        const Icon = icons[index];
        const bgColor = bgColors[index % bgColors.length];
        const iconColor = iconColors[bgColor];

        return { Icon, bgColor, iconColor };
    };

    return (
        <NotificationContext.Provider value={unreadCount}>
            <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
                <TrainerSideBar style={{ flexShrink: 0, width: 250 }} />
                <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", scrollbarWidth: "none", marginLeft: "-45px", marginTop: "10px" }}>
                    <Typography variant="h4" gutterBottom>
                        Notifications
                    </Typography>

                    <Paper elevation={1} className="p-4 mb-6 rounded-lg" style={{ marginRight: "-5px" }}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Notification Center
                            </h2>
                        </div>
                    </Paper>

                    <div className="bg-white rounded-xl shadow-sm" style={{ marginTop: "-10px", marginRight: "-5px", height: "auto" }}>
                        <div className="p-6">
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">Loading notifications...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-10">
                                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium text-gray-500">{error}</h3>
                                    </div>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notification) => {
                                        const { Icon, bgColor, iconColor } = getIconAndColor(notification);

                                        return (
                                            <div
                                                key={notification.announcement_id}
                                                className="border rounded-lg p-4 transition-all bg-white"
                                                style={{ borderLeft: `4px solid ${bgColor.replace('bg-', '').replace('-100', '-500')}` }}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <h3 className="font-semibold text-gray-800">
                                                            {notification.announcement_title}
                                                        </h3>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{notification.timeAgo}</span>
                                                </div>

                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-4">
                                                        <div className={`p-3 rounded-full ${bgColor}`}>
                                                            <Icon className={`w-5 h-5 ${iconColor}`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">{notification.announcement_content}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2 ml-2">
                                                        <button
                                                            onClick={() => deleteNotification(notification.announcement_id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10">
                                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium text-gray-500">No notifications</h3>
                                        <p className="text-gray-400 mt-2">You're all caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NotificationContext.Provider>
    );
}

export default TrainerNotification;
