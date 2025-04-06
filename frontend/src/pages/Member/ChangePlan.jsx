import React, {useEffect, useState} from 'react';
import { User, Mail, Phone, MapPin, Edit2, Check, ShoppingCart, CreditCard } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";
import Footer from "../../components/Member/Footer.jsx";
import axios from "axios";
import ChangePlanCard from "@/components/Member/ChangePlanCard.jsx";
// import { CheckCircle } from 'react-icons/fa';  // Example import


export default function Profile() {

    const [plans, setPlans] = useState([]); // State to store membership types

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get("http://localhost:8800/api/plans/all");
                setPlans(response.data); // Store membership plans in the state
            } catch (error) {
                console.error("Error fetching membership plans:", error);
            }
        };
        fetchPlans();
    }, []);

    // Fetch user details (current logged-in user)
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
                if (token) {
                    const response = await axios.get("http://localhost:8800/api/user/details", {
                        headers: {
                            Authorization: `Bearer ${token}`, // Send token in the Authorization header
                        }
                    });
                    setUserDetails(response.data); // Store user details in the state
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, []);

    // Fetch membership details
    useEffect(() => {
        const fetchMembershipDetails = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
                if (token) {
                    const response = await axios.get("http://localhost:8800/api/membership/details", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setMembershipDetails(response.data); // Store membership details in the state
                }
            } catch (error) {
                console.error("Error fetching membership details:", error);
            }
        };

        fetchMembershipDetails();
    }, []);

    const [editing, setEditing] = useState({
        personal: false,
        membership: false,
        fitness: false,
    });

    const [details, setDetails] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Fitness Street, NY 10001",
        plan: "12 Months Premium",
        startDate: "Jan 1, 2024",
        nextPayment: "Dec 31, 2024",
        sessions: "85 / 100",
        goal: "Lose 10 lbs",
        progress: "4 lbs lost",
        targetDate: "May 30, 2025",
        dailyActivity: "10,000 Steps",
    });

    const handleEditToggle = (section) => {
        setEditing((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleChange = (e, field) => {
        setDetails((prev) => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-gray-100" style={{ width: '100vw' }}>
            <Navbar />
            <div className="max-w-[1370px] mx-auto px-3 py-8">

                {/* Header for Membership Plans */}
                <div className="mb-4 mt-[60px] text-left">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>Membership Plans</h1>
                </div>

                {/* Right Section - Membership Details */}
                <div className="bg-white rounded-lg border-1 overflow-hidden p-6 mb-6 w-full h-[390px] mt-[10px]">
                    {/* Header Section */}
                    <div className="flex items-center mb-2">
                        <CreditCard size={26} className="text-black mt-1" />
                        <h2 className="text-xl font-semibold text-gray-900 text-left mr-2 ml-4" style={{ fontFamily: "Segoe UI" }}>
                            Current Plan
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 text-left font-mono font-medium">
                        Your active membership plan and details.
                    </p>

                    {/* Membership Box Section */}
                    <div className="bg-orange-50 p-4 rounded-lg mb-5 border-1" style={{ fontFamily: "Segoe UI" }}>
                        <div className="flex justify-between items-center text-left">
                            <h3 className="text-lg font-semibold text-gray-900">Premium Plan</h3>
                            <p className="text-lg text-gray-800">Rs.3000/month</p>
                        </div>
                        <div className="mt-3 text-left">
                            <h4 className="font-semibold text-gray-700">Features:</h4>
                            <ul className="list-disc pl-5 text-gray-950 mt-2 ml-2">
                                <li>Full gym access</li>
                                <li>Unlimited classes</li>
                                <li>1 personal training session/month</li>
                                <li>Access to pool and spa</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Membership Plans - Now Below the Current Plan */}
                    <div className="container mx-auto px-1 md:px-6 mt-5" style={{ fontFamily: "Segoe UI" }}>
                        <div className="mb-7 text-left">
                            <h2 className="text-2xl md:text-3xl font-bold ">Available Plans</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 shadow-nones">
                            {plans.map((plan, index) => (
                                <ChangePlanCard
                                    key={index}
                                    title={plan.plan_name}
                                    price={plan.plan_price}
                                    period={plan.plan_duration}
                                    features={plan.features}
                                    popular={!!plan.popular}
                                    delay={index * 0.1}
                                    shadow={false}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            {/*</div>*/}
            {/* <Footer /> */}
        </div>
    );

}
