import React, {useState} from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import {Plus, Search, Edit as EditIcon, Trash as DeleteIcon } from "lucide-react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography} from "@mui/material";


const ManageEquipments = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [newTrainer, setNewTrainer] = useState("");
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});



    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewTrainer((prev) => ({
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

    return (
        <div  style={{ display: "flex", height: "100vh" ,paddingRight: "30px" }}>
            <AdminSideBar/>
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh",  width:"1300px" ,overflowY: "auto" , marginLeft: "-45px", marginTop: "10px" }}>
                {/* <TopBar /> */}
                <Typography variant="h4" gutterBottom>
                    GYM TRAINERS
                </Typography>

                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <div className="flex items-center">
                        <div className="relative flex-1" >
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search trainers..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="ml-4 flex space-x-2">
                            {/* Add Supplement Button */}
                            <button className="bg-red-900 text-white w-30  rounded-lg flex items-center shadow-md hover:bg-red-800 transition"
                                    onClick={() => setOpenDialog(true)}>
                                <Plus className="w-5 h-5 mr-2" />
                                Add Supplement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Supplement Dialog */}
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
                    <Button color="primary">
                        Add Trainer
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ManageEquipments;
