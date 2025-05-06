import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import { Plus, Search, Edit as EditIcon, Trash as DeleteIcon, ChevronDown, ChevronRight } from "lucide-react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, IconButton, Grid, MenuItem, Select, InputLabel, FormControl, Collapse, Box
} from "@mui/material";
import { CircularProgress, Alert, InputAdornment } from "@mui/material";

const ManageEquipments = () => {
    const [equipments, setEquipments] = useState([]);
    const [equipment_variants, setEquipment_variants] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [itemManagementDialog, setItemManagementDialog] = useState(false);
    const [newEquipment, setNewEquipment] = useState({
        equipment_name: "",
        category: "",
        brand: "",
        quantity: 1,
        purchase_date: "",
        price: "",
        status: "Available"
    });
    const [loading, setLoading] = useState(true);
    const [itemLoading, setItemLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [expandedEquipment, setExpandedEquipment] = useState(null);
    const [equipmentItems, setEquipmentItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filteredCounts, setFilteredCounts] = useState({});

    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/equipments/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch equipments.");
                }
                const data = await response.json();

                // Group by equipment_id to create summary
                const grouped = data.reduce((acc, item) => {
                    if (!acc[item.equipment_id]) {
                        acc[item.equipment_id] = {
                            equipment_id: item.equipment_id,
                            equipment_name: item.equipment_name,
                            category: item.category,
                            total_quantity: 0,
                            variants: []
                        };
                    }
                    acc[item.equipment_id].variants.push(item);
                    acc[item.equipment_id].total_quantity += item.quantity;
                    return acc;
                }, {});

                setEquipments(Object.values(grouped));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipments();
    }, []);

    // Generate individual items when expanded
    useEffect(() => {
        if (expandedEquipment) {
            const equipment = equipments.find(e => e.equipment_id === expandedEquipment);
            if (equipment) {
                const items = [];
                equipment.variants.forEach(variant => {
                    for (let i = 0; i < variant.quantity; i++) {
                        // Generate a unique ID for each item
                        const itemId = `${variant.variant_id}`;

                        // Try to find existing item to preserve its status if it exists
                        const existingItem = equipmentItems.find(item => item.variant_id === itemId);

                        items.push({
                            variant_id: itemId,
                            equipment_id: variant.equipment_id,
                            equipment_name: variant.equipment_name,
                            brand: variant.brand,
                            serial_number: `SN-${variant.brand.substring(0, 3)}-${variant.equipment_id}${i}`,
                            purchase_date: variant.purchase_date,
                            price: variant.price,
                            // Use existing status if available, otherwise use variant status
                            status: existingItem ? existingItem.status : variant.status
                        });
                    }
                });
                setEquipmentItems(items);
            }
        }
    }, [expandedEquipment, equipments]);

    // Calculate filtered counts when status filter changes
    useEffect(() => {
        if (statusFilter === "all") {
            // Reset filtered counts to total counts
            const totalCounts = {};
            equipments.forEach(equipment => {
                totalCounts[equipment.equipment_id] = equipment.total_quantity;
            });
            setFilteredCounts(totalCounts);
        } else {
            // Calculate filtered counts based on status
            const counts = {};
            equipments.forEach(equipment => {
                // For expanded equipment, use the actual items
                if (expandedEquipment === equipment.equipment_id) {
                    const filteredItems = equipmentItems.filter(item => item.status === statusFilter);
                    counts[equipment.equipment_id] = filteredItems.length;
                } else {
                    // For non-expanded equipment, estimate from variants
                    let count = 0;
                    equipment.variants.forEach(variant => {
                        if (variant.status === statusFilter) {
                            count += variant.quantity;
                        }
                    });
                    counts[equipment.equipment_id] = count;
                }
            });
            setFilteredCounts(counts);
        }
    }, [statusFilter, equipments, equipmentItems, expandedEquipment]);

    const validateForm = () => {
        const newErrors = {};
        if (!newEquipment.equipment_name) newErrors.equipment_name = "Equipment name is required";
        else if (!/^[a-zA-Z0-9\s-]+$/.test(newEquipment.equipment_name))
            newErrors.equipment_name = "Equipment name contains invalid characters";

        if (!newEquipment.category) newErrors.category = "Category is required";
        if (!newEquipment.brand) newErrors.brand = "Brand is required";

        if (!newEquipment.quantity || newEquipment.quantity <= 0)
            newErrors.quantity = "Quantity must be greater than 0";

        if (!newEquipment.purchase_date) newErrors.purchase_date = "Purchase date is required";
        else if (new Date(newEquipment.purchase_date) > new Date())
            newErrors.purchase_date = "Purchase date cannot be in the future";

        if (!newEquipment.price) newErrors.price = "Price is required";
        else if (isNaN(parseFloat(newEquipment.price)) || parseFloat(newEquipment.price) <= 0)
            newErrors.price = "Price must be a positive number";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEquipment(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddEquipment = async () => {
        // Validate form first
        if (!validateForm()) return;

        try {
            // Prepare the data with proper formatting
            const equipmentData = {
                equipment_name: newEquipment.equipment_name.trim(),
                category: newEquipment.category.trim(),
                brand: newEquipment.brand.trim(),
                quantity: parseInt(newEquipment.quantity),
                purchase_date: new Date(newEquipment.purchase_date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
                price: parseFloat(newEquipment.price),
                status: newEquipment.status
            };

            // Validate numeric fields
            if (isNaN(equipmentData.quantity) || equipmentData.quantity <= 0) {
                throw new Error("Quantity must be a positive number");
            }
            if (isNaN(equipmentData.price) || equipmentData.price <= 0) {
                throw new Error("Price must be a positive number");
            }

            const response = await fetch("http://localhost:8800/api/equipments/add", {  // Changed endpoint to match backend
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(equipmentData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to add equipment");
            }

            // Update frontend state
            setEquipments(prev => [...prev, {
                equipment_id: responseData.equipment_id,
                equipment_name: equipmentData.equipment_name,
                category: equipmentData.category,
                total_quantity: equipmentData.quantity,
                variants: [{
                    ...equipmentData,
                    equipment_id: responseData.equipment_id,
                    price: equipmentData.price
                }]
            }]);

            // Reset form
            setNewEquipment({
                equipment_name: "",
                category: "",
                brand: "",
                quantity: 1,
                purchase_date: "",
                price: "",
                status: "Available"
            });
            setOpenDialog(false);

            alert("Equipment added successfully!");

        } catch (err) {
            console.error("Add equipment error:", err);
            alert(err.message || "Failed to add equipment");
            setError(err.message);
        }
    };

    const handleToggleExpand = (equipmentId) => {
        setExpandedEquipment(expandedEquipment === equipmentId ? null : equipmentId);
    };

    const handleUpdateEquipment = async () => {
        if (!validateForm()) return;

        try {
            const updatedEquipments = equipments.map(equipment => {
                if (equipment.equipment_id === selectedEquipment.equipment_id) {
                    const updatedVariants = equipment.variants.map(variant => ({
                        ...variant,
                        equipment_name: newEquipment.equipment_name,
                        category: newEquipment.category,
                        brand: newEquipment.brand,
                        quantity: parseInt(newEquipment.quantity),
                        purchase_date: newEquipment.purchase_date,
                        price: parseFloat(newEquipment.price),
                        // Don't overwrite status here as it should be managed per item
                        status: variant.status
                    }));

                    return {
                        ...equipment,
                        equipment_name: newEquipment.equipment_name,
                        category: newEquipment.category,
                        total_quantity: parseInt(newEquipment.quantity),
                        variants: updatedVariants
                    };
                }
                return equipment;
            });

            setEquipments(updatedEquipments);
            alert("Equipment updated successfully!");
            setEditDialogOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (equipmentId) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/equipments/delete/${equipmentId}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to delete equipment");
                }

                // Update frontend state
                setEquipments(prev => prev.filter(equipment => equipment.equipment_id !== equipmentId));
                alert("Equipment deleted successfully!");
            } catch (err) {
                console.error("Delete equipment error:", err);
                alert(err.message || "Failed to delete equipment");
            }
        }
    };

    // Handle Edit button click for equipment
    const handleOpenItemManagement = (itemId) => {
        const itemToManage = equipmentItems.find((item) => item.variant_id === itemId);
        if (!itemToManage) {
            console.error("Error: Equipment item not found.");
            return;
        }
        setSelectedItem({ ...itemToManage }); // Store selected item
        setItemManagementDialog(true);
    };

    // Function to handle saving equipment changes
    const handleSaveItemChanges = async () => {
        if (!selectedItem) return;

        try {
            // 1. Backend API call to update the item's status
            const response = await fetch(`http://localhost:8800/api/equipments/edit/${selectedItem.variant_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    status: selectedItem.status,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status in backend.");
            }

            // 2. Update frontend state
            // Update the equipment items list
            const updatedItems = equipmentItems.map(item =>
                item.variant_id === selectedItem.variant_id ? { ...item, ...selectedItem } : item
            );

            // Update the main equipment list to reflect the changes
            const updatedEquipments = equipments.map(equipment => {
                if (equipment.equipment_id === selectedItem.equipment_id) {
                    const updatedVariants = equipment.variants.map(variant => {
                        // Check if this variant matches the item's brand (and other identifiers if needed)
                        if (variant.brand === selectedItem.brand) {
                            return {
                                ...variant,
                                brand: selectedItem.brand,
                                purchase_date: selectedItem.purchase_date,
                                price: selectedItem.price,
                                status: selectedItem.status
                            };
                        }
                        return variant;
                    });

                    return {
                        ...equipment,
                        variants: updatedVariants
                    };
                }
                return equipment;
            });

            setEquipmentItems(updatedItems);
            setEquipments(updatedEquipments);

            // Update filtered counts
            if (statusFilter !== "all") {
                const newFilteredCounts = { ...filteredCounts };
                const equipmentId = selectedItem.equipment_id;

                // Count items with the filtered status
                const filteredItems = updatedItems.filter(
                    item => item.equipment_id === equipmentId && item.status === statusFilter
                );
                newFilteredCounts[equipmentId] = filteredItems.length;

                setFilteredCounts(newFilteredCounts);
            }

            alert("Item updated successfully!");
            setItemManagementDialog(false);
        } catch (err) {
            setError(err.message);
            alert(`Error updating item: ${err.message}`);
        }
    };

    const filteredEquipments = equipments.filter((equipment) => {
        const matchesSearch = (
            equipment.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipment.variants.some(v => v.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (!matchesSearch) return false;

        if (statusFilter !== "all") {
            if (expandedEquipment === equipment.equipment_id) {
                return equipmentItems.some(item => item.status === statusFilter);
            }
            return equipment.variants.some(variant => variant.status === statusFilter);
        }

        return true;
    });

    // Count total filtered items
    const totalFilteredItems = filteredEquipments.reduce((total, equipment) => {
        return total + (filteredCounts[equipment.equipment_id] || 0);
    }, 0);

    // Add this function to handle item deletion
    const handleDeleteItem = async () => {
        if (!selectedItem) return;

        if (window.confirm(`Are you sure you want to delete this ${selectedItem.equipment_name} item?`)) {
            try {
                setItemLoading(true);

                const response = await fetch(`http://localhost:8800/api/equipments/delete-item/${selectedItem.variant_id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to delete item");
                }

                // Update frontend state
                // Remove the item from equipmentItems
                const updatedItems = equipmentItems.filter(item => item.variant_id !== selectedItem.variant_id);
                setEquipmentItems(updatedItems);

                // Update the equipment list to reflect the deletion
                const updatedEquipments = equipments.map(equipment => {
                    if (equipment.equipment_id === selectedItem.equipment_id) {
                        // Reduce the total quantity
                        return {
                            ...equipment,
                            total_quantity: equipment.total_quantity - 1
                        };
                    }
                    return equipment;
                });

                setEquipments(updatedEquipments);
                setItemManagementDialog(false);
                alert("Item deleted successfully!");
            } catch (err) {
                console.error("Delete item error:", err);
                alert(err.message || "Failed to delete item");
            } finally {
                setItemLoading(false);
            }
        }
    };


    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    GYM EQUIPMENTS
                </Typography>

                {/* Search and Filter Section */}
                <Paper elevation={1} className="rounded-lg">
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                        <div className="flex items-center">
                            <div className="relative flex-1" >
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search equipments..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="ml-4">
                                <FormControl variant="outlined" size="small" style={{ minWidth: 180 }}>
                                    <InputLabel>Filter by Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        label="Filter by Status"
                                        className="h-[40px]"
                                    >
                                        <MenuItem value="all">All Status</MenuItem>
                                        <MenuItem value="Available">Available</MenuItem>
                                        <MenuItem value="In Use">In Use</MenuItem>
                                        <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Add equipment Button */}
                            <div className="ml-4">
                                <button className="bg-red-900 text-white w-44 rounded-lg flex items-center shadow-md hover:bg-red-800 transition h-[40px]"
                                        onClick={() => {
                                            setNewEquipment({
                                                equipment_name: "",
                                                category: "",
                                                brand: "",
                                                quantity: 1,
                                                purchase_date: "",
                                                price: "",
                                                status: "Available"
                                            });
                                            setOpenDialog(true);
                                        }}>
                                    <Plus className="w-5 h-5 mr-2 ml-2" />
                                    Add Equipment
                                </button>
                            </div>
                        </div>

                        {/* Display total filtered count */}
                        {statusFilter !== "all" && (
                            <div className="mt-2 text-sm text-gray-600">
                                Found {totalFilteredItems} equipment items with status "{statusFilter}"
                            </div>
                        )}
                    </div>
                </Paper>

                {/* Equipment Table */}
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
                                            <th className="px-6 py-3 text-center">Equipment Name</th>
                                            <th className="px-6 py-3 text-center">Category</th>
                                            <th className="px-6 py-3 text-center">
                                                {statusFilter === "all" ? "Total Quantity" : `${statusFilter} Quantity`}
                                            </th>
                                            <th className="px-6 py-3 text-center">Actions</th>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="divide-y divide-gray-200">
                                        {filteredEquipments.map((equipment, index) => (
                                            <React.Fragment key={equipment.equipment_id}>
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                                                        "&:hover": {
                                                            backgroundColor: "#e0e0e0",
                                                        },
                                                    }}
                                                >
                                                    <TableCell className="text-center">
                                                        <IconButton size="small" onClick={() => handleToggleExpand(equipment.equipment_id)}>
                                                            {expandedEquipment === equipment.equipment_id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                        </IconButton>
                                                        {equipment.equipment_id}
                                                    </TableCell>
                                                    <TableCell className="text-center">{equipment.equipment_name}</TableCell>
                                                    <TableCell className="text-center">{equipment.category}</TableCell>
                                                    <TableCell className="text-center">
                                                        {statusFilter === "all"
                                                            ? equipment.total_quantity
                                                            : filteredCounts[equipment.equipment_id] || 0}
                                                    </TableCell>
                                                    <TableCell className="text-center" sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                                        <IconButton
                                                            sx={{
                                                                // backgroundColor: "#E94E4E",
                                                                color: "#E94E4E",
                                                                borderRadius: "4px",
                                                                width: "40px",
                                                                height: "40px",
                                                                padding: "8px",
                                                                // "&:hover": { backgroundColor: "#C33C3C" },
                                                            }}
                                                            onClick={() => handleDelete(equipment.equipment_id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded view - Individual Items */}
                                                {expandedEquipment === equipment.equipment_id && (
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                                            <Collapse in={expandedEquipment === equipment.equipment_id} timeout="auto" unmountOnExit>
                                                                <Box sx={{ margin: 1 }}>
                                                                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                                                                        Individual Items
                                                                    </Typography>
                                                                    <Table size="small" aria-label="individual items">
                                                                        <TableHead>
                                                                            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                                                                                <TableCell className="text-center font-medium">Item ID</TableCell>
                                                                                <TableCell className="text-center font-medium">Brand</TableCell>
                                                                                <TableCell className="text-center font-medium">Purchase Date</TableCell>
                                                                                <TableCell className="text-center font-medium">Price</TableCell>
                                                                                <TableCell className="text-center font-medium">Status</TableCell>
                                                                                <TableCell className="text-center font-medium">Actions</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {equipmentItems
                                                                                .filter(item => statusFilter === "all" || item.status === statusFilter)
                                                                                .map((item, index) => (
                                                                                    <TableRow key={item.variant_id}>
                                                                                        <TableCell className="text-center">{item.variant_id}</TableCell>
                                                                                        <TableCell className="text-center">{item.brand}</TableCell>
                                                                                        <TableCell className="text-center">
                                                                                            {new Date(item.purchase_date).toLocaleDateString()}
                                                                                        </TableCell>
                                                                                        <TableCell className="text-center">Rs.{item.price}</TableCell>
                                                                                        <TableCell className="text-center">
                                                                                        <span
                                                                                            className={`px-2 py-1 rounded-full text-xs ${
                                                                                                item.status === 'Available' ? 'bg-teal-100 text-teal-800' :
                                                                                                    item.status === 'In Use' ? 'bg-amber-100 text-amber-800' :
                                                                                                        'bg-red-100 text-red-800'
                                                                                            }`}
                                                                                        >
                                                                                            {item.status}
                                                                                        </span>
                                                                                        </TableCell>
                                                                                        <TableCell className="text-center">
                                                                                            <div>
                                                                                                <div className="ml-4">
                                                                                                    <button className="border-blue-400 border-1 w-20 text-center text-blue-400 rounded-lg h-[25px] justify-content-center "
                                                                                                            onClick={() => handleOpenItemManagement(item.variant_id)}>
                                                                                                        Manage
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Paper>
                )}

                {/* Add Equipment Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                    <DialogTitle>{selectedEquipment ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            {/* Left Column */}
                            <Grid item xs={6}>
                                {["equipment_name", "category", "brand", "quantity"].map((field) => (
                                    <TextField
                                        key={field}
                                        margin="dense"
                                        label={field.replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase())}
                                        fullWidth
                                        variant="outlined"
                                        name={field}
                                        value={newEquipment[field] || ""}
                                        onChange={handleInputChange}
                                        error={!!errors[field]}
                                        helperText={errors[field]}
                                        type={field === "quantity" ? "number" : "text"}
                                        inputProps={field === "quantity" ? { min: 0 } : {}}
                                        onInput={field === "quantity" ? (e) => {
                                            e.target.value = Math.abs(e.target.value);
                                        } : undefined}
                                    />
                                ))}
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={6}>
                                {["purchase_date", "price", "status"].map((field) => (
                                    <TextField
                                        key={field}
                                        margin="dense"
                                        label={field.replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase())}
                                        fullWidth
                                        variant="outlined"
                                        name={field}
                                        value={newEquipment[field] || ""}
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
                                        inputProps={
                                            field === "purchase_date"
                                                ? { max: new Date().toISOString().split('T')[0] }
                                                : field === "price"
                                                    ? { min: 0 }
                                                    : {}
                                        }
                                        onInput={field === "price" ? (e) => {
                                            e.target.value = Math.abs(e.target.value);
                                        } : undefined}
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
                        <Button
                            onClick={selectedEquipment ? handleUpdateEquipment : handleAddEquipment}
                            color="primary"
                        >
                            {selectedEquipment ? "Update Equipment" : "Add Equipment"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Item Management Dialog */}
                <Dialog open={itemManagementDialog} onClose={() => !itemLoading && setItemManagementDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Manage Equipment Item</DialogTitle>
                    <DialogContent>
                        {itemLoading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                                {selectedItem && (
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Equipment:</strong> {selectedItem.equipment_name}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Item ID:</strong> {selectedItem.variant_id}
                                            </Typography>

                                            <FormControl fullWidth sx={{ mb: 2 }}>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={selectedItem.status}
                                                    label="Status"
                                                    onChange={(e) => setSelectedItem({...selectedItem, status: e.target.value})}
                                                >
                                                    <MenuItem value="Available">Available</MenuItem>
                                                    <MenuItem value="In Use">In Use</MenuItem>
                                                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleDeleteItem}
                            color="error"
                            disabled={itemLoading}
                            startIcon={<DeleteIcon />}
                            sx={{ marginRight: 'auto' }}
                        >
                            Delete Item
                        </Button>
                        <Button
                            onClick={() => setItemManagementDialog(false)}
                            color="primary"
                            disabled={itemLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveItemChanges}
                            color="primary"
                            disabled={itemLoading}
                        >
                            {itemLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default ManageEquipments;
