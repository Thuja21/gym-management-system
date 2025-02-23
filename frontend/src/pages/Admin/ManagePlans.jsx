// "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

import React, {useState} from "react";
import Sidebar from "../../pages/Admin/AdminSideBar.jsx";
import {Check, Plus, Search} from "lucide-react";
import AdminSideBar from "../../pages/Admin/AdminSideBar.jsx";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography} from "@mui/material";

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
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const menuItems = [
        { title: "Manage Plans", to: "/plans", icon: <Check />, color: "#f44336" },
    ];

    const plans = [
        {
            name: "Monthly Plan",
            price: "Rs 4000",
            duration: "month",
            features: ["Limited gym access", "Locker facility", "One personal training session"],
        },
        {
            name: "Quarterly Plan",
            price: "Rs 10000",
            duration: "3 months",
            features: ["Full gym access", "Locker facility", "Two personal training sessions", "Free access to group workouts",],
        },
        {
            name: "Yearly Plan",
            price: "Rs 35000",
            duration: "year",
            features: ["Full gym access", "Locker facility", "Five personal training sessions", "Nutrition Consultation",],
        },
    ];

    return (
        <div style={{ display: "flex", height: "100vh" ,paddingRight: "30px", marginTop: "10px" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh",  width:"1300px" ,overflowY: "auto" , marginLeft: "-45px" , marginBottom: "80px" }}>
                {/* <TopBar /> */}
                <Typography variant="h4" gutterBottom>
                    GYM PLANS
                </Typography>

                {/* Page Header */}
                <div className="bg-white rounded-xl shadow-sm p-3 " style={{marginBottom: "70px"}}>
                    <div className="flex items-center">
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
                            <button className="bg-red-900 text-white w-40  rounded-lg flex items-center shadow-md hover:bg-red-800 transition"
                                    onClick={() => setOpenDialog(true)}>
                                <Plus className="w-5 h-5 mr-2" />
                                Add Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="bg-white rounded-xl shadow-sm p-3 " style={{height: "78%" , marginTop: "-55px"}} >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 h-[400px] " style={{paddingLeft: "20px", marginRight: "20px", marginTop:"35px" ,paddingTop: "20px"}}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 border-2 border-transparent hover:border-red-700 hover: p-6 flex flex-col justify-between"
                        >
                            {/* Plan Name & Pricing */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                                <p className="text-gray-500 text-sm">{plan.description}</p>

                                <div className="mt-3">
                                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 text-lg">/{plan.duration}</span>
                                </div>

                                {/* Features List */}
                                <ul className="space-y-3 mt-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-2" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                                {/* Edit Button */}
                                <div className="mt-auto pt-6">
                                <button className="w-full bg-red-900 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-red-800 transition">
                                    Edit Plan
                                </button>
                                    </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>


            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Add New Plan</DialogTitle>
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
                    <Button >
                        Add Plan
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ManagePlans;
