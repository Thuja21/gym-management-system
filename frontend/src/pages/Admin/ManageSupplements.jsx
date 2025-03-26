// MemberDashboard.jsx
import React, {useState, useEffect} from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import {Edit as EditIcon, Plus, Search, Trash as DeleteIcon} from "lucide-react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid, IconButton, Paper, Table, TableBody,
    TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@mui/material";

const ManageSupplements = () => {
    const [supplements, setSupplements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [newSupplement, setNewSupplement] = useState("");
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch supplements from backend
    useEffect(() => {
        const fetchSupplements = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/supplements/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch supplements.");
                }
                const data = await response.json();
                setSupplements(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSupplements();
    }, [loading]);

    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setnewSupplement((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    // Handle Delete button click
    const handleDelete = async (supplementId) => {
        if (window.confirm("Are you sure you want to delete this supplement?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/supplements/delete/${supplementId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete supplement.");
                }
                setSupplements((prevSupplements) => prevSupplements.filter((supplement) => supplement.supplement_id !== supplementId));
                alert("Supplement deleted successfully!");
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div  className="bg-gray-100" style={{ display: "flex", height: "100vh" ,paddingRight: "30px" }}>
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
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="ml-4 flex space-x-2">
                            {/* Add supplement Button */}
                            <button className="bg-red-900 text-white w-44  rounded-lg flex items-center shadow-md hover:bg-red-800 transition h-[40px] "
                                    onClick={() => setOpenDialog(true)}>
                                <Plus className="w-5 h-5 mr-2 ml-2" />
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
                                    <TableRow className="bg-red-200 text-blue-950 text-xs font-medium uppercase tracking-wider text-center">
                                        <th className="px-6 py-3 text-center">ID</th>
                                        <th className="px-6 py-3">Image</th>
                                        <th className="px-6 py-3">Supplement Name</th>
                                        <th className="px-20 py-3">Description</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Brand</th>
                                        <th className="px-6 py-3">Size</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Expiry Date</th>
                                        <th className="px-6 py-3">Stock Quantity</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-gray-200">
                                    {supplements.map((supplement, index) => (
                                        <TableRow
                                            key={supplement.supplement_id} className="table-row text-[14px]"
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff", // Alternate row colors
                                                "&:hover": {
                                                    backgroundColor: "#e0e0e0", // Highlight on hover
                                                },
                                            }}
                                        >
                                            <td className="px-6 py-1 text-center ">{supplement.supplement_id}</td>
                                            <td className="px-6 py-1 text-center">
                                                <img src={supplement.image_url} alt={supplement.supplement_name} className="h-12 w-12 object-cover rounded-md" />
                                            </td>
                                            <td className="px-6 py-1 text-center">{supplement.supplement_name}</td>
                                            <td className="px-6 py-1 text-center">
                                                {supplement.description ? supplement.description.split(" ").slice(0, 5).join(" ") + "..." : "N/A"}
                                            </td>
                                            <td className="px-6 py-1 text-center">{supplement.category}</td>
                                            <td className="px-6 py-1 text-center">{supplement.brand}</td>
                                            <td className="px-6 py-1 text-center">{supplement.size}</td>
                                            <td className="px-6 py-1 text-center">${supplement.price}</td>
                                            <td className="px-6 py-1 text-center">{supplement.expiry_date ? new Date(supplement.expiry_date).toLocaleDateString() : "N/A"}</td>
                                            <td className="px-6 py-1 text-center">{supplement.quantity_in_stock}</td>


                                            {/* Actions */}
                                            <td className="table-cell-actions"
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: "20px", // Space between buttons
                                                }}
                                            >
                                                {/* Edit Button */}
                                                <IconButton
                                                    sx={{
                                                        backgroundColor: "#4A90E2", // Blue background
                                                        color: "#ffffff", // White icon color
                                                        borderRadius: "4px",
                                                        width: "40px",
                                                        height: "40px",
                                                        padding: "8px",
                                                        "&:hover": { backgroundColor: "#357ABD" },
                                                    }}
                                                    onClick={() => handleEdit(supplement.supplement_id)}
                                                >
                                                    <EditIcon />
                                                </IconButton>

                                                {/* Delete Button */}
                                                <IconButton
                                                    sx={{
                                                        backgroundColor: "#E94E4E", // Red background
                                                        color: "#ffffff", // White icon color
                                                        borderRadius: "4px",
                                                        width: "40px",
                                                        height: "40px",
                                                        padding: "8px",
                                                        "&:hover": { backgroundColor: "#C33C3C" },
                                                    }}
                                                    onClick={() => handleDelete(supplement.supplement_id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </td>
                                        </TableRow>
                                    ))}
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
