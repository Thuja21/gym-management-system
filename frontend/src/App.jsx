import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import MemberDashboard from "./pages/Member/MemberDashboard.jsx";
import CustomerDashboard from "./pages/Customer/CustomerDashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ManageMembers from "./pages/Admin/ManageMembers.jsx";
import Announcement from "./pages/Admin/Announcement.jsx";



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
        <Route path="/members" element={<ManageMembers />} />
        <Route path="/announcements" element={<Announcement />} />
      </Routes>
    </Router>
  );
}

export default App;
