import React, {useEffect, useState} from 'react';
import { User, Mail, Phone, MapPin, Edit2, Check, ShoppingCart, CreditCard } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";
import Footer from "../../components/Member/Footer.jsx";
import axios from "axios";
import ChangePlanCard from "@/components/Member/ChangePlanCard.jsx";
// import { CheckCircle } from 'react-icons/fa';  // Example import


export default function Profile() {

    const [plans, setPlans] = useState([]); // State to store membership types
    const [currentPlanData, setCurrentPlanData] = useState([]);

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

    const fetchCurrentPlanData = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/plans/member', {
                withCredentials: true
            });
            console.log(response.data);
            setCurrentPlanData(response.data); // Set the fetched data to state
        } catch (error) {
            console.error('Error fetching plan data', error);
            setCurrentPlanData([]); // <-- This is the fix
        }
    };

    useEffect(() => {
        fetchCurrentPlanData();
    }, []);

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

                <div>
                    {/* Membership Box Section */}
                    {currentPlanData.map((plan, index) => (
                        <div key={index} className="bg-orange-50 p-4 rounded-lg mb-5 border-1" style={{ fontFamily: "Segoe UI" }}>
                            <div className="flex justify-between items-center text-left">
                                <h3 className="text-lg font-semibold text-gray-900">{plan.plan_name}</h3>
                                <p className="text-lg text-gray-800">Rs.{plan.plan_price}/month</p>
                            </div>
                            <div className="mt-3 text-left">
                                <h4 className="font-semibold text-gray-700">Features:</h4>
                                <ul className="list-disc pl-5 text-gray-950 mt-2 ml-2">
                                    {typeof plan.features === "string" &&
                                        plan.features.split(",").map((feature, index) => (
                                            <li key={index}>{feature.trim()}</li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    ))}
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
                                    plan_id={plan.plan_id}
                                    features={plan.features}
                                    isCurrentPlan={currentPlanData.some(currentPlan => currentPlan.plan_id === plan.plan_id)}
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
