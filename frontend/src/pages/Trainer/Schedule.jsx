import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Search, Clock , Edit} from "lucide-react";
import TrainerSideBar from "./TrainerSideBar.jsx";
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
import AdminSideBar from "../Admin/AdminSideBar.jsx";

function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [newSchedule, setNewSchedule] = useState({
        title: "",
        schedule_date: "",
        schedule_time_slot: "",
        end_time: "",
        notes: "",
    });
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);

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
            const response = await fetch("http://localhost:8800/api/schedules/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSchedule),
            });

            if (!response.ok) {
                throw new Error("Failed to add new schedule.");
            }
            alert("Schedule added successfully!");
            setOpenDialog(false); // Close the dialog
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle Edit button click
    const handleEdit = (scheduleId) => {
        const scheduleToEdit = schedules.find((schedule) => schedule.schedule_id === scheduleId);
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
            setSchedules((prevSchedules) =>
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
    const handleDelete = async (sheduleId) => {
        if (window.confirm("Are you sure you want to delete this schedule?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/schedules/delete/${sheduleId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete schedule.");
                }
                setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.schedule_id !== scheduleId));
                alert("Schedule deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };


    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <TrainerSideBar style={{ flexShrink: 0, width: 250 }} />
                <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto",scrollbarWidth: "none" ,marginLeft: "-45px", marginTop: "10px" }}>
                    <Typography variant="h4" gutterBottom>
                        Announcements
                    </Typography>

                {/*{loading && <p>Loading schedules...</p>} /!* Show loading message *!/*/}
                {/*{error && <p>Error: {error}</p>} /!* Show error message *!/*/}

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

                        <div className="ml-4 flex space-x-2">
                            <button
                                className="bg-red-900 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-red-800 transition"
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

                    {/* Add Schedule Dialog */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                        <DialogTitle>Add New Schedule</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                {[
                                    { name: "title", label: "Schedule Title", type: "text" },
                                    { name: "schedule_date", label: "Schedule Date", type: "date" }
                                ].map(({ name, label, type }) => (
                                    <Grid item xs={12} key={name}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label={label}
                                            name={name}
                                            type={type}
                                            value={newSchedule[name]}
                                            onChange={handleInputChange}
                                            error={!!errors[name]}
                                            helperText={errors[name]}
                                            margin="dense"
                                            InputLabelProps={{ shrink: true }} // Keeps label fixed
                                        />
                                    </Grid>
                                ))}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Start Time"
                                        name="schedule_time_slot"
                                        type="time"
                                        value={newSchedule.schedule_time_slot}
                                        onChange={handleInputChange}
                                        error={!!errors.schedule_time_slot}
                                        helperText={errors.schedule_time_slot}
                                        margin="dense"
                                        InputLabelProps={{ shrink: true }} // Keeps label fixed
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="End Time"
                                        name="end_time"
                                        type="time"
                                        value={newSchedule.end_time}
                                        onChange={handleInputChange}
                                        error={!!errors.end_time}
                                        helperText={errors.end_time}
                                        margin="dense"
                                        InputLabelProps={{ shrink: true }} // Keeps label fixed
                                    />
                                </Grid>
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
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleAddSchedule} color="primary">
                                Add Schedule
                            </Button>
                        </DialogActions>
                    </Dialog>


                    {/* Edit Schedule Dialog */}
                    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
                        <DialogTitle>Edit Schedule</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                {[
                                    { name: "title", label: "Schedule Title", type: "text" },
                                ].map(({ name, label, type }) => (
                                    <Grid item xs={12} key={name}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label={label}
                                            name={name}
                                            type={type}
                                            value={selectedSchedule?.[name] || ""}
                                            onChange={handleInputChange}
                                            error={!!errors[name]}
                                            helperText={errors[name]}
                                            margin="dense"
                                            InputLabelProps={{ shrink: true }} // Keeps label fixed
                                        />
                                    </Grid>
                                ))}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Schedule Date"
                                        name="schedule_date"
                                        type="date"
                                        value={selectedSchedule?.schedule_date
                                            ? new Date(selectedSchedule.schedule_date).toISOString().slice(0, 10)
                                            : ""
                                        }
                                        onChange={handleInputChange}
                                        error={!!errors?.schedule_date}
                                        helperText={errors?.schedule_date}
                                        margin="dense"
                                        InputLabelProps={{ shrink: true }} // Keeps label fixed
                                    />

                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Start Time"
                                        name="start_time"
                                        type="time"
                                        value={selectedSchedule?.schedule_time_slot || ""}
                                        onChange={handleInputChange}
                                        error={!!errors.schedule_time_slot}
                                        helperText={errors.schedule_time_slot}
                                        margin="dense"
                                        InputLabelProps={{ shrink: true }} // Keeps label fixed
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="End Time"
                                        name="end_time"
                                        type="time"
                                        value={selectedSchedule?.end_time || ""}
                                        onChange={handleInputChange}
                                        error={!!errors.end_time}
                                        helperText={errors.end_time}
                                        margin="dense"
                                        InputLabelProps={{ shrink: true }} // Keeps label fixed
                                    />
                                </Grid>
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
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveChanges} color="primary">
                                Save Changes
                            </Button>
                        </DialogActions>
                    </Dialog>


                </div>
        </div>
    );
}

export default Schedules;
