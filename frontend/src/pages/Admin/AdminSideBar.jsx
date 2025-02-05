import React, { useState } from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
    HomeOutlined as HomeOutlinedIcon,
    PeopleOutlined as PeopleOutlinedIcon,
    AccessTimeOutlined as AccessTimeOutlinedIcon,
    FitnessCenterOutlined as FitnessCenterOutlinedIcon,
    AssignmentOutlined as AssignmentOutlinedIcon,
    SportsOutlined as SportsOutlinedIcon,
    LocalPharmacyOutlined as LocalPharmacyOutlinedIcon,
    AssessmentOutlined as AssessmentOutlinedIcon,
    PaymentOutlined as PaymentOutlinedIcon,
    CampaignOutlined as CampaignOutlinedIcon,
    EventOutlined as EventOutlinedIcon,
} from "@mui/icons-material";
import TopBar from "../../components/TopBar.jsx";


const AdminSideBar = () => {

    const routeTitles = {
        "/adminDashboard": "Dashboard",
        "/members": "Manage Members",
        "/trainers": "Manage Trainers",
        "/attendance": "Attendance",
        "/plans": "Manage Plans",
        "/announcements": "Announcements",
        "/equipments": "Gym Equipments",
        "/supplements": "Manage Supplements",
        "/schedules": "View Schedules",
        "/payments": "Payments",
        "/report": "Report",
    };

    const location = useLocation(); // Hook to get the current route
    const currentTitle = routeTitles[location.pathname] || "Dashboard"; // Get the title based on the current route

    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarBgColor = "#1a1b23";
    const textColor = "#726e8f";
    const iconBgColor = "#262626";
    const activeBgColor = "#590404"
    const activeTextColor = "#b5b5c5"; // White text for active item
    const fontSize = "14.5px";
    const iconSize = "17px";
    const fontFamily = "Times New Roman";

    const iconColors = {
        dashboard: "#4caf50",
        members: "#2196f3",
        trainers: "#ff9800",
        attendance: "#9c27b0",
        plan: "#f44336",
        announcements: "#3f51b5",
        equipments: "#00bcd4",
        supplements: "#8bc34a",
        schedules: "#ffc107",
        payments: "#e91e63",
        report: "#009688",
    };

    const Item = ({ title, to, icon, color }) => {
        const isActive = location.pathname === to; // Check if the route is active

        return (
            <ListItem
                button
                component={Link}
                to={to}
                sx={{
                    backgroundColor: isActive ? activeBgColor : "transparent",
                    color: isActive ? activeTextColor : textColor,
                    "&:hover": {
                        backgroundColor: activeBgColor,
                        color: activeTextColor,
                    },
                }}
            >
                <Box
                    sx={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        backgroundColor: isActive ? activeBgColor : iconBgColor,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "10px",
                        "&:hover": {
                            backgroundColor: activeBgColor, // Change icon background color on hover
                        },
                    }}
                >
                    {React.cloneElement(icon, {
                        sx: {
                            fontSize: iconSize,
                            color: isActive ? activeTextColor : color, // Fix for icon color
                        }
                    })}
                </Box>
                <ListItemText primary={title} />
            </ListItem>
        );
    };


    return (
        <>
        <TopBar userName="Admin" title={currentTitle} /> {/* Pass the current title */}
            {/* Divider */}

        <Box sx={{ display: "flex" }}>
            <Drawer
                variant="permanent"
                open
                sx={{
                    width: isCollapsed ? 80 : 240,
                    transition: "width 0.3s",
                    "& .MuiDrawer-paper": {
                        width: isCollapsed ? 80 : 240,
                        height: "90vh",
                        marginTop: "8.8vh",
                        padding: "25px 0",
                        backgroundColor: sidebarBgColor,
                        overflow: "hidden",
                        "&:hover": {
                            overflowY: "auto",
                        },
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    },
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: textColor,
                        padding: "1px 110px 10px 0",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        fontSize: "13px",

                    }}
                >
                    Navigation
                </Typography>

                <List>
                    <Item title="Dashboard" to="/adminDashboard" icon={<HomeOutlinedIcon />} color={iconColors.dashboard} />
                    <Item title="Manage Members" to="/members" icon={<PeopleOutlinedIcon />} color={iconColors.members} />
                    <Item title="Manage Trainers" to="/trainers" icon={<SportsOutlinedIcon />} color={iconColors.trainers} />
                    <Item title="Attendance" to="/attendance" icon={<AccessTimeOutlinedIcon />} color={iconColors.attendance} />
                    <Item title="Manage Plans" to="/plans" icon={<AssignmentOutlinedIcon />} color={iconColors.plan} />
                    <Item title="Announcements" to="/announcements" icon={<CampaignOutlinedIcon />} color={iconColors.announcements} />
                    <Item title="Gym Equipments" to="/equipments" icon={<FitnessCenterOutlinedIcon />} color={iconColors.equipments} />
                    <Item title="Manage Supplements" to="/supplements" icon={<LocalPharmacyOutlinedIcon />} color={iconColors.supplements} />
                    <Item title="View Schedules" to="/schedules" icon={<EventOutlinedIcon />} color={iconColors.schedules} />
                    <Item title="Payments" to="/payments" icon={<PaymentOutlinedIcon />} color={iconColors.payments} />
                    <Item title="Report" to="/report" icon={<AssessmentOutlinedIcon />} color={iconColors.report} />
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, padding: "20px" }}>  </Box>
        </Box>
        </>
    );
};

export default AdminSideBar;
