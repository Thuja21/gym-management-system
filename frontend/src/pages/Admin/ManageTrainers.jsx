import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import "./Admin.css";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    TextField,
    DialogActions,
    IconButton,
} from "@mui/material";
import { Search, MoreVertical, Plus } from "lucide-react";
import { Edit as EditIcon, Trash as DeleteIcon } from "lucide-react";
import axios from "axios";

const ManageTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [errors, setErrors] = useState({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newTrainer, setNewTrainer] = useState({
        username: "",  fullname: "", email: "", contactNo: "", address: "", age: "", dob: "", specification: "",registered_date: "",
    });


    // Fetch members from backend
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/trainers/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch trainers.");
                }
                const data = await response.json();
                setTrainers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainers();
    }, [loading]);


    // Input validation
    const validateFields = (trainer) => {
        const error = {};
        // Required fields
        if (!trainer.username) error.username = "Username is required";
        if (!trainer.fullname) error.fullname = "Full name is required";
        if (!trainer.contactNo || !/^\d{10}$/.test(trainer.contactNo)) {
            error.contactNo = "Valid contact number is required (10 digits)";
        }
        if (!trainer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trainer.email)) {
            error.email = "Valid email is required";
        }
        if (!trainer.address) error.address = "Address is required";
        if (!trainer.password || trainer.password.length < 6) {
            error.password = "Password must be at least 6 characters";
        }
        if (!trainer.specialization) error.specialization = "Specialization is required";


        setErrors(error);
        return Object.keys(error).length === 0;
    };

    // Handle Delete button click
    const handleDelete = async (trainerId) => {
        if (window.confirm("Are you sure you want to delete this trainer?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/trainers/delete/${trainerId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete trainer.");
                }
                setTrainers((prevTrainer) => prevTrainer.filter((trainer) => trainer.trainer_id !== trainerId));
                alert("Trainer deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };


    // Handle Add Trainer dialog submission
    const handleAddTrainer = async () => {
        if (validateFields(newTrainer)) {
            try {
                const response = await fetch("http://localhost:8800/api/trainers/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTrainer),
                });

                if (!response.ok) {
                    throw new Error("Failed to add new trainer.");
                }
                alert("Trainer added successfully!");
                setLoading(true);
                setOpenDialog(false); // Close the dialog
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewTrainer((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSelectedTrainer((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validate the current field and remove error if corrected
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            switch (name) {
                case "username":
                case "fullname":
                case "address":
                case "dob":
                case "specialization":
                    if (value.trim() !== "") delete newErrors[name];
                    break;
                case "contactNo":
                    if (/^\d{10}$/.test(value)) delete newErrors[name];
                    else newErrors[name] = "Valid contact number is required (10 digits)";
                    break;
                case "email":
                    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) delete newErrors[name];
                    else newErrors[name] = "Valid email is required";
                    break;
                case "password":
                    if (value.length >= 6) delete newErrors[name];
                    else newErrors[name] = "Password must be at least 6 characters";
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    };

    // Handle Edit button click
    const handleEdit = (trainerId) => {
        const trainerToEdit = trainers.find((trainer) => trainer.trainer_id === trainerId);
        if (!trainerToEdit) {
            console.error("Error: Trainer not found.");
            return;
        }
        console.log("Editing Trainer:", trainerToEdit);
        setSelectedTrainer({ ...trainerToEdit }); // Ensure a fresh state copy
        setEditDialogOpen(true);
    };


// Function to handle saving changes
    const handleSaveChanges = async () => {
        if (!selectedTrainer || !selectedTrainer.trainer_id) {
            console.error("Error: No trainer selected for update.");
            return;
        }

        console.log("Updated trainer Data:", selectedTrainer);

        try {
            const response = await fetch(`http://localhost:8800/api/trainers/edit/${selectedTrainer.trainer_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedTrainer),
            });

            if (!response.ok) {
                throw new Error(`Failed to update trainer: ${response.statusText}`);
            }

            const updatedtrainer = await response.json();
            console.log("Trainer successfully updated:", updatedtrainer);

            setLoading(true);
            // Close the dialog
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating trainer:", error);
        }
    };

    return(
    <div style={{ display: "flex", height: "100vh" ,paddingRight: "30px" }}>
        <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
        <div style={{ flexGrow: 1, padding: "20px", height: "100vh",  width:"1300px" ,overflowY: "auto" , marginLeft: "-45px", marginTop: "10px" }}>
            {/* <TopBar /> */}
            <Typography variant="h4" gutterBottom>
                GYM TRAINERS
            </Typography>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex items-center">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search trainers..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="ml-4 flex space-x-2">
                        {/* Add Trainer Button */}
                        <button className="bg-red-900 text-white w-40  rounded-lg flex items-center shadow-md hover:bg-red-800 transition h-[40px] "
                                onClick={() => setOpenDialog(true)}>
                            <Plus className="w-5 h-5 mr-2 ml-3" />
                            Add Trainer
                        </button>
                    </div>
                </div>
            </div>

            {loading && <Typography>Loading trainers...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && (
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto" >
                    <TableContainer
                        component={Paper} className="table-container"
                        sx={{height: "calc(100vh - 230px)",
                            width:"calc(100vw - 305px)",
                            marginLeft: "13px",
                            scrollbarWidth: "none", // Hide scrollbar for Firefox
                            "&::-webkit-scrollbar": {
                                display: "none", // Hide scrollbar for Webkit-based browsers (Chrome, Edge, etc.)
                            },}}
                    >
                        <Table className="w-full border-collapse">
                            <TableHead style={{ position: "sticky", top: 0,zIndex: 10 }}>
                                <TableRow className="bg-red-200 text-blue-950 text-left text-xs font-medium uppercase tracking-wider">
                                    <th className="px-6 py-3 text-center">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Username</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">Address</th>
                                    <th className="px-6 py-3">DOB</th>
                                    <th className="px-6 py-3">Age</th>
                                    <th className="px-6 py-3">Specialization</th>
                                    <th className="px-6 py-3 ">Registered Date</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y divide-gray-200">
                                {trainers.map((trainer, index) => (
                                    <TableRow
                                        key={trainer.trainer_id} className="table-row"
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff", // Alternate row colors
                                            "&:hover": {
                                                backgroundColor: "#e0e0e0", // Highlight on hover
                                            },

                                        }}
                                    >
                                        <td className="px-6 py-1 text-center">{trainer.trainer_id}</td>
                                        <td className="px-6 py-1" style={{paddingTop: "10px"}}>{trainer.full_name}</td>
                                        <td className="px-6 py-1">{trainer.user_name}</td>
                                        <td className="px-6 py-1">{trainer.email}</td>
                                        <td className="px-6 py-1">{trainer.contact_no}</td>
                                        <td className="px-6 py-1">{trainer.address}</td>
                                        <td className="px-6 py-1">{new Date(trainer.dob).toLocaleDateString()}</td>
                                        <td className="px-6 py-1">{trainer.age}</td>
                                        <td className="px-6 py-1">{trainer.specialization}</td>
                                        <td>{(new Date(trainer.registered_date).toLocaleDateString())}</td>
                                        <td className="table-cell-actions"
                                                   sx={{
                                                       display: "flex",
                                                       justifyContent: "center",
                                                       gap: "20px", // Space between the two buttons
                                                   }}
                                        >
                                            {/* Edit Button */}
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#4A90E2", // Blue background
                                                    color: "#ffffff", // White icon color
                                                    borderRadius: "4px", // Slightly rounded corners for a square-like shape
                                                    width: "40px", // Set fixed width
                                                    height: "40px", // Set fixed height
                                                    padding: "8px", // Add padding for better spacing
                                                    "&:hover": {
                                                        backgroundColor: "#357ABD", // Darker blue on hover
                                                    },
                                                }}
                                                onClick={() => handleEdit(trainer.trainer_id)}
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            {/* Delete Button */}
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#E94E4E", // Red background
                                                    color: "#ffffff", // White icon color
                                                    borderRadius: "4px", // Slightly rounded corners for a square-like shape
                                                    width: "40px", // Set fixed width
                                                    height: "40px", // Set fixed height
                                                    padding: "8px", // Add padding for better spacing
                                                    "&:hover": {
                                                        backgroundColor: "#C33C3C", // Darker red on hover
                                                    },
                                                }}
                                                onClick={() => handleDelete(trainer.trainer_id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </td>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
            )}
        </div>

        {/* Add Member Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
            <DialogTitle>Add New Trainer</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {/* Left Column */}
                    <Grid item xs={6}>
                        {["username", "fullname", "contactNo", "dob", "specialization"].map((field) => (
                            <TextField
                                key={field}
                                margin="dense"
                                label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                fullWidth
                                variant="outlined"
                                name={field}
                                value={newTrainer[field]}
                                onChange={handleInputChange}
                                error={!!errors[field]}
                                helperText={errors[field]}
                                type={field === "dob" ? "date" : "text"}
                                InputLabelProps={field === "dob" ? { shrink: true } : {}}
                            />
                        ))}
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={6}>
                        {["password", "email", "address", "age"].map((field) => (
                            <TextField
                                key={field}
                                margin="dense"
                                label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                fullWidth
                                variant="outlined"
                                name={field}
                                value={newTrainer[field]}
                                onChange={handleInputChange}
                                error={!!errors[field]}
                                helperText={errors[field]}
                            />
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddTrainer} color="primary">
                    Add Trainer
                </Button>
            </DialogActions>
        </Dialog>


        {/* Edit Dialog */}
        <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Edit Trainer Details</DialogTitle>
            <DialogContent>
                {selectedTrainer && (
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={6}>
                            {["user_name", "email"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={selectedTrainer[field] || ""}
                                    onChange={handleInputChange}
                                    type= "text"
                                />
                            ))}
                            <TextField
                                margin="dense"
                                label="Select DoB"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                variant="outlined"
                                name="dob"
                                value={
                                    selectedTrainer.dob
                                        ? new Date(selectedTrainer.dob).toISOString().slice(0, 10)
                                        : ""
                                }
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                label="Address"
                                fullWidth
                                variant="outlined"
                                name="address"
                                value={selectedTrainer.address || ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={6}>
                            {["full_name", "contact_no", "age", "specialization"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={selectedTrainer[field] || ""}
                                    onChange={handleInputChange}
                                />
                            ))}
                        </Grid>
                    </Grid>
                )}
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

        <AdminSideBar/>
    </div>
        );
    };
export default ManageTrainers;


