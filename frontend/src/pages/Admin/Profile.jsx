import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Building, Calendar, Edit, Camera, Save } from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";
import { Paper, Typography, Avatar, Divider } from "@mui/material";

function AdminProfile() {
    const [profile, setProfile] = useState({
        name: "Santh",
        email: "jkfitnessppt@gmail.com",
        phone: "076 7870 779",
        address: "Sarayadi, PointPedro",
        department: "IT Administration",
        joinDate: "2025-01-15",
        bio: "Experienced administrator with over 8 years in system management and team leadership. Passionate about optimizing workflows and implementing efficient solutions."
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({...profile});
    const [loading, setLoading] = useState(false);

    // Function to handle profile update
    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            // Mock API call - replace with actual implementation
            // await fetch("http://localhost:8800/api/admin/profile/update", {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(editedProfile),
            // });

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            setProfile(editedProfile);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Handle file upload logic here
                console.log("File selected:", file.name);
                // You would typically upload this to your server
            }
        };
        input.click();
    };

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", scrollbarWidth: "none", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    Admin Profile
                </Typography>

                <Paper elevation={1} className="p-4 mb-6 rounded-lg" style={{ marginRight: "-5px" }}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                        {!isEditing ? (
                            <button
                                className="bg-red-900 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-red-800 transition"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit className="w-5 h-5 mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-gray-600 transition"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedProfile({...profile});
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition"
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>
                </Paper>

                <div className="bg-white rounded-xl shadow-sm" style={{ marginTop: "-10px", marginRight: "-5px", height: "auto" }}>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Profile Photo Section */}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <Avatar
                                        sx={{ width: 150, height: 150 }}
                                        src="/path-to-profile-image.jpg" // Replace with actual image path
                                        alt={profile.name}
                                    />
                                    {isEditing && (
                                        <button
                                            onClick={handlePhotoUpload}
                                            className="absolute bottom-0 right-0 bg-red-900 text-white p-2 rounded-full hover:bg-red-800"
                                        >
                                            <Camera size={20} />
                                        </button>
                                    )}
                                </div>
                                <h3 className="mt-4 text-xl font-bold">{profile.name}</h3>
                                <p className="text-gray-600">Administrator</p>
                            </div>

                            {/* Profile Details Section */}
                            <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedProfile.name}
                                                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <User className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={editedProfile.email}
                                                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <Mail className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={editedProfile.phone}
                                                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <Phone className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedProfile.address}
                                                    onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <MapPin className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.address}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedProfile.department}
                                                    onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <Building className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.department}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Join Date</label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={editedProfile.joinDate}
                                                    onChange={(e) => setEditedProfile({...editedProfile, joinDate: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <Calendar className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{new Date(profile.joinDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editedProfile.bio}
                                            onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{profile.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
