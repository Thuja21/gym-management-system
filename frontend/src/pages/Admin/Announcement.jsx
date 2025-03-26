import React, { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Calendar, Search ,Megaphone} from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";
import { Typography } from "@mui/material";

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        date: "",
    });

    // Fetch announcements when the component loads
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/announcements/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch announcements.");
                }
                const data = await response.json();
                console.log(data);
                setAnnouncements(data); // Update announcements state with the fetched data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };fetchAnnouncements();
    }, []); // Empty dependency array to fetch data only once on mount

    // Handle Add Trainer dialog submission
    const handleAddAnnouncement = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/announcements/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newAnnouncement),
                });

                if (!response.ok) {
                    throw new Error("Failed to add new announcement.");
                }
                alert("Announcement added successfully!");
                setLoading(true);
                setShowForm(false); // Close the dialog
            } catch (err) {
                setError(err.message);
            }
    };

    // Handle Delete button click
    const handleDelete = async (announcementId) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/announcements/delete/${announcementId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete announcement.");
                }
                setAnnouncements((prevAnnouncement) => prevAnnouncement.filter((announcement) => announcement.announcement_id !== announcementId));
                alert("Announcement deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };


    return (
        <div className="bg-gray-100"  style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto",scrollbarWidth: "none" ,marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    Announcements
                </Typography>

                {loading && <p>Loading announcements...</p>} {/* Show loading message */}
                {error && <p>Error: {error}</p>} {/* Show error message */}

                <div className="bg-white rounded-xl shadow-sm p-3 mb-4" style={{ marginRight: "-5px" }}>
                    <div className="flex items-center">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="ml-4 flex space-x-2">
                            <button
                                className="bg-red-900 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-red-800 transition"
                                onClick={() => setShowForm(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                New Announcement
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm" style={{ marginTop: "-10px", marginRight: "-5px", height: "100%" }}>
                    <div className="space-y-4 p-3">
                        {announcements.length > 0 ? (
                            announcements.map((announcement) => (
                                <div
                                    key={announcement.announcement_id}
                                    className="p-2 border border-gray-100 rounded-lg hover:border-gray-200 transition-all hover:shadow-md"
                                >
                                    <div className="w-full p-3 rounded-2xl flex justify-between items-center bg-gradient-to-r from-gray-100 via-gray-300 to-blue-50" >
                                        <div className="space-y-2">
                                            <h3 className="text-left flex items-center gap-2 leading-tight text-blue-900" style={{ fontSize: "20px", fontWeight: "bold" , fontFamily: "Montserrat"}}>
                                                 {announcement.announcement_title}
                                            </h3>
                                            <p className="leading-relaxed text-md text-gray-700" >
                                                {announcement.announcement_content}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4 text-indigo-500" />
                                                <span>{new Date(announcement.posted_date ).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(announcement.announcement_id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-200 rounded-full"
                                        >
                                            <Trash2 className="h-6 w-6 " />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No announcements yet</h3>
                                <p className="text-gray-500">Create one to get started!</p>
                            </div>
                        )}
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                            <h2 className="text-2xl font-bold mb-4">New Announcement</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddAnnouncement(); }}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={newAnnouncement.title}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Enter announcement title"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                            Content
                                        </label>
                                        <textarea
                                            id="content"
                                            value={newAnnouncement.content}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Enter announcement content"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
                                        >
                                            Add Announcement
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Announcements;
