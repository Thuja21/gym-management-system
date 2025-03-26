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
import Supplements from "./pages/Home/Supplements.jsx";
import Membership from "./pages/Home/Membership.jsx";
import About from "./pages/Home/About.jsx";
import Contact from "./pages/Home/Contact.jsx";
import Classes  from "./pages/Home/Classes.jsx";
import Trainers from "./pages/Home/Trainers.jsx";
import TrainerDashboard from "./pages/Trainer/TrainerDashboard.jsx";
import ViewMembers from "./pages/Trainer/ViewMembers.jsx"
import ViewMembers1 from "./pages/Trainer/ViewMembers1.jsx"
import ProfilePage from "./pages/Admin/Profile.jsx";
import Schedule from "./pages/Trainer/Schedule.jsx";




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
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/members" element={<ManageMembers />} />
        <Route path="/managetrainers" element={<ManageTrainers />} />
        <Route path="/announcements" element={<Announcement />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/plans" element={<ManagePlans />} />
        <Route path="/equipments" element={<GymEquipments />} />
        <Route path="/managesupplements" element={<ManageSupplements />} />
        <Route path="/schedules" element={<ViewSchedules />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/report" element={<Report />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/home" element={<Home />} />
        <Route path="/supplements" element={<Supplements />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/about" element={<About />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/classes" element={<Classes />} />

        <Route path="/trainerDashboard" element={<TrainerDashboard />} />
        <Route path="/members1" element={<ViewMembers />} />
        <Route path="/members2" element={<ViewMembers1 />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

export default App;
