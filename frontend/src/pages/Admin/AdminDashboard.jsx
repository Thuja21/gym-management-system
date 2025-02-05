import React from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import dashBarImg from "../../assets/images/dashBarImg.png";
import "./Admin.css";
import {Box} from "@mui/material"; // Import the CSS file

const AdminDashboard = () => {
    return (
        <div className="dashboard-container">
            <AdminSideBar />
            <Box className="gradient-bar" />
            <img
                src={dashBarImg}
                alt="description"
                className="dashboard-image"
            />
            <Box className="box box1" />
            <Box className="box box2" />
            <Box className="box box3" />
            <Box className="box box4" />
            <Box className="large-box large-box1" />
            <Box className="large-box large-box2" />
        </div>
    );
};

export default AdminDashboard;
