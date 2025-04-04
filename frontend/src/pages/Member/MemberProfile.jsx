// import React from 'react';
// import { User, Mail, Phone, MapPin } from 'lucide-react';
// import Navbar from "../../components/Member/Navbar.jsx";
//
// export default function Profile() {
//     return (
//         <div className="min-h-screen bg-gray-50" style={{width:'100vw'}}>
//             <Navbar />
//         <div className="max-w-7xl mx-auto px-4 py-8" >
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 mt-16">
//                 <div className="bg-blue-600 h-32"></div>
//                 <div className="px-6 py-4">
//                     <div className="flex items-center">
//                         <div className="relative -mt-16">
//                             <div className="bg-white p-2 rounded-full">
//                                 <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
//                                     <User className="w-12 h-12 text-gray-400" />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="ml-6 -mt-6">
//                             <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
//                             {/*<p className="text-gray-600">Premium Member</p>*/}
//                         </div>
//                     </div>
//
//                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-4">
//                             <h2 className="text-xl font-semibold text-left mt-5">Personal Information</h2>
//                             <div className="space-y-2">
//                                 <div className="flex items-center text-gray-600">
//                                     <Mail className="w-5 h-5 mr-2" />
//                                     <span>john.doe@example.com</span>
//                                 </div>
//                                 <div className="flex items-center text-gray-600">
//                                     <Phone className="w-5 h-5 mr-2" />
//                                     <span>+1 (555) 123-4567</span>
//                                 </div>
//                                 <div className="flex items-center text-gray-600">
//                                     <MapPin className="w-5 h-5 mr-2" />
//                                     <span>123 Fitness Street, NY 10001</span>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="space-y-4">
//                             <h2 className="text-xl font-semibold">Membership Details</h2>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Plan</span>
//                                     <span className="font-medium">12 Months Premium</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Start Date</span>
//                                     <span className="font-medium">Jan 1, 2024</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Next Payment</span>
//                                     <span className="font-medium">Dec 31, 2024</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </div>
//     );
// }


// import React from 'react';
// import { User, Mail, Phone, MapPin, Dumbbell, Calendar } from 'lucide-react';
//
// export default function GymProfile() {
//     return (
//         <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Left Section - Profile Card */}
//             <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
//                 <div className="flex flex-col items-center">
//                     <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
//                         <User className="w-12 h-12 text-gray-400" />
//                     </div>
//                     <h1 className="text-xl font-bold text-gray-900 mt-4">John Doe</h1>
//                     <p className="text-gray-600">Premium Member</p>
//                 </div>
//                 <div className="mt-6 space-y-2">
//                     <div className="flex items-center text-gray-600">
//                         <Mail className="w-5 h-5 mr-2" />
//                         <span>john.doe@example.com</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                         <Phone className="w-5 h-5 mr-2" />
//                         <span>+1 (555) 123-4567</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                         <MapPin className="w-5 h-5 mr-2" />
//                         <span>123 Fitness Street, NY 10001</span>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Right Section - Membership & Stats */}
//             <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
//                 <h2 className="text-xl font-semibold mb-4">Membership Details</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex justify-between">
//                         <span className="text-gray-600">Plan</span>
//                         <span className="font-medium">12 Months Premium</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-gray-600">Start Date</span>
//                         <span className="font-medium">Jan 1, 2024</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-gray-600">Next Payment</span>
//                         <span className="font-medium">Dec 31, 2024</span>
//                     </div>
//                 </div>
//
//                 <h2 className="text-xl font-semibold mt-6 mb-4">Fitness Stats</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex items-center justify-between">
//                         <Dumbbell className="w-6 h-6 text-blue-600" />
//                         <span className="text-gray-600">Total Workouts</span>
//                         <span className="font-medium">45 Sessions</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                         <Calendar className="w-6 h-6 text-blue-600" />
//                         <span className="text-gray-600">Joined Since</span>
//                         <span className="font-medium">Jan 2023</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Check  } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";
import Footer from "../../components/Member/Footer.jsx";

export default function Profile() {

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
            <div className="max-w-6xl mx-auto px-3 py-8 grid grid-cols-1 md:grid-cols-4 gap-[50px]">

                {/* Left Section - Personal Details */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-6 mt-[70px] ml-[-95px] h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
                        <button onClick={() => handleEditToggle("personal")} className="text-blue-600 hover:underline">
                            {editing.personal ? <Check size={20} /> : <Edit2 size={20} />}
                        </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-col items-center">
                            <div className="w-28 h-28 bg-blue-900 text-white flex items-center justify-center rounded-full text-3xl font-bold">
                                J
                            </div>
                            {editing.personal ? (
                                <input type="text" value={details.name} onChange={(e) => handleChange(e, "name")} className="mt-4 text-center w-full p-1 border rounded" />
                            ) : (
                                <h1 className="text-xl font-bold text-gray-900 mt-4">{details.name}</h1>
                            )}
                            <p className="text-gray-600">Premium Member</p>
                        </div>
                        <div className="mt-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
                            <div className="space-y-2">
                                {["email", "phone", "address"].map((field, idx) => (
                                    <div key={idx} className="flex items-center text-gray-600">
                                        {field === "email" && <Mail className="w-5 h-5 mr-2" />}
                                        {field === "phone" && <Phone className="w-5 h-5 mr-2" />}
                                        {field === "address" && <MapPin className="w-5 h-5 mr-2" />}
                                        {editing.personal ? (
                                            <input type="text" value={details[field]} onChange={(e) => handleChange(e, field)} className="w-full p-1 border rounded" />
                                        ) : (
                                            <span>{details[field]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Membership Details */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden p-6 mb-6 mt-[70px] w-[920px] h-[330px]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 text-left">Membership Details</h2>
                        <button onClick={() => handleEditToggle("membership")} className="text-blue-600 hover:underline">
                            {editing.membership ? <Check size={20} /> : <Edit2 size={20} />}
                        </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-4">
                            {["plan", "startDate", "nextPayment", "sessions"].map((field, idx) => (
                                <div key={idx} className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">{field.replace(/([A-Z])/g, " $1")}</span>
                                    {editing.membership ? (
                                        <input type="text" value={details[field]} onChange={(e) => handleChange(e, field)} className="w-1/2 p-1 border rounded" />
                                    ) : (
                                        <span className="font-medium">{details[field]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* New Section Below the Right Section */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden p-6 mb-6 mt-[-200px] ml-[295px] w-[920px] h-[325px]">
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1 text-left">Fitness Goals</h2>
                    <button onClick={() => handleEditToggle("fitness")} className="text-blue-600 hover:underline">
                        {editing.fitness ? <Check size={20} /> : <Edit2 size={20} />}
                    </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-4">
                            {["goal", "progress", "targetDate", "dailyActivity"].map((field, idx) => (
                                <div key={idx} className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">{field.replace(/([A-Z])/g, " $1")}</span>
                                    {editing.fitness ? (
                                        <input type="text" value={details[field]} onChange={(e) => handleChange(e, field)} className="w-1/2 p-1 border rounded" />
                                    ) : (
                                        <span className="font-medium">{details[field]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
