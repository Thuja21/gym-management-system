import React, {useState, useEffect, useContext} from "react";
import { Box, Drawer, List, ListItem, ListItemText, Divider, Typography, Badge } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import TopBar from "../../components/TrainerTopbar.jsx";
import { NotificationContext } from "./NotificationTrainer.jsx"; // Import the context

const routeConfig = [
    { title: "Dashboard", path: "/trainerDashboard", icon: "HomeOutlined", color: "#4caf50" },
    { title: "Schedule", path: "/schedule", icon: "EventOutlined", color: "#9c27b0" },
    { title: "Track Progress", path: "/members1", icon: "PeopleOutlined", color: "#2196f3" },
    { title: "Notification", path: "/trainernotification", icon: "NotificationsOutlined", color: "#ff5722" }
];

const TrainerSideBar = () => {
    const location = useLocation();
    const currentRoute = routeConfig.find(r => r.path === location.pathname) || routeConfig[0];
    const [currentTitle, setCurrentTitle] = useState("");
    const IconComponent = Icons[currentRoute.icon || "HomeOutlined"];
    const contextValue = useContext(NotificationContext);
    const [notificationCount, setNotificationCount] = useState(0);

    const isProfilePage = location.pathname === "/trainerProfile";

    useEffect(() => {
        if (isProfilePage) {
            setCurrentTitle("Profile");
        } else {
            const route = routeConfig.find(r => r.path === location.pathname);
            setCurrentTitle(route ? route.title : "Dashboard");
        }
    }, [location.pathname, isProfilePage]);

    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const res = await fetch("http://localhost:8800/api/announcements/all");
                const data = await res.json();

                // Filter notifications from today
                const today = new Date().setHours(0, 0, 0, 0);
                const newNotifications = data.filter(notification => {
                    const notifDate = new Date(notification.created_at).setHours(0, 0, 0, 0);
                    return notifDate >= today;
                });

                const newCount = newNotifications.length;

                // Store the count and the date it was calculated
                const notificationData = {
                    count: newCount,
                    lastChecked: new Date().toISOString(),
                    date: new Date().toDateString()
                };

                localStorage.setItem("notificationData", JSON.stringify(notificationData));
                setNotificationCount(newCount);
            } catch (err) {
                console.error("Error fetching notification count:", err);
            }
        };

        // Get stored notification data
        const storedData = localStorage.getItem("notificationData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);

            // Check if the stored data is from today
            const today = new Date().toDateString();
            if (parsedData.date === today) {
                setNotificationCount(parsedData.count);
            } else {
                // If not from today, fetch fresh data
                fetchNotificationCount();
            }
        } else {
            fetchNotificationCount();
        }

        // Set up polling to check for new notifications
        const interval = setInterval(fetchNotificationCount, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (typeof contextValue === 'number' && location.pathname === '/trainernotification') {
            // When on notification page, we can still show the count from context
            // This allows the badge to remain visible even on the notification page
            setNotificationCount(contextValue);
        }
    }, [contextValue, location.pathname]);

    const styles = {
        sidebarBg: "#1a1b23",
        textColor: "#a4a1b6",
        iconBg: "#262626",
        activeBg: "#2a2f4c",
        activeText: "#ffffff",
        fontSize: "15px",
        iconSize: "18px",
        activeBorderColor: "#788baf"
    };

    const Item = ({ title, path, icon, color }) => {
        const isActive = location.pathname === path;
        const IconComponent = Icons[icon];
        // Always show badge if there are notifications, regardless of whether it's active
        const showBadge = title === "Notification" && notificationCount > 0;

        return (
            <ListItem
                button
                component={Link}
                to={path}
                sx={{
                    backgroundColor: isActive ? styles.activeBg : "transparent",
                    color: isActive ? styles.activeText : styles.textColor,
                    padding: "10px 20px",
                    borderRadius: "6px",
                    borderLeft: isActive ? `6px solid ${styles.activeBorderColor}` : "4px solid transparent",
                    fontWeight: isActive ? "bold" : "normal",
                    fontSize: styles.fontSize,
                    margin: "4px 8px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: isActive ? styles.activeBg : "rgba(63, 81, 181, 0.1)",
                        borderLeft: isActive ? `6px solid ${styles.activeBorderColor}` : `4px solid ${styles.activeBorderColor}`
                    }
                }}
            >
                <Box
                    sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: isActive ? styles.activeBg : styles.iconBg,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "12px"
                    }}
                >
                    {showBadge ? (
                        <Badge badgeContent={notificationCount} color="error">
                            <IconComponent sx={{ fontSize: styles.iconSize, color: isActive ? styles.activeText : color }} />
                        </Badge>
                    ) : (
                        <IconComponent sx={{ fontSize: styles.iconSize, color: isActive ? styles.activeText : color }} />
                    )}
                </Box>
                <ListItemText primary={title} />
            </ListItem>
        );
    };

    return (
        <>
            <TopBar userName="Trainer" title={currentTitle} icon={IconComponent}  setCurrentTitle={setCurrentTitle}/>
            <Box sx={{ display: "flex" }}>
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        width: 240,
                        "& .MuiDrawer-paper": {
                            width: 240,
                            height: "92vh",
                            marginTop: "8.8vh",
                            padding: "25px 0",
                            backgroundColor: styles.sidebarBg,
                            boxShadow: "0 0 15px rgba(0,0,0,0.3)"
                        }
                    }}
                >
                    <Divider sx={{ backgroundColor: "#86868e", mb: 2 ,mt: -3}} />
                    <Typography variant="h6" sx={{
                        color: styles.textColor, padding: "1px 110px 10px 0", fontWeight: "bold", letterSpacing: "1px",
                        fontSize: "13px", ml: 5
                    }}>
                        Navigation
                    </Typography>
                    <List sx={{ padding: "0 4px" }}>
                        {routeConfig.map(({ title, path, icon, color }) => (
                            <Item key={path} title={title} path={path} icon={icon} color={color} />
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, padding: "20px" }}></Box>
            </Box>
        </>
    );
};

export default TrainerSideBar;
