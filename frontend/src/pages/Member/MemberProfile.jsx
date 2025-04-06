import React, { useState } from 'react';
import {
    Calendar,
    Trophy,
    Target,
    Clock,
    Phone,
    Mail,
    MapPin,
    Star,
    Flag,
    Edit2,
    X,
    Camera
} from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "John Doe",
        phone: "+1 234 567 8900",
        email: "john.doe@example.com",
        address: "123 Fitness Street, NY",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileData(prev => ({
                ...prev,
                image: imageUrl
            }));
        }
    };

    return (
        <div className="h-screen bg-gray-100 overflow-y-auto"  style={{ width: '100vw' }}>
            <Navbar />
            <div className="h-full max-w-[1370px] mx-auto px-3 py-8">

                {/* Header for Profile */}
                <div className="mb-4 mt-[63px] text-left">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>Profile</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                    {/* Profile Card */}
                    <div className="md:col-span-1 ">
                        <div className="bg-white rounded-2xl p-6 relative border-1">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                {isEditing ? (
                                    <X className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <Edit2 className="w-5 h-5 text-gray-600" />
                                )}
                            </button>

                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative group">
                                    <img
                                        src={profileData.image}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    {isEditing && (
                                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer group-hover:bg-opacity-60 transition-all">
                                            <Camera className="w-8 h-8 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className="text-2xl font-bold text-gray-800 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-gray-800 font-mono">{profileData.name}</h2>
                                )}
                                <p className="text-gray-500 mb-2  font-mono">ID: GYM-2024-001</p>
                            </div>

                            <div className="mt-6 space-y-4 font-medium " style={{ fontFamily: "Segoe UI" }}>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 flex-shrink-0" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                                        />
                                    ) : (
                                        <span>{profileData.phone}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5 flex-shrink-0" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                                        />
                                    ) : (
                                        <span>{profileData.email}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 flex-shrink-0" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleInputChange}
                                            className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                                        />
                                    ) : (
                                        <span>{profileData.address}</span>
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Membership & Goals */}
                    <div className="md:col-span-2 space-y-6 ">
                        {/* Membership Details */}
                        <div className="bg-white rounded-xl p-6 border-1 text-left">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-xl" style={{ fontFamily: "Segoe UI" }}>
                                <Star className="w-5 h-5 text-yellow-500" />
                                Membership Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-gray-500 text-[17px]" style={{ fontFamily: "Segoe UI" }}>Start Date</p>
                                            <p className="font-medium font-mono">January 15, 2024</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-gray-500 text-[17px]" style={{ fontFamily: "Segoe UI" }}>Duration</p>
                                            <p className="font-medium font-mono">12 Months</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-gray-500 text-[17px]" style={{ fontFamily: "Segoe UI" }} >Plan Type</p>
                                            <p className="font-medium font-mono">Premium Plus</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Target className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-gray-500 text-[17px]" style={{ fontFamily: "Segoe UI" }}>Access Level</p>
                                            <p className="font-medium font-mono">All Facilities + Trainer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fitness Goals */}
                        <div className="bg-white rounded-xl border-1 p-6 text-left " style={{ fontStyle: "Segoe UI"}} >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Flag className="w-5 h-5 text-green-600" />
                                Fitness Goals
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-gray-800 font-medium">Primary Goal</h4>
                                    <p className="text-gray-600 mt-1 font-light">Build muscle mass and increase strength</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-800">Target Weight</h4>
                                        <p className="text-gray-600 mt-1">80 kg (Current: 75 kg)</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-800">Training Focus</h4>
                                        <p className="text-gray-600 mt-1">Strength Training + HIIT</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-800">Additional Notes</h4>
                                    <p className="text-gray-600 mt-1">Focus on proper form and gradual progression. Includes meal plan consultation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
