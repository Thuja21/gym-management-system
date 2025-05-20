import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Building, Calendar, Edit, Camera, Save, Award, Book, Clock } from "lucide-react";
import TrainerSideBar from "./TrainerSideBar.jsx"; // Assuming you have this component
import { Paper, Typography, Avatar, Divider, Chip } from "@mui/material";
import axios from "axios";

function TrainerProfile() {
    const [profile, setProfile] = useState({
        name: "john", // done
        email: "akshu@gmail.com", // done
        phone: "077 6343 288", // done
        address: "Puttalai,Pointpedro", // done
        specialization: "Zumba Instructor", // done
        experience: "7 years",
        joinDate: "2021-03-10",  // done
        certifications: ["NASM Certified Personal Trainer", "CrossFit Level 2", "Nutrition Specialist"],
        bio: "Dedicated fitness professional with expertise in strength training and rehabilitation. Passionate about helping clients achieve their fitness goals through personalized training programs and nutritional guidance.",
        workingHours: "Mon-Fri: 8:00 AM - 6:00 PM"
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({...profile});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchTrainerDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/trainers/trainer', {
                withCredentials: true
            });
            if (response.data.length !== 0) {
                console.log(response.data[0]);
                const retrievedProfile = {
                    name: response.data[0].full_name,
                    email: response.data[0].email,
                    phone: response.data[0].contact_no,
                    address: response.data[0].address,
                    specialization: response.data[0].specialization,
                    joined_date: response.data[0].registered_date,

                }
                setProfile(prev => ({ ...prev, ...retrievedProfile }));            }
        } catch (error) {
            console.error('Error fetching trainer data', error);
        }
    };

    useEffect(() => {
        fetchTrainerDetails();
    }, []);

    // Function to handle profile update
    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            // Mock API call - replace with actual implementation
            // await fetch("http://localhost:8800/api/trainer/profile/update", {
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

    // Function to handle certification changes
    const handleCertificationChange = (index, value) => {
        const updatedCertifications = [...editedProfile.certifications];
        updatedCertifications[index] = value;
        setEditedProfile({...editedProfile, certifications: updatedCertifications});
    };

    const addCertification = () => {
        setEditedProfile({
            ...editedProfile,
            certifications: [...editedProfile.certifications, ""]
        });
    };

    const removeCertification = (index) => {
        const updatedCertifications = [...editedProfile.certifications];
        updatedCertifications.splice(index, 1);
        setEditedProfile({...editedProfile, certifications: updatedCertifications});
    };

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <TrainerSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", scrollbarWidth: "none", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    Trainer Profile
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
                                        src="/path-to-trainer-image.jpg" // Replace with actual image path
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
                                <p className="text-gray-600">Fitness Trainer</p>
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
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Specialization</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedProfile.specialization}
                                                    onChange={(e) => setEditedProfile({...editedProfile, specialization: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <Award className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.specialization}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Experience</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedProfile.experience}
                                                    onChange={(e) => setEditedProfile({...editedProfile, experience: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <Book className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.experience}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Working Hours</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedProfile.workingHours}
                                                    onChange={(e) => setEditedProfile({...editedProfile, workingHours: e.target.value})}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <Clock className="w-5 h-5 text-red-900 mr-2" />
                                                    <span className="text-gray-800">{profile.workingHours}</span>
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
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Certifications</label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            {editedProfile.certifications.map((cert, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={cert}
                                                        onChange={(e) => handleCertificationChange(index, e.target.value)}
                                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                    <button
                                                        onClick={() => removeCertification(index)}
                                                        className="bg-red-100 text-red-900 p-2 rounded-lg hover:bg-red-200"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={addCertification}
                                                className="mt-2 bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                                            >
                                                Add Certification
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.certifications.map((cert, index) => (
                                                <Chip
                                                    key={index}
                                                    label={cert}
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: '#7f1d1d',
                                                        color: '#7f1d1d',
                                                        '&:hover': { backgroundColor: 'rgba(127, 29, 29, 0.04)' }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
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

export default TrainerProfile;
