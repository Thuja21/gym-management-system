import React, { useState } from "react";
import { Mail, Phone, MapPin, Edit2, Building2, Lock } from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";

function ProfilePage() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 w-[100vw]">
            <AdminSideBar />
            <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">

                {/* Profile & Info Card */}
                <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 w-[80vw] max-w-6xl mt-10" style={{marginLeft: "-40px"}}>
                    {/* Profile Picture */}
                    <div className="relative">
                        <img
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                        />
                        <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition">
                            <Edit2 className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Info Block */}
                    <div className="flex flex-col space-y-4 flex-1 text-[16px] font-sans text-gray-800">
                        {/* Name */}
                        <h2 className="text-2xl font-semibold text-gray-900">Saru Mahesh</h2>

                        {/* Details Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indigo-500" />
                                <p className="font-medium text-gray-500 w-24">Email:</p>
                                <p className="text-gray-700">saru@gmail.com</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-indigo-500" />
                                <p className="font-medium text-gray-500 w-24">Phone:</p>
                                <p className="text-gray-700">077 6345678</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-indigo-500" />
                                <p className="font-medium text-gray-500 w-24">Address:</p>
                                <p className="text-gray-700">Point Pedro, Jaffna</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                                <p className="font-medium text-gray-500 w-24">Gym:</p>
                                <p className="text-gray-700">JK Fitness</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Button (Separate) */}
                <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md text-lg font-medium shadow-md hover:bg-indigo-700 transition w-[80vw] max-w-6xl" style={{marginLeft: "-40px"}}
                >
                    Change Password
                </button>

                {/* Change Password Card (Only appears when button is clicked) */}
                {showPasswordForm && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-[80vw] max-w-6xl" style={{marginLeft: "-40px"}}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h3>
                        <form>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="current-password"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="new-password"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ProfilePage;
