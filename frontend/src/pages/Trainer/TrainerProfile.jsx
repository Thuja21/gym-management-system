import React, {useEffect, useState} from 'react';
import {Calendar,
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
import axios from "axios";
import image from "../../assets/images/Profile.png"
import TopBar from "@/components/TopBar.jsx";
import TrainerSideBar from "@/pages/Trainer/TrainerSideBar.jsx";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [profileData, setProfileData] = useState({
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
    });

    const [trainerData, setTrainerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMemberDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/trainers/trainer', {
                withCredentials: true
            });
            console.log(response.data);
            setTrainerData(response.data);
        } catch (error) {
            console.error('Error fetching trainer data', error);
            setTrainerData([]);
        }
    };

    useEffect(() => {
        fetchMemberDetails();
    }, []);

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
        <div>
            <TopBar title="Profile" />
            <TrainerSideBar />
            <div className="h-screen bg-gray-100 overflow-y-auto ml-[120px]" style={{ width: '100vw' }}>
                <div className="h-full max-w-[1200px] mx-auto px-3 py-8 mt-3">
                    {trainerData.map((trainer, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-[40px]">
                                {/* Profile Card */}
                                <div className="md:col-span-1">
                                    <div className="bg-white rounded-2xl p-6 relative border-1">
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            {isEditing ? <X className="w-5 h-5 text-gray-600" /> : <Edit2 className="w-5 h-5 text-gray-600" />}
                                        </button>

                                        <div className="flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative group">
                                                <img
                                                    src={image}
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
                                                    value={trainer.full_name}
                                                    onChange={handleInputChange}
                                                    className="text-2xl font-bold text-gray-800 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                                                />
                                            ) : (
                                                <h2 className="text-2xl font-bold text-gray-800 font-mono">{trainer.full_name}</h2>
                                            )}
                                            <p className="text-gray-500 mb-2 font-mono">ID: GYM-Trainer-{trainer.trainer_id}</p>
                                        </div>

                                        <div className="mt-6 space-y-4 font-medium" style={{ fontFamily: "Segoe UI" }}>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Phone className="w-5 h-5 flex-shrink-0" />
                                                <span>{trainer.contact_no}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Mail className="w-5 h-5 flex-shrink-0" />
                                                <span>{trainer.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <MapPin className="w-5 h-5 flex-shrink-0" />
                                                <span>{trainer.address}</span>
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

                                {/* Trainer Info Section */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="bg-white rounded-xl p-6 border-1 text-left">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-xl" style={{ fontFamily: "Segoe UI" }}>
                                            <Star className="w-5 h-5 text-yellow-500" />
                                            Trainer Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-gray-500 text-[17px]">Date of Birth</p>
                                                        <p className="font-medium font-mono">{trainer.dob}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-gray-500 text-[17px]">Age</p>
                                                        <p className="font-medium font-mono">{trainer.age}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Trophy className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-gray-500 text-[17px]">Specialization</p>
                                                        <p className="font-medium font-mono">{trainer.specialization || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Target className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-gray-500 text-[17px]">Registered Date</p>
                                                        <p className="font-medium font-mono">{trainer.registered_date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border-1 p-6 text-left" style={{ fontFamily: "Segoe UI" }}>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Flag className="w-5 h-5 text-green-600" />
                                            Change Password
                                        </h3>

                                        {!showForm ? (
                                            <button
                                                onClick={() => setShowForm(true)}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Change Password
                                            </button>
                                        ) : (
                                            <form className="space-y-4 mt-4">
                                                <div>
                                                    <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                                                    <input type="password" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-700 mb-1">New Password</label>
                                                    <input type="password" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
                                                    <input type="password" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="submit"
                                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Update Password
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowForm(false)}
                                                        className="text-sm text-red-600 hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                {/* Trainer Bio & Achievements */}
                                <div className="bg-white rounded-xl p-6 border-1 text-left " style={{ fontFamily: "Segoe UI" }}>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 ">
                                        <Trophy className="w-5 h-5 text-purple-600" />
                                        Trainer Bio & Achievements
                                    </h3>
                                    <div className="space-y-3 text-gray-700 text-[15px] leading-relaxed">
                                        <p>
                                            {trainer.full_name} is a certified fitness trainer with a strong background in health and wellness. With over {trainer.experience || '5'} years of experience, they have helped hundreds of clients achieve their fitness goals through personalized programs and continuous motivation.
                                        </p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>🏅 Certified in Advanced Strength & Conditioning</li>
                                            <li>🎖 Participated in National Fitness Expo 2023</li>
                                            <li>💼 Trained 150+ clients successfully</li>
                                            <li>📚 Holds workshops on Nutrition & Mental Health</li>
                                        </ul>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;