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
    Typography, Button, Box, IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const ManageTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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


return (

    <div style={{ display: "flex", height: "100vh" }}>
        <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
        <div style={{ flexGrow: 1, padding: "20px", height: "100vh", overflowY: "auto" }}>
            {/* <TopBar /> */}
            <Typography variant="h4" gutterBottom>
                TRAINERS
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
                    Add Trainer
                </Button>
            </Box>

            {loading && <Typography>Loading members...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && (
                <div style={{ width: "100%", overflowX: "auto" }}>
                    <TableContainer
                        component={Paper} className="table-container"
                        sx={{
                            marginTop: "45px",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Add shadow for better appearance
                            borderRadius: "8px", // Rounded corners
                            height: "calc(100vh - 230px)", // Adjust height to fit within the page (leave space for topbar and padding)
                            width:"calc(100vw - 375px)",
                            overflowY: "auto", // Enable vertical scrolling
                            overflowX: "auto", // Enable horizontal scrolling for large tables
                            scrollbarWidth: "none", // Hide scrollbar for Firefox
                            "&::-webkit-scrollbar": {
                                display: "none", // Hide scrollbar for Webkit-based browsers (Chrome, Edge, etc.)
                            },

                        }}
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
                                    <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center"}}>Email</TableCell>
                                    <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Phone</TableCell>
                                    <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Address</TableCell>
                                    <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>DOB</TableCell>
                                    <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Age</TableCell>
                                    <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Specialization</TableCell>
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
                                        <TableCell sx={{ textAlign: "center",}}>{trainer.trainer_id}</TableCell>
                                        <TableCell sx={{ textAlign: "center",}}>{trainer.full_name}</TableCell>
                                        <TableCell sx={{ textAlign: "center",}}>{trainer.email}</TableCell>
                                        <TableCell sx={{ textAlign: "center",}}>{trainer.contact_no}</TableCell>
                                        <TableCell sx={{ textAlign: "center",}}>{trainer.address}</TableCell>
                                        <TableCell sx={{ textAlign: "center",}}>{(new Date(trainer.dob).toLocaleDateString())}</TableCell>
                                        <TableCell sx={{ textAlign: "center",}}>{trainer.age}</TableCell>
                                        <TableCell sx={{ textAlign: "center",}}>{trainer.specialization}</TableCell>
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
    </div>
        );

    };
export default ManageTrainers;


