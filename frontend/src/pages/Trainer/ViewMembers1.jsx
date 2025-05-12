import React, { useEffect, useState } from "react";
import TrainerSideBar from "./TrainerSideBar.jsx";
import { Edit as EditIcon, Trash as DeleteIcon } from "lucide-react";
import { Search, MoreVertical, Plus } from "lucide-react";
import "../Admin/Admin.css";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, IconButton, Grid, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import axios from "axios";

const ViewMember = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [plans, setPlans] = useState([]); // State to store membership types
    const [errors, setErrors] = useState({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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


    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <TrainerSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width:"1300px" ,overflowY: "auto" , marginLeft: "-45px", marginTop: "10px" }}>
                {/* <TopBar /> */}
                <Typography variant="h4" gutterBottom>
                    GYM MEMBERS
                </Typography>

                <Paper elevation={1} className="p-4 mb-6 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl">
                        {/*<div className="flex items-center">*/}
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </Paper>



                {loading && <Typography>Loading members...</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                {!loading && !error && (
                    <Paper elevation={1} className="p-4 mb-6 rounded-lg">
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
                                        <TableRow className="bg-gray-200 text-blue-950 text-left text-xs font-medium uppercase tracking-wider">

                                            <th className="px-6 py-3 text-center">Name</th>
                                            <th className="px-6 py-3 text-center">Phone</th>
                                            <th className="px-6 py-3 text-center">Age</th>
                                            <th className="px-6 py-3 text-center">Gender</th>
                                            <th className="px-6 py-3 text-center">Height</th>
                                            <th className="px-6 py-3 text-center">Weight</th>
                                            <th className="px-6 py-3 text-center">Blood Group</th>
                                            <th className="px-6 py-3 text-center">Fitness Level</th>
                                            <th className="px-6 py-3 text-center">Fitness Goal</th>
                                            <th className="px-6 py-3 text-center">Health Issues</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="divide-y divide-gray-200">
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
                                                <TableCell>{member.full_name}</TableCell>
                                                <TableCell>{member.contact_no}</TableCell>
                                                <TableCell>{member.age}</TableCell>
                                                <TableCell>{member.gender}</TableCell>
                                                <TableCell>{member.height}</TableCell>
                                                <TableCell>{member.weight}</TableCell>
                                                <TableCell>{member.blood_group}</TableCell>
                                                <TableCell>{member.current_fitness_level}</TableCell>
                                                <TableCell>{member.fitness_goal}</TableCell>
                                                <TableCell>{member.health_issues}</TableCell>
                                                <TableCell><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    member.status == 1
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                                >{member.status == 1 ? "ACTIVE" : "EXPIRED"}
                                            </span>
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
        </div>
    );
};

export default ViewMember;
