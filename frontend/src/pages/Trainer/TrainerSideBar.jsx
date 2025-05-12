import React, { useState, useEffect } from "react";
import { Box, Drawer, List, ListItem, ListItemText, Divider, Typography, Badge } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import TopBar from "../../components/TrainerTopbar.jsx";

const routeConfig = [
    { title: "Dashboard", path: "/trainerDashboard", icon: "HomeOutlined", color: "#4caf50" },
    { title: "Schedule", path: "/schedule", icon: "EventOutlined", color: "#9c27b0" },
    { title: "View Members", path: "/members1", icon: "PeopleOutlined", color: "#2196f3" },
    { title: "Notification", path: "/trainernotification", icon: "NotificationsOutlined", color: "#ff5722" }
];

const TrainerSideBar = () => {
    const location = useLocation();
    const currentRoute = routeConfig.find(r => r.path === location.pathname) || routeConfig[0];
    const currentTitle = currentRoute.title || "Dashboard";
    const IconComponent = Icons[currentRoute.icon || "HomeOutlined"];
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const res = await fetch("http://localhost:8800/api/announcements/all");
                const data = await res.json();
                if (location.pathname !== '/trainernotification') {
                    setNotificationCount(data.length);
                    localStorage.setItem("notificationCount", data.length);
                    console.log("######",data.length);
                } else {
                    setNotificationCount(0);
                    localStorage.setItem("notificationCount", "0");
                }
            } catch (err) {
                console.error("Error fetching notification count:", err);
            }
        };

        const stored = localStorage.getItem("notificationCount");
        if (stored && location.pathname !== '/trainernotification') {
            setNotificationCount(parseInt(stored));
        } else {
            fetchNotificationCount();
        }

        if (location.pathname === '/trainernotification') {
            setNotificationCount(0);
            localStorage.setItem("notificationCount", "0");
        }
    }, [location.pathname]);

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
        const showBadge = title === "Notification" && notificationCount > 0 && !isActive;

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
            <TopBar userName="Trainer" title={currentTitle} icon={IconComponent} />
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
