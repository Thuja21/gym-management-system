// MemberDashboard.jsx
import React, {useState} from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import {Edit as EditIcon, Plus, Search, Trash as DeleteIcon} from "lucide-react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid, Paper, Table, TableBody,
    TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@mui/material";


const ManageSupplements = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [newSupplement, setNewSupplement] = useState("");
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setnewSupplement((prev) => ({
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
                        placeholder="Search supplements..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
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
                {loading && <Typography>Loading supplements...</Typography>}
                {error && <Typography color="error">{error}</Typography>}


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
                                    <TableRow className="bg-red-900 text-white text-left text-xs font-medium uppercase tracking-wider">
                                        <th className="px-6 py-3 text-center">ID</th>
                                        <th className="px-6 py-3">Image</th>
                                        <th className="px-6 py-3">Supplement Name</th>
                                        <th className="px-6 py-3">Description</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Expiry Date</th>
                                        <th className="px-6 py-3">Stock Quantity</th>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-gray-200">
                                        <TableRow

                                            sx={{
                                                backgroundColor: "#ffffff", // Alternate row colors
                                                "&:hover": {
                                                    backgroundColor: "#e0e0e0", // Highlight on hover
                                                },

                                            }}
                                        >


                                        </TableRow>

                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                )


            </div>

            {/* Add Supplement Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Add New Supplement</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={6}>
                            {["supplement_name", "description", "price", "quantity_in_stock"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/[^a-zA-Z0-9 ]/g, "")
                                        .replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newSupplement[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    type={field === "price" || field === "quantity_in_stock" ? "number" : "text"}
                                />
                            ))}
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={6}>
                            {["expiry_date", "category", "image_url"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/[^a-zA-Z0-9 ]/g, "")
                                        .replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newSupplement[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    type={field === "expiry_date" ? "date" : "text"}
                                    InputLabelProps={field === "expiry_date" ? { shrink: true } : {}}
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
                        Add Supplement
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ManageSupplements;
