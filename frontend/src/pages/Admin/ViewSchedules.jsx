import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Search, Clock , Edit} from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

function ViewSchedules() {
    const [schedules, setSchedules] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    // Fetch schedules when the component loads
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/schedules/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch schedules.");
                }
                const data = await response.json();
                console.log(data);
                setSchedules(data); // Update schedules state with the fetched data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []); // Empty dependency array to fetch data only once on mount


    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto",scrollbarWidth: "none" ,marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    Announcements
                </Typography>

                <div
                    className="bg-white rounded-xl shadow-sm p-3 mb-4"
                    style={{ marginRight: "-5px" }}
                >
                    <div className="flex items-center">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search schedules..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow"
                    style={{
                        marginTop: "-10px",
                        marginRight: "-5px",
                        height: "100%",
                        fontFamily: "sans-serif"
                    }}
                ><div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y divide-gray-200">
                    {/*{loading && <p>Loading schedules...</p>}*/}
                    {error && <p className="text-red-500">Error: {error}</p>}
                    {schedules
                        .sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime())
                        .map((schedule) => (
                            <div key={schedule.schedule_id} className="p-6 hover:bg-gray-50 border rounded-lg shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="w-full text-left">
                                        <h3 className="text-lg font-semibold text-gray-900">{schedule.title}</h3>
                                        {schedule.notes && (
                                            <p className="mt-1 text-sm text-gray-600">{schedule.notes}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(schedule.schedule_id)} className="p-2 text-gray-400 hover:text-blue-500">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(schedule.schedule_id)} className="p-2 text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(schedule.schedule_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {schedule.schedule_time_slot} - {schedule.end_time}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                </div>
            </div>
        </div>
    );
}

export default ViewSchedules;
