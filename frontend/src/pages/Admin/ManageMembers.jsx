import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Admin.css";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, IconButton, Grid, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import axios from "axios";

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [plans, setPlans] = useState([]); // State to store membership types
    const [errors, setErrors] = useState({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const [newMember, setNewMember] = useState({
        username: "",  fullname: "", email: "", contactNo: "", address: "", age: "", gender: "", height: "", weight: "",
        bloodGroup: "", currentFitnessLevel: "", fitnessGoal: "", healthIssues: "", dob: "", registered_date: "", plan_id: "",
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get("http://localhost:8800/api/members/plans");
                setPlans(response.data); // Store membership plans in the state
            } catch (error) {
                console.error("Error fetching membership plans:", error);
            }
        };
        fetchPlans();
    }, []);


    // Fetch members from backend
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/members/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch members.");
                }
                const data = await response.json();
                setMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [loading]);


    // Input validation
    const validateFields = (member) => {
        const error = {};
        // Required fields
        if (!member.username) error.username = "Username is required";
        if (!member.fullname) error.fullname = "Full name is required";
        if (!member.contactNo || !/^\d{10}$/.test(member.contactNo)) {
            error.contactNo = "Valid contact number is required (10 digits)";
        }
        if (!member.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
            error.email = "Valid email is required";
        }
        if (!member.address) error.address = "Address is required";
        if (!member.dob) error.dob = "Date of birth is required";
        if (!member.gender) error.gender = "Gender is required";
        if (!member.weight || isNaN(member.weight) || member.weight <= 0) {
            error.weight = "Valid weight is required";
        }
        if (!member.height || isNaN(member.height) || member.height <= 0) {
            error.height = "Valid height is required";
        }
        if (!member.bloodGroup) error.bloodGroup = "Blood group is required";

        if (!member.password || member.password.length < 6) {
            error.password = "Password must be at least 6 characters";
        }
        if (!member.fitnessGoal) error.fitnessGoal = "FitnessGoal is required";
        if (!member.plan_id) {
            error.plan_id = "Membership plan is required";
        }

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    // Handle Delete button click
    const handleDelete = async (memberId) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/members/delete/${memberId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete member.");
                }
                setMembers((prevMembers) => prevMembers.filter((member) => member.member_id !== memberId));
                alert("Member deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };


    // Handle Add Member dialog submission
    const handleAddMember = async () => {
        if (validateFields(newMember)) {
            try {
                const response = await fetch("http://localhost:8800/api/members/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMember),
                });

                if (!response.ok) {
                    throw new Error("Failed to add new member.");
                }
                alert("Member added successfully!");
                setLoading(true);
                setOpenDialog(false); // Close the dialog
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // // Handle form input change
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     // Calculate age when DOB is changed
    //     if (name === "dob") {
    //         const birthDate = new Date(value);
    //         const today = new Date();
    //         const age = today.getFullYear() - birthDate.getFullYear();
    //         const monthDiff = today.getMonth() - birthDate.getMonth();
    //
    //         // Adjust age if the birthday hasn't occurred yet this year
    //         const adjustedAge =
    //             monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
    //                 ? age - 1
    //                 : age;
    //
    //         setNewMember((prev) => ({
    //             ...prev,
    //             dob: value,
    //             age: adjustedAge > 0 ? adjustedAge : "",
    //         }));
    //         setSelectedMember((prev) => ({
    //             ...prev,
    //             dob: value,
    //             age: adjustedAge > 0 ? adjustedAge : "",
    //         }));
    //     } else {
    //         setNewMember((prev) => ({
    //             ...prev,
    //             [name]: value,
    //         }));
    //         setSelectedMember((prev) => ({
    //             ...prev,
    //             [name]: value,
    //         }));
    //     }
    // };


    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewMember((prev) => ({
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
                case "gender":
                case "bloodGroup":
                case "fitnessGoal":
                case "plan_id":
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
                case "weight":
                case "height":
                    if (!isNaN(value) && value > 0) delete newErrors[name];
                    else newErrors[name] = "Valid value is required";
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    };


    // Handle Edit button click
    const handleEdit = (memberId) => {
        const memberToEdit = members.find((member) => member.member_id === memberId);
        if (!memberToEdit) {
            console.error("Error: Member not found.");
            return;
        }
        console.log("Editing Member:", memberToEdit);
        setSelectedMember({ ...memberToEdit }); // Ensure a fresh state copy
        setEditDialogOpen(true);
    };


// Function to handle saving changes
    const handleSaveChanges = async () => {
        if (!selectedMember || !selectedMember.member_id) {
            console.error("Error: No member selected for update.");
            return;
        }

        console.log("Updated Member Data:", selectedMember);

        try {
            const response = await fetch(`http://localhost:8800/api/members/edit/${selectedMember.member_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedMember),
            });

            if (!response.ok) {
                throw new Error(`Failed to update member: ${response.statusText}`);
            }

            const updatedMember = await response.json();
            console.log("Member successfully updated:", updatedMember);

            setLoading(true);
            // Close the dialog
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };


    return (

        <div style={{ display: "flex", height: "100vh" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", overflowY: "auto" }}>
                {/* <TopBar /> */}
                <Typography variant="h4" gutterBottom>
                    GYM MEMBERS
                </Typography>

                <Box
                    className="box ButtonCover"
                    style={{
                        display: "flex",
                        justifyContent: "flex-end", // Align the button to the right inside the box
                        alignItems: "center",
                        padding: "10px", // Optional: Add padding for better spacing
                    }}
                >
                    {/* Add Member Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                        style={{
                            marginRight: "20px", // Reset margin since the box handles spacing
                            backgroundColor: "#870000",
                        }}
                    >
                        Add Member
                    </Button>
                </Box>



                {loading && <Typography>Loading members...</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                {!loading && !error && (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                        <TableContainer
                            component={Paper} className="table-container"
                            sx={{height: "calc(100vh - 230px)",
                                width:"calc(100vw - 375px)",
                                scrollbarWidth: "none", // Hide scrollbar for Firefox
                                "&::-webkit-scrollbar": {
                                    display: "none", // Hide scrollbar for Webkit-based browsers (Chrome, Edge, etc.)
                                },}}
                        >
                            <Table>
                                <TableHead style={{ position: "sticky", top: 0,zIndex: 10 }}>
                                    <TableRow className="table-header"
                                              sx={{
                                                  backgroundColor: "#870000"//Dark background for headers
                                              }}
                                    >

                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center"}}>ID</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Name</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Username</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center"}}>Email</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Phone</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Address</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>DOB</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Age</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Gender</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Height</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Weight</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Blood Group</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Fitness Level</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Fitness Goal</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Plan</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Schedule</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Health Issues</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Registered Date</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Status</TableCell>

                                        <TableCell
                                            sx={{
                                                color: "#ffffff", // White text for headers
                                                fontWeight: "bold",
                                                textAlign: "center", // Center-align text
                                            }}
                                        >
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {members.map((member, index) => (
                                        <TableRow
                                            key={member.member_id} className="table-row"
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff", // Alternate row colors
                                                "&:hover": {
                                                    backgroundColor: "#e0e0e0", // Highlight on hover
                                                },

                                            }}
                                        >

                                            <TableCell>{member.member_id}</TableCell>
                                            <TableCell>{member.full_name}</TableCell>
                                            <TableCell>{member.user_name}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>{member.contact_no}</TableCell>
                                            <TableCell>{member.address}</TableCell>
                                            <TableCell>{(new Date(member.dob).toLocaleDateString())}</TableCell>
                                            <TableCell>{member.age}</TableCell>
                                            <TableCell>{member.gender}</TableCell>
                                            <TableCell>{member.height}</TableCell>
                                            <TableCell>{member.weight}</TableCell>
                                            <TableCell>{member.blood_group}</TableCell>
                                            <TableCell>{member.current_fitness_level}</TableCell>
                                            <TableCell>{member.fitness_goal}</TableCell>
                                            <TableCell>{member.plan_name}</TableCell>
                                            <TableCell>{member.schedule_id}</TableCell>
                                            <TableCell>{member.health_issues}</TableCell>
                                            <TableCell>{(new Date(member.registered_date).toLocaleDateString())}</TableCell>
                                            <TableCell>{member.status == 1 ? "ACTIVE" : "EXPIRED"}</TableCell>
                                            <TableCell className="table-cell-actions"
                                                       sx={{
                                                           display: "flex",
                                                           justifyContent: "center",
                                                           gap: "10px", // Space between the two buttons
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
                                                    onClick={() => handleEdit(member.member_id)}
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
                                                    onClick={() => handleDelete(member.member_id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
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
                <DialogTitle>Add New Member</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={6}>
                            {["username", "fullname", "contactNo", "dob", "weight"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newMember[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    type={field === "dob" ? "date" : "text"}
                                    InputLabelProps={field === "dob" ? { shrink: true } : {}}
                                />
                            ))}

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={newMember.gender}
                                    onChange={handleInputChange}
                                    error={!!errors.gender}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Current Fitness Level</InputLabel>
                                <Select
                                    label="Current Fitness Level"
                                    name="currentFitnessLevel"
                                    value={newMember.currentFitnessLevel}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="Beginner">Beginner</MenuItem>
                                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                                    <MenuItem value="Advanced">Advanced</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                margin="dense"
                                label="Health Issues"
                                fullWidth
                                variant="outlined"
                                name="healthIssues"
                                value={newMember.healthIssues}
                                onChange={handleInputChange}
                                error={!!errors.healthIssues}
                                helperText={errors.healthIssues}
                            />
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={6}>
                            {["password", "email", "address", "age", "height"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newMember[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                />
                            ))}

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Blood Group</InputLabel>
                                <Select
                                    label="Blood Group"
                                    name="bloodGroup"
                                    value={newMember.bloodGroup}
                                    onChange={handleInputChange}
                                    error={!!errors.bloodGroup}
                                >
                                    {["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"].map((group) => (
                                        <MenuItem key={group} value={group}>{group}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                margin="dense"
                                label="Fitness Goal"
                                fullWidth
                                variant="outlined"
                                name="fitnessGoal"
                                value={newMember.fitnessGoal}
                                onChange={handleInputChange}
                                error={!!errors.fitnessGoal}
                                helperText={errors.fitnessGoal}
                            />

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Membership Plan</InputLabel>
                                <Select
                                    label="Membership Plan"
                                    name="plan_id"
                                    value={newMember.plan_id}
                                    onChange={handleInputChange}
                                    error={!!errors.plan_id}
                                >
                                    {plans.map((type) => (
                                        <MenuItem value={type.plan_id}>{type.plan_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddMember} color="primary">
                        Add Member
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
                <DialogTitle>Edit Member Details</DialogTitle>
                <DialogContent>
                    {selectedMember && (
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
                                        value={selectedMember[field] || ""}
                                        onChange={handleInputChange}
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
                                        selectedMember.dob
                                            ? new Date(selectedMember.dob).toISOString().slice(0, 10)
                                            : ""
                                    }
                                    onChange={handleInputChange}
                                />
                                {["address", "height"].map((field) => (
                                    <TextField
                                        key={field}
                                        margin="dense"
                                        label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                        fullWidth
                                        variant="outlined"
                                        name={field}
                                        value={selectedMember[field] || ""}
                                        onChange={handleInputChange}
                                    />
                                ))}
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Blood Group</InputLabel>
                                    <Select
                                        label="Blood Group"
                                        name="blood_group"
                                        value={selectedMember.blood_group || ""}
                                        onChange={handleInputChange}
                                    >
                                        {["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"].map((group) => (
                                            <MenuItem key={group} value={group}>{group}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    margin="dense"
                                    label="Fitness Goal"
                                    fullWidth
                                    variant="outlined"
                                    name="fitness_goal"
                                    value={selectedMember.fitness_goal || ""}
                                    onChange={handleInputChange}
                                />
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Membership Plan</InputLabel>
                                    <Select
                                        label="Membership Plan"
                                        name="plan_id"
                                        value={selectedMember.plan_id || ''} // Fallback to an empty string
                                        onChange={handleInputChange}
                                    >
                                        {plans.map((type) => (
                                            <MenuItem key={type.plan_id} value={type.plan_id}>
                                                {type.plan_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={6}>
                                {["full_name", "contact_no", "age", "weight"].map((field) => (
                                    <TextField
                                        key={field}
                                        margin="dense"
                                        label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                        fullWidth
                                        variant="outlined"
                                        name={field}
                                        value={selectedMember[field] || ""}
                                        onChange={handleInputChange}
                                    />
                                ))}
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        label="Gender"
                                        name="gender"
                                        value={selectedMember.gender || ""}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Current Fitness Level</InputLabel>
                                    <Select
                                        label="Current Fitness Level"
                                        name="current_fitness_level"
                                        value={selectedMember.current_fitness_level || ""}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="Beginner">Beginner</MenuItem>
                                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                                        <MenuItem value="Advanced">Advanced</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    margin="dense"
                                    label="Health Issues"
                                    fullWidth
                                    variant="outlined"
                                    name="health_issues"
                                    value={selectedMember.health_issues || ""}
                                    onChange={handleInputChange}
                                />
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

export default ManageMembers;
