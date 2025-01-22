import React, { useState } from "react";
import {
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./Admin.css";
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

const AdminSideBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarBgColor = "#1a1b23";
    const textColor = "#726e8f";
    const hoverBgColor = "#353545";
    const hoverTextColor = "#ffffff";
    const iconBgColor = "#262626";
    const fontSize = "14.5px";
    const iconSize = "17px";

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

    const Item = ({ title, to, icon, color }) => (
        <ListItem
            button
            component={Link}
            to={to}
            sx={{
                color: textColor,
                "&:hover": {
                    backgroundColor: hoverBgColor,
                    color: hoverTextColor,
                },
            }}
        >
            <Box
                sx={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: iconBgColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: iconSize, color } })}
            </Box>
            <ListItemText
                primary={title}
                primaryTypographyProps={{
                    sx: { fontSize, color: textColor },
                }}
            />
        </ListItem>
    );

    return (
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
                        marginTop: "9.2vh",
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
                    <Item title="Dashboard" to="/" icon={<HomeOutlinedIcon />} color={iconColors.dashboard} />
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

            <Box component="main" sx={{ flexGrow: 1, padding: "20px" }}>
                {/* Content goes here */}
            </Box>
        </Box>
    );
};

export default AdminSideBar;
