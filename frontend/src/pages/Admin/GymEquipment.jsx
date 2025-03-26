import React, {useEffect, useState} from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import {Plus, Search, Edit as EditIcon, Trash as DeleteIcon } from "lucide-react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, IconButton, Grid, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";

const ManageEquipments = () => {
    const [equipments, setEquipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [newEquipment, setNewEquipment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    // Fetch members from backend
    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/equipments/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch equipments.");
                }
                const data = await response.json();
                setEquipments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipments();
    }, [loading]);


    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewEquipment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // Handle Add Equipment dialog submission
    const handleAddEquipment = async () => {
        try {
            const response = await fetch("http://localhost:8800/api/equipments/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEquipment),
            });

            if (!response.ok) {
                throw new Error("Failed to add new equipment.");
            }
            alert("Equipment added successfully!");

            setOpenDialog(false); // Close the dialog
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle Edit button click
    const handleEdit = (equipmentId) => {
        const equipmentToEdit = equipments.find((equipment) => equipment.equipment_id === equipmentId);
        if (!equipmentToEdit) {
            console.error("Error: Trainer not found.");
            return;
        }
        console.log("Editing Trainer:", equipmentToEdit);
        setSelectedEquipment({ ...equipmentToEdit }); // Ensure a fresh state copy
        setEditDialogOpen(true);
    };

    // Function to handle saving changes
    const handleSaveChanges = async () => {
        if (!selectedEquipment || !selectedEquipment.equipment_id) {
            console.error("Error: No trainer selected for update.");
            return;
        }

        console.log("Updated trainer Data:", selectedEquipment);

        try {
            const response = await fetch(`http://localhost:8800/api/trainers/edit/${selectedEquipment.equipment_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedEquipment),
            });

            if (!response.ok) {
                throw new Error(`Failed to update trainer: ${response.statusText}`);
            }

            const updatedequipment = await response.json();
            console.log("Trainer successfully updated:", updatedequipment);

            setLoading(true);
            // Close the dialog
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating trainer:", error);
        }
    };

    // Handle Delete button click
    const handleDelete = async (equipmentId) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/equipments/delete/${equipmentId}`, {
                    method: "DELETE", // Use appropriate method for your backend
                });
                if (!response.ok) {
                    throw new Error("Failed to delete equipment.");
                }
                setEquipments((prevEquipments) => prevEquipments.filter((equipment) => equipment.equipment_id !== equipmentId));
                alert("Equipment deleted successfully!");
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
                                placeholder="Search equipments..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="ml-4 flex space-x-2">
                            {/* Add equipment Button */}
                            <button className="bg-red-900 text-white w-44  rounded-lg flex items-center shadow-md hover:bg-red-800 transition h-[40px] "
                                    onClick={() => setOpenDialog(true)}>
                                <Plus className="w-5 h-5 mr-2 ml-2" />
                                Add Equipment
                            </button>
                        </div>
                    </div>
                </div>

            {loading && <Typography>Loading equipment...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && (
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
                                <TableRow className="bg-red-200 text-blue-950 text-left text-xs font-medium uppercase tracking-wider">
                                    <th className="px-6 py-3 text-center">ID</th>
                                    <th className="px-6 py-3 text-center">Equipment Name</th>
                                    <th className="px-6 py-3 text-center">Category</th>
                                    <th className="px-6 py-3 text-center">Brand</th>
                                    <th className="px-6 py-3 text-center">Quantity</th>
                                    <th className="px-6 py-3 text-center">Purchased Date</th>
                                    <th className="px-6 py-3 text-center">Unit Price</th>
                                    <th className="px-6 py-3 text-center">Usage Status</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y divide-gray-200">
                                {equipments.map((equipment, index) => (
                                    <TableRow
                                        key={equipment.equipment_id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                                            "&:hover": {
                                                backgroundColor: "#e0e0e0",
                                            },
                                        }}
                                    >
                                        <TableCell className="text-center">{equipment.equipment_id}</TableCell>
                                        <TableCell className="text-center">{equipment.equipment_name}</TableCell>
                                        <TableCell className="text-center">{equipment.category}</TableCell>
                                        <TableCell className="text-center">{equipment.brand}</TableCell>
                                        <TableCell className="text-center">{equipment.quantity}</TableCell>
                                        <TableCell className="text-center">{new Date(equipment.purchase_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-center">Rs.{equipment.price}</TableCell>
                                        <TableCell className="text-center">{equipment.status}</TableCell>
                                        <TableCell className="table-cell-actions1"
                                                   sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                            {/* Edit Button */}
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#4A90E2",
                                                    color: "#ffffff",
                                                    borderRadius: "4px",
                                                    width: "40px",
                                                    height: "40px",
                                                    padding: "8px",
                                                    "&:hover": { backgroundColor: "#357ABD" },
                                                }}
                                                onClick={() => handleEdit(equipment.equipment_id)}
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            {/* Delete Button */}
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#E94E4E",
                                                    color: "#ffffff",
                                                    borderRadius: "4px",
                                                    width: "40px",
                                                    height: "40px",
                                                    padding: "8px",
                                                    "&:hover": { backgroundColor: "#C33C3C" },
                                                }}
                                                onClick={() => handleDelete(equipment.equipment_id)}
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

            {/* Add Equipment Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Left Column (4 fields) */}
                        <Grid item xs={6}>
                            {["equipment_name", "category", "brand", "quantity"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newEquipment[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    type={
                                        field === "quantity" ? "number" : "text"
                                    }
                                />
                            ))}
                        </Grid>

                        {/* Right Column (3 fields) */}
                        <Grid item xs={6}>
                            {["purchase_date", "unit_price", "status"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={newEquipment[field]}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    type={
                                        field === "purchase_date"
                                            ? "date"
                                            : field === "price" || field === "quantity"
                                                ? "number"
                                                : "text"
                                    }
                                    InputLabelProps={field === "purchase_date" ? { shrink: true } : {}}
                                    select={field === "status"}
                                >
                                    {field === "status" && ["Available", "In Use", "Under Maintenance"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddEquipment} color="primary">
                        Add Equipment
                    </Button>
                </DialogActions>
            </Dialog>

                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle>Edit Equipment Details</DialogTitle>
                    <DialogContent>
                        {selectedEquipment && (
                            <Grid container spacing={2}>
                                {/* Left Column (4 fields) */}
                                <Grid item xs={6}>
                                    {["equipment_name", "category", "brand", "quantity"].map((field) => (
                                        <TextField
                                            key={field}
                                            margin="dense"
                                            label={field.replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase())}
                                            fullWidth
                                            variant="outlined"
                                            name={field}
                                            value={selectedEquipment[field]}
                                            onChange={handleInputChange}
                                            error={!!errors[field]}
                                            helperText={errors[field]}
                                            type={
                                                field === "quantity" ? "number" : "text"
                                            }
                                        />
                                    ))}
                                </Grid>

                                {/* Right Column (3 fields) */}
                                <Grid item xs={6}>
                                    {["purchase_date", "price", "status"].map((field) => (
                                        <TextField
                                            key={field}
                                            margin="dense"
                                            label={field.replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase())}
                                            fullWidth
                                            variant="outlined"
                                            name={field}
                                            value={selectedEquipment[field]}
                                            onChange={handleInputChange}
                                            error={!!errors[field]}
                                            helperText={errors[field]}
                                            type={
                                                field === "purchase_date"
                                                    ? "date"
                                                    : field === "price" || field === "quantity"
                                                        ? "number"
                                                        : "text"
                                            }
                                            InputLabelProps={field === "purchase_date" ? { shrink: true } : {}}
                                            select={field === "status"}
                                        >
                                            {field === "status" && ["Available", "In Use", "Under Maintenance"].map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    ))}
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
            </div>
        </div>
    );
};

export default ManageEquipments;
