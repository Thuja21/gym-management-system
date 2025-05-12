import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Search, Clock, Edit } from "lucide-react";
import TrainerSideBar from "./TrainerSideBar.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Box,
    MenuItem,
    TextField,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    InputLabel,
    Select,
    Chip
} from "@mui/material";
import AdminSideBar from "../Admin/AdminSideBar.jsx";
import axios from "axios";

function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [newSchedule, setNewSchedule] = useState({
        title: "",
        notes: "",
        weekly_schedule: []
    });
    const [scheduleType, setScheduleType] = useState('one-time');
    const [editScheduleType, setEditScheduleType] = useState("one-time");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);

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

    // Fetch schedules when the component loads
    useEffect(() => {
        fetchSchedules();
    }, []); // Empty dependency array to fetch data only once on mount

    const fetchScheduleData = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/schedules/schedule', {
                withCredentials: true
            });
            console.log(response.data);
            setScheduleData(response.data); // Set the fetched data to state
        } catch (error) {
            console.error('Error fetching plan data', error);
            setScheduleData([]); // <-- This is the fix
        }
    };

    useEffect(() => {
        fetchScheduleData();
    }, []);

    const handleScheduleTypeChange = (event) => {
        setScheduleType(event.target.value);
    };

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const addWeeklySlot = () => {
        setNewSchedule((prev) => ({
            ...prev,
            weekly_schedule: [...prev.weekly_schedule, { day: "", start_time: "", end_time: "" }],
        }));
    };

    const handleWeeklyChange = (index, field, value) => {
        const updatedSlots = [...newSchedule.weekly_schedule];
        updatedSlots[index][field] = value;
        setNewSchedule((prev) => ({ ...prev, weekly_schedule: updatedSlots }));
    };

    const removeWeeklySlot = (index) => {
        setNewSchedule((prev) => ({
            ...prev,
            weekly_schedule: prev.weekly_schedule.filter((_, i) => i !== index),
        }));
    };

    const addEditWeeklySlot = () => {
        setSelectedSchedule((prev) => ({
            ...prev,
            weekly_schedule: [...(prev?.weekly_schedule || []), { day: "", start_time: "", end_time: "" }],
        }));
    };

    const handleEditWeeklyChange = (index, field, value) => {
        const updatedSlots = [...(selectedSchedule.weekly_schedule || [])];
        updatedSlots[index][field] = value;
        setSelectedSchedule((prev) => ({ ...prev, weekly_schedule: updatedSlots }));
    };

    const removeEditWeeklySlot = (index) => {
        setSelectedSchedule((prev) => ({
            ...prev,
            weekly_schedule: prev.weekly_schedule.filter((_, i) => i !== index),
        }));
    };

    const handleEditScheduleTypeChange = (event) => {
        const value = event.target.value;
        setEditScheduleType(value); // This sets the radio button state
        setSelectedSchedule((prev) => ({
            ...prev,
            schedule_type: value, // This updates the actual data object
        }));
    };

    useEffect(() => {
        if (selectedSchedule?.schedule_type) {
            setEditScheduleType(selectedSchedule.schedule_type);
        }
    }, [selectedSchedule]);

    const generateTimeOptions = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hh = h.toString().padStart(2, '0');
                const mm = m.toString().padStart(2, '0');
                options.push(`${hh}:${mm}`);
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setNewSchedule((prev) => ({
            ...prev,
            [name]: value,
        }));
        setSelectedSchedule((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle Add Schedule dialog submission
    const handleAddSchedule = async () => {
        try {
            const scheduleData = {
                ...newSchedule,
                schedule_type: scheduleType,
                // Ensure weekly_schedule is properly formatted
                weekly_schedule: scheduleType === "weekly" ?
                    (Array.isArray(newSchedule.weekly_schedule) ?
                        newSchedule.weekly_schedule :
                        []) :
                    []
            };

            const token = localStorage.getItem('token'); // adjust based on how you
            const response = await fetch("http://localhost:8800/api/schedules/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Include Authorization header if using JWT
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                credentials: 'include', // This is the modern equivalent of withCredentials: true
                body: JSON.stringify(scheduleData),
            });

            if (!response.ok) {
                throw new Error("Failed to add new schedule.");
            }
            await fetchScheduleData();

            alert("Schedule added successfully!");
            setOpenDialog(false); // Close the dialog

            // Reset form state
            setNewSchedule({
                title: '',
                notes: '',
                schedule_date: '',
                schedule_time_slot: '',
                end_time: '',
                weekly_schedule: [], // This should be an empty ARRAY, not an empty string
                // Reset any other fields you have in your form
            });

        } catch (err) {
            setError(err.message);
        }
    };

    // Handle Edit button click
    const handleEdit = (scheduleId) => {
        const scheduleToEdit = scheduleData.find((schedule) => schedule.schedule_id === scheduleId);
        if (!scheduleToEdit) {
            console.error("Error: Schedule not found.");
            return;
        }
        console.log("Editing Schedule:", scheduleToEdit);
        setSelectedSchedule({ ...scheduleToEdit }); // Ensure a fresh state copy
        setEditDialogOpen(true);
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`http://localhost:8800/api/schedules/edit/${selectedSchedule.schedule_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedSchedule),
            });

            if (!response.ok) {
                throw new Error(`Failed to update schedule: ${response.statusText}`);
            }

            const updatedPlan = await response.json();
            console.log("Schedule successfully updated:", updatedPlan);

            // Update schedules in state
            setScheduleData((prevSchedules) =>
                prevSchedules.map((schedule) =>
                    schedule.schedule_id === selectedSchedule.schedule_id // Use correct ID
                        ? { ...schedule, ...selectedSchedule } // Update the edited schedule
                        : schedule
                )
            );

            // Update selected schedule
            setSelectedSchedule((prev) => ({
                ...prev,
                title: selectedSchedule.title,
                schedule_date: selectedSchedule.schedule_date,
                schedule_time_slot: selectedSchedule.schedule_time_slot,
                end_time: selectedSchedule.end_time,
                notes: selectedSchedule.notes,
            }));

            // Close the dialog
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating schedule:", error);
        }
    };

    // Handle Delete button click
    const handleDelete = async (scheduleId) => {
        if (window.confirm("Are you sure you want to delete this schedule?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/schedules/delete/${scheduleId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete schedule.");
                }
                // await fetchSchedules();
                // If you're using scheduleData state separately
                setScheduleData(prevData =>
                    prevData.filter(schedule => schedule.schedule_id !== scheduleId)
                );
                alert("Schedule deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // Search function to filter schedules
    const filteredSchedules = scheduleData.filter((schedule) => {
        const searchLower = searchTerm.toLowerCase();

        return (
            schedule.title.toLowerCase().includes(searchLower) ||
            (schedule.notes && schedule.notes.toLowerCase().includes(searchLower)) ||
            (schedule.schedule_type === 'one-time' &&
                new Date(schedule.schedule_date).toLocaleDateString().includes(searchTerm))
        );
    });

    // Function to highlight matched text
    const highlightMatch = (text, query) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={i} style={{ backgroundColor: "#f1f0eb" }}>{part}</mark>
                : part
        );
    };

    const getEndTimeOptions = (startTime) => {
        if (!startTime) return timeOptions;
        const startIndex = timeOptions.indexOf(startTime);
        if (startIndex === -1) return timeOptions;
        return timeOptions.slice(startIndex + 1); // Only return times after the start time
    };

    return (
        <div className="bg-gray-50" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <TrainerSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", scrollbarWidth: "none", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom sx={{
                    color: "#2D3748",
                    fontWeight: 600,
                    marginBottom: "1.5rem"
                }}>
                    Announcements
                </Typography>

                <div
                    className="bg-white rounded-xl shadow-sm p-5 mb-5"
                    style={{
                        marginRight: "-5px",
                        borderLeft: "3px solid #3182CE",
                        transition: "all 0.3s ease"
                    }}
                >
                    <div className="flex items-center">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search schedules..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                style={{ borderColor: "#E2E8F0" }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="ml-4 flex space-x-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-600 transition"
                                onClick={() => setOpenDialog(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                New Session
                            </button>
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
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        {loading && (
                            <div className="col-span-2 flex justify-center items-center p-10">
                                <div className="animate-pulse flex space-x-4">
                                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                    <div className="flex-1 space-y-4 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {error && <p className="p-6 text-red-500 col-span-2">Error: {error}</p>}
                        {filteredSchedules.length === 0 && !loading && !error && (
                            <div className="col-span-2 p-6 text-center text-gray-500">
                                No schedules found matching "{searchTerm}"
                            </div>
                        )}
                        {filteredSchedules
                            .sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime())
                            .map((schedule) => (
                                <div
                                    key={schedule.schedule_id}
                                    className="p-6 hover:bg-gray-50 border rounded-lg transition-all duration-200"
                                    style={{
                                        borderColor: "#EDF2F7",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                                        borderLeft: schedule.schedule_type === 'one-time' ? "4px solid #4299E1" : "4px solid #68D391"
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-full text-left">
                                            <div className="flex items-center mb-2">
                                                <Chip
                                                    label={schedule.schedule_type}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: schedule.schedule_type === 'one-time' ? "#EBF8FF" : "#F0FFF4",
                                                        color: schedule.schedule_type === 'one-time' ? "#3182CE" : "#38A169",
                                                        fontWeight: 500,
                                                        marginRight: "8px"
                                                    }}
                                                />
                                                <h3 className="text-lg font-semibold" style={{ color: "#2D3748" }}>
                                                    {searchTerm ? highlightMatch(schedule.title, searchTerm) : schedule.title}
                                                </h3>
                                            </div>
                                            {schedule.notes && (
                                                <p className="mt-1 text-sm" style={{ color: "#718096" }}>
                                                    {searchTerm ? highlightMatch(schedule.notes, searchTerm) : schedule.notes}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEdit(schedule.schedule_id)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(schedule.schedule_id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    {schedule.schedule_type === 'one-time' &&
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div className="flex items-center text-sm p-2 rounded-md" style={{
                                                color: "#4A5568",
                                                backgroundColor: "#F7FAFC"
                                            }}>
                                                <Calendar className="w-4 h-4 mr-2" style={{ color: "#4299E1" }} />
                                                {new Date(schedule.schedule_date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm p-2 rounded-md" style={{
                                                color: "#4A5568",
                                                backgroundColor: "#F7FAFC"
                                            }}>
                                                <Clock className="w-4 h-4 mr-2" style={{ color: "#4299E1" }} />
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
                                            <div key={idx} className="flex items-center text-sm mt-2 p-2 rounded-md" style={{
                                                color: "#4A5568",
                                                backgroundColor: "#F7FAFC",
                                                marginTop: idx > 0 ? "8px" : "16px"
                                            }}>
                                                <Clock className="w-4 h-4 mr-2" style={{ color: "#68D391" }} />
                                                <span style={{ fontWeight: 500 }}>{slot.day}</span>: {formatTime(slot.start_time)} to {formatTime(slot.end_time)}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Add Schedule Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                    <DialogTitle sx={{ color: "#2D3748", fontWeight: 600 }}>Add New Schedule</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            {/* Schedule Type (One-time / Weekly) */}
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ color: "#4A5568" }}>Schedule Type</FormLabel>
                                    <RadioGroup
                                        row
                                        name="schedule_type"
                                        value={scheduleType}
                                        onChange={handleScheduleTypeChange}
                                    >
                                        <FormControlLabel value="one-time" control={<Radio sx={{ color: "#4299E1", '&.Mui-checked': { color: "#4299E1" } }} />} label="One-time" />
                                        <FormControlLabel value="weekly" control={<Radio sx={{ color: "#4299E1", '&.Mui-checked': { color: "#4299E1" } }} />} label="Weekly" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} key={"title"}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label={"Schedule Title"}
                                    name={"title"}
                                    type={"text"}
                                    value={newSchedule.title}
                                    onChange={handleInputChange}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    margin="dense"
                                    InputLabelProps={{ shrink: true }} // Keeps label fixed
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                    }}
                                />
                            </Grid>
                            {/* One-time Fields (Only shown when "One-time" is selected) */}
                            {scheduleType === 'one-time' && (
                                <>
                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label="Schedule Date"
                                            type="date"
                                            name="schedule_date"
                                            value={newSchedule.schedule_date}
                                            onChange={handleInputChange}
                                            error={!!errors.schedule_date}
                                            helperText={errors.schedule_date}
                                            margin="dense"
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{
                                                min: new Date().toISOString().split('T')[0] // Sets minimum date to today
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>Start Time</InputLabel>
                                            <Select
                                                name="schedule_time_slot"
                                                value={newSchedule.schedule_time_slot}
                                                onChange={handleInputChange}
                                                error={!!errors.schedule_time_slot}
                                                variant="outlined"
                                                sx={{
                                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                }}
                                            >
                                                {timeOptions.map((time) => (
                                                    <MenuItem key={time} value={time}>
                                                        {time}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>End Time</InputLabel>
                                            <Select
                                                name="end_time"
                                                value={newSchedule.end_time}
                                                onChange={handleInputChange}
                                                error={!!errors.end_time}
                                                variant="outlined"
                                                disabled={!newSchedule.schedule_time_slot}
                                                sx={{
                                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                }}
                                            >
                                                {getEndTimeOptions(newSchedule.schedule_time_slot).map((time) => (
                                                    <MenuItem key={time} value={time}>
                                                        {time}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.end_time && <FormHelperText error>{errors.end_time}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </>
                            )}

                            {/* Weekly Schedule */}
                            {scheduleType === 'weekly' && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ color: "#4A5568", fontWeight: 500 }}>
                                        Weekly Schedule
                                    </Typography>

                                    {/*{Array.isArray(newSchedule.weekly_schedule) &&*/}
                                        {newSchedule.weekly_schedule.map((slot, index) => (
                                        <Box key={index} mb={2} p={2} sx={{ backgroundColor: "#F7FAFC", borderRadius: "8px" }}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid item xs={4}>
                                                    <TextField
                                                        select
                                                        label="Day"
                                                        fullWidth
                                                        value={slot.day}
                                                        onChange={(e) => handleWeeklyChange(index, "day", e.target.value)}
                                                        sx={{
                                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                        }}
                                                    >
                                                        {weekDays.map((day) => (
                                                            <MenuItem key={day} value={day}>{day}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl fullWidth margin="dense">
                                                        <InputLabel>Start Time</InputLabel>
                                                        <Select
                                                            name="start_time"
                                                            value={slot.start_time}
                                                            onChange={(e) => handleWeeklyChange(index, "start_time", e.target.value)}
                                                            error={!!errors.start_time}
                                                            variant="outlined"
                                                            sx={{
                                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                            }}
                                                        >
                                                            {timeOptions.map((time) => (
                                                                <MenuItem key={time} value={time}>
                                                                    {time}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl fullWidth margin="dense">
                                                        <InputLabel>End Time</InputLabel>
                                                        <Select
                                                            name="end_time"
                                                            value={slot.end_time}
                                                            onChange={(e) => handleWeeklyChange(index, "end_time", e.target.value)}
                                                            error={!!errors.end_time}
                                                            variant="outlined"
                                                            disabled={!slot.start_time}
                                                            sx={{
                                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                            }}
                                                        >
                                                            {getEndTimeOptions(slot.start_time).map((time) => (
                                                                <MenuItem key={time} value={time}>
                                                                    {time}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {errors.end_time && <FormHelperText error>{errors.end_time}</FormHelperText>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button
                                                        color="error"
                                                        onClick={() => removeWeeklySlot(index)}
                                                        sx={{
                                                            color: "#E53E3E",
                                                            "&:hover": { backgroundColor: "#FFF5F5" }
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                    <Button
                                        onClick={addWeeklySlot}
                                        style={{ marginTop: "10px" }}
                                        variant="outlined"
                                        sx={{
                                            borderColor: "#4299E1",
                                            color: "#4299E1",
                                            "&:hover": {
                                                borderColor: "#3182CE",
                                                backgroundColor: "#EBF8FF"
                                            }
                                        }}
                                    >
                                        + Add Day
                                    </Button>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Notes"
                                    name="notes"
                                    multiline
                                    rows={3}
                                    value={newSchedule.notes}
                                    onChange={handleInputChange}
                                    error={!!errors.notes}
                                    helperText={errors.notes}
                                    margin="dense"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ padding: "16px 24px" }}>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            sx={{
                                color: "#4A5568",
                                "&:hover": { backgroundColor: "#F7FAFC" }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddSchedule}
                            variant="contained"
                            sx={{
                                backgroundColor: "#3b82f6",
                                "&:hover": { backgroundColor: "#2563eb" }
                            }}
                        >
                            Add Schedule
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Schedule Dialog */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle sx={{ color: "#2D3748", fontWeight: 600 }}>Edit Schedule</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            {/* Schedule Type */}
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ color: "#4A5568" }}>Schedule Type</FormLabel>
                                    <RadioGroup
                                        row
                                        name="schedule_type"
                                        value={editScheduleType}
                                        onChange={handleEditScheduleTypeChange}
                                    >
                                        <FormControlLabel value="one-time" control={<Radio sx={{ color: "#4299E1", '&.Mui-checked': { color: "#4299E1" } }} />} label="One-time" />
                                        <FormControlLabel value="weekly" control={<Radio sx={{ color: "#4299E1", '&.Mui-checked': { color: "#4299E1" } }} />} label="Weekly" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} key={"title"}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label={"Schedule Title"}
                                    name={"title"}
                                    type={"text"}
                                    value={selectedSchedule?.title || ""}
                                    onChange={handleInputChange}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    margin="dense"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                    }}
                                />
                            </Grid>
                            {/* One-time fields */}
                            {editScheduleType === 'one-time' && (
                                <>
                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label="Schedule Date"
                                            type="date"
                                            name="schedule_date"
                                            value={selectedSchedule?.schedule_date
                                                ? new Date(selectedSchedule.schedule_date).toISOString().slice(0, 10)
                                                : ""}
                                            onChange={handleInputChange}
                                            error={!!errors.schedule_date}
                                            helperText={errors.schedule_date}
                                            margin="dense"
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{
                                                min: new Date().toISOString().split('T')[0] // Sets minimum date to today
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>Start Time</InputLabel>
                                            <Select
                                                name="schedule_time_slot"
                                                value={selectedSchedule?.schedule_time_slot?.toString().slice(0,5) || ""}
                                                onChange={handleInputChange}
                                                error={!!errors.schedule_time_slot}
                                                variant="outlined"
                                                sx={{
                                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                }}
                                            >
                                                {timeOptions.map((time) => (
                                                    <MenuItem key={time} value={time}>
                                                        {time}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>End Time</InputLabel>
                                            <Select
                                                name="end_time"
                                                value={selectedSchedule?.end_time?.toString().slice(0,5) || ""}
                                                onChange={handleInputChange}
                                                error={!!errors.end_time}
                                                variant="outlined"
                                                disabled={!selectedSchedule?.schedule_time_slot}
                                                sx={{
                                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                }}
                                            >
                                                {getEndTimeOptions(selectedSchedule?.schedule_time_slot?.toString().slice(0,5)).map((time) => (
                                                    <MenuItem key={time} value={time}>
                                                        {time}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.end_time && <FormHelperText error>{errors.end_time}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            {/* Weekly fields */}
                            {editScheduleType === 'weekly' && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ color: "#4A5568", fontWeight: 500 }}>
                                        Weekly Schedule
                                    </Typography>
                                    {selectedSchedule.weekly_schedule?.map((slot, index) => (
                                        <Box key={index} mb={2} p={2} sx={{ backgroundColor: "#F7FAFC", borderRadius: "8px" }}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid item xs={4}>
                                                    <TextField
                                                        select
                                                        label="Day"
                                                        fullWidth
                                                        value={slot.day}
                                                        onChange={(e) => handleEditWeeklyChange(index, "day", e.target.value)}
                                                        sx={{
                                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                        }}
                                                    >
                                                        {weekDays.map((day) => (
                                                            <MenuItem key={day} value={day}>{day}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl fullWidth margin="dense">
                                                        <InputLabel>Start Time</InputLabel>
                                                        <Select
                                                            name="end_time"
                                                            value={slot?.start_time?.toString().slice(0,5)}
                                                            onChange={(e) => handleEditWeeklyChange(index, "start_time", e.target.value)}
                                                            error={!!errors.start_time}
                                                            variant="outlined"
                                                            sx={{
                                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                            }}
                                                        >
                                                            {timeOptions.map((time) => (
                                                                <MenuItem key={time} value={time}>
                                                                    {time}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl fullWidth margin="dense">
                                                        <InputLabel>End Time</InputLabel>
                                                        <Select
                                                            name="end_time"
                                                            value={slot?.end_time?.toString().slice(0,5)}
                                                            onChange={(e) => handleEditWeeklyChange(index, "end_time", e.target.value)}
                                                            error={!!errors.end_time}
                                                            variant="outlined"
                                                            disabled={!slot?.start_time}
                                                            sx={{
                                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                                            }}
                                                        >
                                                            {getEndTimeOptions(slot?.start_time?.toString().slice(0,5)).map((time) => (
                                                                <MenuItem key={time} value={time}>
                                                                    {time}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {errors.end_time && <FormHelperText error>{errors.end_time}</FormHelperText>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button
                                                        color="error"
                                                        onClick={() => removeEditWeeklySlot(index)}
                                                        sx={{
                                                            color: "#E53E3E",
                                                            "&:hover": { backgroundColor: "#FFF5F5" }
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                    <Button
                                        onClick={addEditWeeklySlot}
                                        style={{ marginTop: "10px" }}
                                        variant="outlined"
                                        sx={{
                                            borderColor: "#4299E1",
                                            color: "#4299E1",
                                            "&:hover": {
                                                borderColor: "#3182CE",
                                                backgroundColor: "#EBF8FF"
                                            }
                                        }}
                                    >
                                        + Add Day
                                    </Button>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Notes"
                                    name="notes"
                                    multiline
                                    rows={3}
                                    value={selectedSchedule?.notes || ""}
                                    onChange={handleInputChange}
                                    error={!!errors.notes}
                                    helperText={errors.notes}
                                    margin="dense"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E0" }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ padding: "16px 24px" }}>
                        <Button
                            onClick={() => setEditDialogOpen(false)}
                            sx={{
                                color: "#4A5568",
                                "&:hover": { backgroundColor: "#F7FAFC" }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveChanges}
                            variant="contained"
                            sx={{
                                backgroundColor: "#3b82f6",
                                "&:hover": { backgroundColor: "#2563eb" }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default Schedules;
