import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import { Edit as EditIcon, Trash as DeleteIcon } from "lucide-react";
import { Search, MoreVertical, Plus } from "lucide-react";
import "./Admin.css";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, IconButton, Grid, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import axios from "axios";

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [plans, setPlans] = useState([]);
    const [errors, setErrors] = useState({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentDetails, setPaymentDetails] = useState({
        amount: "",
        paymentMethod: "",
    });
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    const [newMember, setNewMember] = useState({
        username: "", fullname: "", email: "", contactNo: "", address: "", age: "", gender: "", height: "", weight: "",
        bloodGroup: "", currentFitnessLevel: "", fitnessGoal: "", healthIssues: "", dob: "", registered_date: "", plan_id: "",
        password: "",
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get("http://localhost:8800/api/members/plans");
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching membership plans:", error);
            }
        };
        fetchPlans();
    }, []);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/members/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch members.");
                }
                const data = await response.json();
                setMembers(data);
                setFilteredMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [loading]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredMembers(members);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = members.filter(member => {
                return (
                    (member.member_id && member.member_id.toString().includes(searchTerm)) ||
                    (member.user_name && member.user_name.toLowerCase().includes(lowercasedTerm)) ||
                    (member.full_name && member.full_name.toLowerCase().includes(lowercasedTerm)) ||
                    (member.plan_name && member.plan_name.toLowerCase().includes(lowercasedTerm))
                );
            });
            setFilteredMembers(filtered);
        }
    }, [searchTerm, members]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const validateFields = (member) => {
        const error = {};
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
        if (!paymentDetails.paymentMethod && member.plan_id) {
            error.paymentMethod = "Payment method is required";
        }

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const handleDelete = async (memberId) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/members/delete/${memberId}`, {
                    method: "PUT",
                });
                if (!response.ok) {
                    throw new Error("Failed to delete member.");
                }
                setMembers((prevMembers) => prevMembers.filter((member) => member.member_id !== memberId));
                alert("Member soft deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddMember = async () => {
        if (validateFields(newMember) && paymentConfirmed) {
            try {
                const response = await fetch("http://localhost:8800/api/members/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...newMember,
                        payment: paymentDetails,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to add new member.");
                }
                alert("Member added successfully!");
                setLoading(true);
                setOpenDialog(false);
                setPaymentDetails({ amount: "", paymentMethod: "" });
                setPaymentConfirmed(false);
                setNewMember({
                    username: "", fullname: "", email: "", contactNo: "", address: "", age: "", gender: "", height: "", weight: "",
                    bloodGroup: "", currentFitnessLevel: "", fitnessGoal: "", healthIssues: "", dob: "", registered_date: "", plan_id: "",
                    password: "",
                });
            } catch (err) {
                setError(err.message);
            }
        } else if (!paymentConfirmed) {
            alert("Please confirm payment before adding the member.");
        }
    };

    const handleConfirmPayment = () => {
        if (paymentDetails.paymentMethod) {
            setPaymentConfirmed(true);
            alert("Payment confirmed!");
        } else {
            setErrors((prev) => ({ ...prev, paymentMethod: "Payment method is required" }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "dob") {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (newMember) {
                setNewMember((prev) => ({
                    ...prev,
                    dob: value,
                    age: age.toString(),
                }));
            }
            if (selectedMember) {
                setSelectedMember((prev) => ({
                    ...prev,
                    dob: value,
                    age: age.toString(),
                }));
            }
        } else if (name === "plan_id") {
            const selectedPlan = plans.find((plan) => plan.plan_id === parseInt(value));
            setNewMember((prev) => ({
                ...prev,
                plan_id: value,
            }));
            setPaymentDetails((prev) => ({
                ...prev,
                amount: selectedPlan?.plan_price ? selectedPlan.plan_price.toString() : "",
            }));
            setPaymentConfirmed(false); // Reset payment confirmation when plan changes
            setErrors((prev) => ({ ...prev, plan_id: undefined, paymentMethod: undefined }));
        } else if (name === "paymentMethod") {
            setPaymentDetails((prev) => ({
                ...prev,
                paymentMethod: value,
            }));
        } else {
            if (newMember) {
                setNewMember((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
            if (selectedMember) {
                setSelectedMember((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }

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
                    if (value && typeof value === 'string' && value.trim() !== "") {
                        delete newErrors[name];
                    }
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
                case "paymentMethod":
                    if (value) delete newErrors.paymentMethod;
                    else newErrors.paymentMethod = "Payment method is required";
                    break;
                default:
                    break;
            }

            return newErrors;
        });
    };

    const handleEdit = (memberId) => {
        const memberToEdit = members.find((member) => member.member_id === memberId);
        if (!memberToEdit) {
            console.error("Error: Member not found.");
            return;
        }
        setSelectedMember({ ...memberToEdit });
        setEditDialogOpen(true);
    };

    const handleSaveChanges = async () => {
        if (!selectedMember || !selectedMember.member_id) {
            console.error("Error: No member selected for update.");
            return;
        }

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

            setLoading(true);
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    GYM MEMBERS
                </Typography>

                <Paper elevation={1} className="p-4 mb-6 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="ml-4 flex space-x-2">
                            <button
                                className="bg-red-900 text-white w-40 rounded-lg flex items-center shadow-md hover:bg-red-800 transition h-[40px]"
                                onClick={() => setOpenDialog(true)}
                            >
                                <Plus className="w-5 h-5 mr-2 ml-3" />
                                Add Member
                            </button>
                        </div>
                    </div>
                </Paper>

                {loading && <Typography>Loading members...</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                {!loading && !error && (
                    <Paper elevation={1} className="rounded-lg">
                        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                            <TableContainer
                                component={Paper}
                                className="table-container"
                                sx={{
                                    height: "calc(100vh - 230px)",
                                    width: "calc(100vw - 305px)",
                                    marginLeft: "13px",
                                    scrollbarWidth: "none",
                                    "&::-webkit-scrollbar": {
                                        display: "none",
                                    },
                                }}
                            >
                                <Table className="w-full border-collapse">
                                    <TableHead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                                        <TableRow className="bg-gray-200 text-blue-950 text-left text-xs font-medium uppercase tracking-wider">
                                            <th className="px-6 py-3 text-center">ID</th>
                                            <th className="px-6 py-3 text-center">Name</th>
                                            <th className="px-6 py-3 text-center">Username</th>
                                            <th className="px-6 py-3 text-center">Email</th>
                                            <th className="px-6 py-3 text-center">Phone</th>
                                            <th className="px-6 py-3 text-center">Address</th>
                                            <th className="px-6 py-3 text-center">DOB</th>
                                            <th className="px-6 py-3 text-center">Age</th>
                                            <th className="px-6 py-3 text-center">Gender</th>
                                            <th className="px-6 py-3 text-center">Height</th>
                                            <th className="px-6 py-3 text-center">Weight</th>
                                            <th className="px-6 py-3 text-center">Blood Group</th>
                                            <th className="px-6 py-3 text-center">Fitness Level</th>
                                            <th className="px-6 py-3 text-center">Fitness Goal</th>
                                            <th className="px-6 py-3 text-center">Plan</th>
                                            <th className="px-6 py-3 text-center">Health Issues</th>
                                            <th className="px-6 py-3 text-center">Registered Date</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                            <th className="px-6 py-3 text-center">Actions</th>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="divide-y divide-gray-200">
                                        {filteredMembers.map((member, index) => (
                                            <TableRow
                                                key={member.member_id}
                                                className="table-row"
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                                                    "&:hover": {
                                                        backgroundColor: "#e0e0e0",
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
                                                <TableCell>{member.health_issues}</TableCell>
                                                <TableCell>{(new Date(member.registered_date).toLocaleDateString())}</TableCell>
                                                <TableCell>
                          <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  member.status == 1
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                          >
                            {member.status == 1 ? "ACTIVE" : "EXPIRED"}
                          </span>
                                                </TableCell>
                                                <TableCell
                                                    className="table-cell-actions1"
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <IconButton
                                                        sx={{
                                                            backgroundColor: "#4A90E2",
                                                            color: "#ffffff",
                                                            borderRadius: "4px",
                                                            width: "40px",
                                                            height: "40px",
                                                            padding: "8px",
                                                            "&:hover": {
                                                                backgroundColor: "#357ABD",
                                                            },
                                                        }}
                                                        onClick={() => handleEdit(member.member_id)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{
                                                            backgroundColor: "#E94E4E",
                                                            color: "#ffffff",
                                                            borderRadius: "4px",
                                                            width: "40px",
                                                            height: "40px",
                                                            padding: "8px",
                                                            "&:hover": {
                                                                backgroundColor: "#C33C3C",
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
                    </Paper>
                )}
            </div>

            {/* Add Member Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Add New Member</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {["username", "fullname", "contactNo", "dob", "weight"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={
                                        field === "weight"
                                            ? "Weight (kg)"
                                            : field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())
                                    }
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newMember[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    type={field === "dob" ? "date" : "text"}
                                    InputLabelProps={field === "dob" ? { shrink: true } : {}}
                                    inputProps={
                                        field === "dob"
                                            ? { max: new Date(Date.now() - 86400000).toISOString().split("T")[0] }
                                            : {}
                                    }
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
                        <Grid item xs={6}>
                            {["password", "email", "address", "age", "height"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={
                                        field === "height"
                                            ? "Height (cm)"
                                            : field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())
                                    }
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newMember[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    disabled={field === "age"}
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
                                        <MenuItem key={type.plan_id} value={type.plan_id}>
                                            {type.plan_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {newMember.plan_id && (
                                <Box mt={2} p={2} border={1} borderRadius={4} borderColor="grey.300">
                                    <Typography variant="h6">Payment Details</Typography>
                                    <TextField
                                        margin="dense"
                                        label="Plan Amount (Rs)"
                                        fullWidth
                                        variant="outlined"
                                        Macquarie University
                                        name="amount"
                                        value={paymentDetails.amount }
                                        disabled
                                    />
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Payment Method</InputLabel>
                                        <Select
                                            label="Payment Method"
                                            name="paymentMethod"
                                            value={paymentDetails.paymentMethod}
                                            onChange={handleInputChange}
                                            error={!!errors.paymentMethod}
                                        >
                                            <MenuItem value="Cash">Cash</MenuItem>
                                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                                            <MenuItem value="UPI">UPI</MenuItem>
                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                        </Select>
                                        {errors.paymentMethod && (
                                            <Typography color="error" variant="caption">{errors.paymentMethod}</Typography>
                                        )}
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleConfirmPayment}
                                        disabled={paymentConfirmed}
                                        sx={{ mt: 2 }}
                                    >
                                        {paymentConfirmed ? "Payment Confirmed" : "Confirm Payment"}
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddMember} color="primary" disabled={!paymentConfirmed}>
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
                                    inputProps={{
                                        max: new Date(Date.now() - 86400000).toISOString().split("T")[0],
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
                                        label={
                                            field === "height"
                                                ? "Height (cm)"
                                                : field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())
                                        }
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
                                        value={selectedMember.plan_id || ''}
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
                            <Grid item xs={6}>
                                {["full_name", "contact_no", "age", "weight"].map((field) => (
                                    <TextField
                                        key={field}
                                        margin="dense"
                                        label={
                                            field === "weight"
                                                ? "Weight (kg)"
                                                : field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())
                                        }
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

            <AdminSideBar />
        </div>
    );
};

export default ManageMembers;