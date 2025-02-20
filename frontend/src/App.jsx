import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import MemberDashboard from "./pages/Member/MemberDashboard.jsx";
import CustomerDashboard from "./pages/Customer/CustomerDashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ManageMembers from "./pages/Admin/ManageMembers.jsx";
import ManageTrainers from "./pages/Admin/ManageTrainers.jsx";
import ManagePlans from "./pages/Admin/ManagePlans.jsx";
import ManageSupplements from "./pages/Admin/ManageSupplements.jsx";
import GymEquipments from "./pages/Admin/GymEquipment.jsx";
import Attendance from "./pages/Admin/Attendance.jsx";
import Payments from "./pages/Admin/Payments.jsx";
import Report from "./pages/Admin/Report.jsx";
import ViewSchedules from "./pages/Admin/ViewSchedules.jsx";
import Announcement from "./pages/Admin/Announcement.jsx";
import {Dashboard} from "@mui/icons-material";
import TopBar from "./components/TopBar.jsx";
import AdminSideBar from "./pages/Admin/AdminSideBar.jsx";
import AdminDashboard1 from "./pages/Admin/AdminDashboard1.jsx";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/memberDashboard" element={<MemberDashboard />} />
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/adminDashboard1" element={<AdminDashboard1 />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/members" element={<ManageMembers />} />
        <Route path="/trainers" element={<ManageTrainers />} />
        <Route path="/announcements" element={<Announcement />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/plans" element={<ManagePlans />} />
        <Route path="/equipments" element={<GymEquipments />} />
        <Route path="/supplements" element={<ManageSupplements />} />
        <Route path="/schedules" element={<ViewSchedules />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/report" element={<Report />} />
        <Route path="/top" element={<TopBar />} />
        <Route path="/side" element={<AdminSideBar />} />


      </Routes>
    </Router>
  );
}

export default App;
