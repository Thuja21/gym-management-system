import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box, IconButton
} from "@mui/material";

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newMember, setNewMember] = useState({
        fullName: "",
        email: "",
        contactNo: "",
        address: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        bloodGroup: "",
        currentFitnessLevel: "",
        fitnessGoal: "",
        planId: "",
        scheduleId: "",
        healthIssues: "",
        dob: "",
        registered_date: "",
        status: "",
    });

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
    }, []);

    // Handle Edit button click
    const handleEdit = (memberId) => {
        console.log(`Editing member with ID: ${memberId}`);
        // You can navigate to an edit page or show an edit form.
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

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMember((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle Add Member dialog submission
    const handleAddMember = async () => {
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

            const data = await response.json();
            alert("Member added successfully!");
            setMembers((prevMembers) => [...prevMembers, data]);
            setOpenDialog(false); // Close the dialog
        } catch (err) {
            setError(err.message);
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

                {/* Add Member Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                    style={{
                        marginBottom: "20px",
                        float: "right", // Align to the right

                    }}
                >
                    Add Member
                </Button>


                {loading && <Typography>Loading members...</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                {!loading && !error && (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                        <TableContainer
                            component={Paper} className="table-container"
                            sx={{
                                marginTop: "65px",
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Add shadow for better appearance
                                borderRadius: "8px", // Rounded corners
                                height: "calc(100vh - 180px)", // Adjust height to fit within the page (leave space for topbar and padding)
                                width:"calc(100vw - 400px)",
                                overflowY: "auto", // Enable vertical scrolling
                                overflowX: "auto", // Enable horizontal scrolling for large tables

                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow className="table-header"
                                        sx={{
                                            backgroundColor: "rgb(230,173,173)"//Dark background for headers
                                        }}
                                    >

                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center"}}>ID</TableCell>
                                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Name</TableCell>
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
                                            <TableCell>{member.plan_id}</TableCell>
                                            <TableCell>{member.schedule_id}</TableCell>
                                            <TableCell>{member.health_issues}</TableCell>
                                            <TableCell>{(new Date(member.registered_date).toLocaleDateString())}</TableCell>
                                            <TableCell>{member.status}</TableCell>
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
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Full Name"
                        fullWidth
                        variant="outlined"
                        name="fullName"
                        value={newMember.fullName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        name="email"
                        value={newMember.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Phone"
                        fullWidth
                        variant="outlined"
                        name="contactNo"
                        value={newMember.contactNo}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        fullWidth
                        variant="outlined"
                        name="address"
                        value={newMember.address}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="DOB"
                        fullWidth
                        variant="outlined"
                        name="dob"
                        value={newMember.dob}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Age"
                        fullWidth
                        variant="outlined"
                        name="age"
                        value={newMember.age}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Gender"
                        fullWidth
                        variant="outlined"
                        name="gender"
                        value={newMember.gender}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Height"
                        fullWidth
                        variant="outlined"
                        name="height"
                        value={newMember.height}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Weight"
                        fullWidth
                        variant="outlined"
                        name="weight"
                        value={newMember.weight}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Blood Group"
                        fullWidth
                        variant="outlined"
                        name="bloodGroup"
                        value={newMember.bloodGroup}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Current Fitness Level"
                        fullWidth
                        variant="outlined"
                        name="currentFitnessLevel"
                        value={newMember.currentFitnessLevel}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Fitness Goal"
                        fullWidth
                        variant="outlined"
                        name="fitnessGoal"
                        value={newMember.fitnessGoal}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Plan ID"
                        fullWidth
                        variant="outlined"
                        name="planId"
                        value={newMember.planId}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Schedule ID"
                        fullWidth
                        variant="outlined"
                        name="scheduleId"
                        value={newMember.scheduleId}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Health Issues"
                        fullWidth
                        variant="outlined"
                        name="healthIssues"
                        value={newMember.healthIssues}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Registered Date"
                        fullWidth
                        variant="outlined"
                        name="registeredDate"
                        value={newMember.registeredDate}
                        onChange={handleInputChange}
                    />
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
            <AdminSideBar/>
        </div>


    );
};

export default ManageMembers;
