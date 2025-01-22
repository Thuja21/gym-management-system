// MemberDashboard.jsx
import React from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import TopBar from "../../components/TopBar.jsx";


const Announcement = () => {
    return (
        <div>
            <TopBar/>
            <AdminSideBar/>
            <h1>Welcome to the Customer Dashboard</h1>
        </div>
    );
};

export default Announcement;
