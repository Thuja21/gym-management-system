import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword.jsx";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
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
import TrainerDashboard from "./pages/Trainer/TrainerDashboard.jsx";
import ViewMembers from "./pages/Trainer/ViewMembers.jsx"
import ViewMembers1 from "./pages/Trainer/ViewMembers1.jsx"
import ProfilePage from "./pages/Admin/Profile.jsx";
import Schedule from "./pages/Trainer/Schedule.jsx";
import Notification from "./pages/Member/Notification.jsx";
import AttendanceHistory from "./pages/Member/AttendanceHistory.jsx";
import MemberProfile from "./pages/Member/MemberProfile.jsx";
import PaymentHistory from "./pages/Member/PaymentHistory.jsx";
import ProgressHistory from "./pages/Member/ProgressHistory.jsx";
import MemberLogin from "./pages/Member/MemberLogin.jsx";
import ChangePlan from "@/pages/Member/ChangePlan.jsx";
import ChangePlanCheckout from "@/pages/Member/ChangePlanCheckout.jsx";
import TrainerProfile from "@/pages/Trainer/TrainerProfile.jsx";
import NotificationTrainer from "@/pages/Trainer/NotificationTrainer.jsx";
import ManageSupplementReservation from "@/pages/Admin/ManageSupplementReservation.jsx";

export const ROUTES = {
  CHANGE_PLAN: "/changePlan",
  SIGNUP: "/signup",
};

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
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
          <Route path="/managereservation" element={<ManageSupplementReservation />} />
          <Route path="/schedules" element={<ViewSchedules />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/home" element={<Home />} />
          <Route path="/supplements" element={<Supplements />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/classes" element={<Classes />} />

          <Route path="/notification" element={<Notification />} />
          <Route path="/attendanceHistory" element={<AttendanceHistory />} />
          <Route path="/memberProfile" element={<MemberProfile />} />
          <Route path="/memberLogin" element={<MemberLogin />} />
          <Route path="/paymentHistory" element={<PaymentHistory />} />
          <Route path="/progress" element={<ProgressHistory />} />
          <Route path="/changePlan" element={<ChangePlan />} />

          <Route path="/checkout" element={<ChangePlanCheckout />} />


          <Route path="/trainerDashboard" element={<TrainerDashboard />} />
          <Route path="/members1" element={<ViewMembers />} />
          <Route path="/members2" element={<ViewMembers1 />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/trainerProfile" element={<TrainerProfile />} />
          <Route path="/trainernotification" element={<NotificationTrainer />} />
        </Routes>
      </Router>
  );
}

export default App;
