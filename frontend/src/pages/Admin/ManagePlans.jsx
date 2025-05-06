import React, {useEffect, useState} from "react";
import Sidebar from "../../pages/Admin/AdminSideBar.jsx";
import {Check, Plus, Search} from "lucide-react";
import { Delete, MoreVert } from "@mui/icons-material";
import AdminSideBar from "../../pages/Admin/AdminSideBar.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";

const ManagePlans = () => {
    const styles = {
        sidebarBgColor: "#1a1b23",
        textColor: "#a4a1b6",
        iconBgColor: "#262626",
        activeBgColor: "#3c1e1e",
        activeTextColor: "#e3e3e8",
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPlan, setNewPlan] = useState("");
    const [errors, setErrors] = useState({});
    const [plans, setPlans] = useState([]); // State to store membership types
    const [selectedPlan, setSelectedPlan] = useState(null); // State for the selected plan for editing
    const [openMenuId, setOpenMenuId] = useState(null); // Store the menu ID
    const toggleMenu = (planId) => {
        setOpenMenuId(openMenuId === planId ? null : planId); // Toggle the specific plan's menu
    };
    const [updatedPlan, setUpdatedPlan] = useState({
        plan_name: "",
        plan_price: "",
        plan_duration: "",
        features: ""
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get("http://localhost:8800/api/plans/all");
                setPlans(response.data); // Store membership plans in the state
            } catch (error) {
                console.error("Error fetching membership plans:", error);
            }
        };
        fetchPlans();
    }, []);

    // Handle Add Plan dialog submission
    const handleAddPlan = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/plans/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newPlan),
                });

                if (!response.ok) {
                    throw new Error("Failed to add new plan.");
                }
                alert("Plan added successfully!");

                setOpenDialog(false); // Close the dialog
            } catch (err) {
                setError(err.message);
            }
    };

    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setNewPlan((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSelectedPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Handle Edit button click
    const handleEdit = (planId) => {
        const planToEdit = plans.find((plan) => plan.plan_id === planId);
        if (!planToEdit) {
            console.error("Error: Plan not found.");
            return;
        }
        console.log("Editing Plan:", planToEdit);
        setSelectedPlan({ ...planToEdit }); // Ensure a fresh state copy
        setEditDialogOpen(true);
    };


// Function to handle saving changes
    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`http://localhost:8800/api/plans/edit/${selectedPlan.plan_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedPlan),
            });

            if (!response.ok) {
                throw new Error(`Failed to update plan: ${response.statusText}`);
            }

            // Update the plan in the state
            setPlans((prevPlans) =>
                prevPlans.map((plan) =>
                    plan.plan_id === selectedPlan.plan_id ? { ...plan, ...selectedPlan } : plan
                )
            );

            const updatedplan = await response.json();
            console.log("Trainer successfully updated:", updatedplan);

            setLoading(true);
            // Close the dialog
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating trainer:", error);
        }
    };

    // Handle Delete button click
    const handleDelete = async (planId) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/plans/delete/${planId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete plan.");
                }
                setPlans((prevPlans) => prevPlans.filter((plan) => plan.plan_id !== planId));
                alert("Plan deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh" ,paddingRight: "30px", marginTop: "10px" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh",  width:"1300px" ,overflowY: "auto" , marginLeft: "-45px" , marginBottom: "80px" }}>
                {/* <TopBar /> */}
                <Typography variant="h4" gutterBottom>
                    GYM PLANS
                </Typography>

                {/* Page Header */}
                <Paper elevation={1} className="p-4 mb-6 rounded-lg" style={{marginBottom: "70px"}}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search plans..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="ml-4 flex space-x-2">
                            {/* Add Plan Button */}
                            <button className="bg-red-900 text-white w-40  rounded-lg flex items-center shadow-md hover:bg-red-800 transition h-[40px] "
                                    onClick={() => setOpenDialog(true)}>
                                <Plus className="w-5 h-5 mr-2 ml-2" />
                                Add Plan
                            </button>
                        </div>
                    </div>
                </Paper>

                {/* Plans Grid */}
                <Paper elevation={1} className="rounded-lg">
                <div className="bg-white rounded-xl shadow-sm p-3 " style={{ marginTop: "-55px"}} >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-16 " style={{paddingLeft: "20px", marginRight: "20px", marginTop:"35px" ,paddingTop: "20px", marginBottom: "55px" }}>
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 border-2 border-transparent hover:border-red-700 hover: p-6 flex flex-col justify-between"
                            >
                                {/* Three-Dot Menu in the Top Right Corner */}
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => toggleMenu(plan.plan_id)}
                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                                        aria-label="More options"
                                    >
                                        <MoreVert className="w-6 h-6" />
                                    </button>

                                    {/* Dropdown Menu (Only Opens for the Clicked Plan) */}
                                    {openMenuId === plan.plan_id && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                            <button
                                                onClick={() => handleDelete(plan.plan_id)}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                <Delete className="w-5 h-5 mr-2" /> Delete Plan
                                            </button>
                                        </div>
                                    )}
                                </div>


                                {/* Plan Name & Pricing */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{plan.plan_name}</h3>
                                    {/*<p className="text-gray-500 text-sm">{plan.features}</p>*/}

                                    <div className="mt-3">
                                        <span className="text-3xl font-bold text-gray-900">{plan.plan_price}</span>
                                        <span className="text-gray-500 text-lg">/{plan.plan_duration}</span>
                                    </div>

                                    <ul className="space-y-3 mt-4">
                                        {(plan.features || "").split(", ").map((feature, i) => (
                                            <li key={i} className="flex items-center">
                                                <Check className="w-5 h-5 text-green-500 mr-2" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}

                                    </ul>
                                </div>

                                {/* Edit Button */}
                                <div className="mt-auto pt-6">
                                    <button
                                        className="w-full bg-red-900 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-red-800 transition"
                                        onClick={() => handleEdit(plan.plan_id)}
                                    >
                                        Edit Plan
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                </Paper>
            </div>

            {/*Add plan*/}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Add New Plan</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={6}>
                            {["plan_name", "plan_price"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newPlan[field]}
                                    onChange={handleInputChange}
                                />
                            ))}
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={6}>
                            {["plan_duration", "features"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newPlan[field]}
                                    onChange={handleInputChange}
                                />
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddPlan} color="primary">
                        Add Plan
                    </Button>
                </DialogActions>
            </Dialog>

            {/*edit plan*/}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Edit Plan</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={6}>
                            {["plan_name", "plan_price"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={selectedPlan?.[field] || ""}
                                    onChange={handleInputChange}
                                />
                            ))}
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={6}>
                            {["plan_duration", "features"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/[^a-zA-Z0-9 ]/g, "").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={selectedPlan?.[field] || ""}
                                    onChange={handleInputChange}
                                />
                            ))}
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
    );
};

export default ManagePlans;
