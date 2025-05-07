import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Clock, Edit } from "lucide-react";
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
    Typography,
    FormControl,
    InputLabel,
    Select,
    Chip
} from "@mui/material";

function ViewSchedules() {
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filterType, setFilterType] = useState("all");
    const [filterDate, setFilterDate] = useState("");

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

    // Filter schedules based on selected filters
    const filteredSchedules = schedules.filter(schedule => {
        // Filter by type
        if (filterType !== "all" && schedule.schedule_type !== filterType) {
            return false;
        }

        // Filter by date (for one-time schedules)
        if (filterDate && schedule.schedule_type === 'one-time') {
            const scheduleDate = new Date(schedule.schedule_date).toISOString().split('T')[0];
            if (scheduleDate !== filterDate) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="bg-gray-50" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", scrollbarWidth: "none", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom sx={{ color: "#4A5568" }}>
                    Announcements
                </Typography>

                <div
                    className="bg-white rounded-xl shadow-sm p-4 mb-4"
                    style={{ marginRight: "-5px", borderLeft: "3px solid #E2E8F0" }}
                >
                    <Typography variant="h6" gutterBottom sx={{ color: "#4A5568" }}>
                        Filter Schedules
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Schedule Type</InputLabel>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                label="Schedule Type"
                                sx={{
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                }}
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                <MenuItem value="one-time">One-time</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Filter by Date"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            fullWidth
                            disabled={filterType === "weekly"}
                            sx={{
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" },
                                "& .Mui-disabled": { bgcolor: "#F7FAFC" }
                            }}
                        />
                    </div>

                    {(filterType !== "all" || filterDate) && (
                        <div className="mt-3 flex gap-2">
                            <Typography variant="body2" sx={{ color: "#718096" }}>Active filters:</Typography>
                            {filterType !== "all" && (
                                <Chip
                                    label={`Type: ${filterType}`}
                                    size="small"
                                    onDelete={() => setFilterType("all")}
                                    sx={{
                                        bgcolor: "#EDF2F7",
                                        color: "#4A5568",
                                        "& .MuiChip-deleteIcon": { color: "#718096" }
                                    }}
                                />
                            )}
                            {filterDate && (
                                <Chip
                                    label={`Date: ${filterDate}`}
                                    size="small"
                                    onDelete={() => setFilterDate("")}
                                    sx={{
                                        bgcolor: "#EDF2F7",
                                        color: "#4A5568",
                                        "& .MuiChip-deleteIcon": { color: "#718096" }
                                    }}
                                />
                            )}
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setFilterType("all");
                                    setFilterDate("");
                                }}
                                sx={{
                                    borderColor: "#CBD5E0",
                                    color: "#4A5568",
                                    "&:hover": {
                                        borderColor: "#A0AEC0",
                                        bgcolor: "#F7FAFC"
                                    }
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>

                <div
                    className="bg-white rounded-xl shadow"
                    style={{
                        marginTop: "-10px",
                        marginRight: "-5px",
                        height: "100%",
                        fontFamily: "sans-serif"
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        {loading && <p className="p-6 text-gray-500">Loading schedules...</p>}
                        {error && <p className="p-6 text-red-500">Error: {error}</p>}
                        {!loading && filteredSchedules.length === 0 && (
                            <p className="p-6 text-gray-500">No schedules match your filter criteria.</p>
                        )}
                        {filteredSchedules
                            .sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime())
                            .map((schedule) => (
                                <div
                                    key={schedule.schedule_id}
                                    className="p-6 hover:bg-gray-50 border rounded-lg"
                                    style={{
                                        borderColor: "#EDF2F7",
                                        transition: "all 0.2s ease",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-full text-left">
                                            <h3 className="text-lg font-semibold" style={{ color: "#2D3748" }}>{schedule.title}</h3>
                                            {schedule.notes && (
                                                <p className="mt-1 text-sm" style={{ color: "#718096" }}>{schedule.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    {schedule.schedule_type === 'one-time' &&
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div className="flex items-center text-sm" style={{ color: "#4A5568" }}>
                                                <Calendar className="w-4 h-4 mr-2" style={{ color: "#718096" }} />
                                                {new Date(schedule.schedule_date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm" style={{ color: "#4A5568" }}>
                                                <Clock className="w-4 h-4 mr-2" style={{ color: "#718096" }} />
                                                {schedule.schedule_time_slot} - {schedule.end_time}
                                            </div>
                                        </div>
                                    }
                                    {schedule.schedule_type === 'weekly' && schedule.weekly_schedule?.map((slot, idx) => {
                                        const formatTime = (timeStr) => {
                                            const [hour, minute] = timeStr.split(':');
                                            const date = new Date();
                                            date.setHours(parseInt(hour), parseInt(minute));
                                            return date.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            }).replace(':', '.');
                                        };

                                        return (
                                            <div key={idx} className="flex items-center text-sm mt-2" style={{ color: "#4A5568" }}>
                                                <Clock className="w-4 h-4 mr-2" style={{ color: "#718096" }} />
                                                <span style={{ fontWeight: 500 }}>{slot.day}</span>: {formatTime(slot.start_time)} to {formatTime(slot.end_time)}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewSchedules;
