import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import TopBar from "../../components/TopBar.jsx";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

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
                    style={{ marginBottom: "20px" }}
                >
                    Add Member
                </Button>

                {loading && <Typography>Loading members...</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                {!loading && !error && (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Actions</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>Age</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Height</TableCell>
                                        <TableCell>Weight</TableCell>
                                        <TableCell>Blood Group</TableCell>
                                        <TableCell>Current Fitness Level</TableCell>
                                        <TableCell>Fitness Goal</TableCell>
                                        <TableCell>Plan</TableCell>
                                        <TableCell>Schedule</TableCell>
                                        <TableCell>Health Issues</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {members.map((member) => (
                                        <TableRow key={member.member_id}>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleEdit(member.member_id)}
                                                    style={{ marginRight: "10px" }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDelete(member.member_id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                            <TableCell>{member.member_id}</TableCell>
                                            <TableCell>{member.full_name}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>{member.contact_no}</TableCell>
                                            <TableCell>{member.address}</TableCell>
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
        </div>
    );
};

export default ManageMembers;
