import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import { Plus, Search, Trash as DeleteIcon, ChevronRight } from "lucide-react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog,
    DialogActions, DialogContent, DialogTitle, TextField, IconButton, Grid, MenuItem, Select, InputLabel,
    FormControl, Collapse, Box, CircularProgress, Alert
} from "@mui/material";

// Styles
const styles = {
    tableHeader: { backgroundColor: "#f0f4f8", color: "#334155", fontWeight: "600", borderBottom: "2px solid #e2e8f0", fontSize: "0.9rem", padding: "16px" },
    tableContainer: {height: "calc(100vh - 230px)", width: "calc(100vw - 305px)", marginLeft: "13px", boxShadow: "none", borderRadius: "12px", overflow: "auto"},
        // "&::-webkit-scrollbar": { width: "8px", height: "8px" },
        // "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
        // "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: "4px" },
        // "&::-webkit-scrollbar-thumb:hover": { background: "#a8a8a8" }
    // },
    formField: {
        marginBottom: "16px",
        "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            "&:hover fieldset": { borderColor: "#438cd5" },
            "&.Mui-focused fieldset": { borderColor: "#3b72cf" }
        },
        // "& .MuiInputLabel-root.Mui-focused": { color: "#7f1d1d" }
    },
    dialogTitle: { backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#1e293b", fontWeight: "600" },
    itemDialogTitle: { backgroundColor: "#f0f9ff", borderBottom: "1px solid #bae6fd", color: "#0c4a6e", fontWeight: "600" },
    dialogActions: { padding: "16px 24px", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" },
    itemDialogActions: { padding: "16px 24px", borderTop: "1px solid #bae6fd", backgroundColor: "#f0f9ff" },
    cancelBtn: { color: "#64748b", "&:hover": { backgroundColor: "#f1f5f9" } },
    primaryBtn: { backgroundColor: "#7f1d1d", color: "white", "&:hover": { backgroundColor: "#991b1b" } },
    blueBtn: { backgroundColor: "#0284c7", color: "white", "&:hover": { backgroundColor: "#0369a1" } },
    deleteBtn: {
        color: "#e11d48", borderColor: "#e11d48", "&:hover": { backgroundColor: "#fef2f2", borderColor: "#be123c" }, marginRight: "auto"
    }
};

// Status badge helper
const getStatusBadgeClass = (status) =>
    `px-3 py-1 rounded-full text-xs font-medium ${
        status === 'Available' ? 'bg-green-100 text-green-800' :
            status === 'In Use' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
    }`;

const ManageEquipments = () => {
    const [equipments, setEquipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [itemManagementDialog, setItemManagementDialog] = useState(false);
    const [newEquipment, setNewEquipment] = useState({
        equipment_name: "", category: "", brand: "", quantity: 1, purchase_date: "", price: "", status: "Available"
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

    // Fetch equipments
    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/equipments/all");
                if (!response.ok) throw new Error("Failed to fetch equipments.");
                const data = await response.json();

                // Group by equipment_id
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
                        const itemId = `${variant.variant_id}`;
                        const existingItem = equipmentItems.find(item => item.variant_id === itemId);
                        items.push({
                            variant_id: itemId,
                            equipment_id: variant.equipment_id,
                            equipment_name: variant.equipment_name,
                            brand: variant.brand,
                            serial_number: `SN-${variant.brand.substring(0, 3)}-${variant.equipment_id}${i}`,
                            purchase_date: variant.purchase_date,
                            price: variant.price,
                            status: existingItem ? existingItem.status : variant.status
                        });
                    }
                });
                setEquipmentItems(items);
            }
        }
    }, [expandedEquipment, equipments]);

    // Calculate filtered counts
    useEffect(() => {
        if (statusFilter === "all") {
            const totalCounts = {};
            equipments.forEach(equipment => {
                totalCounts[equipment.equipment_id] = equipment.total_quantity;
            });
            setFilteredCounts(totalCounts);
        } else {
            const counts = {};
            equipments.forEach(equipment => {
                if (expandedEquipment === equipment.equipment_id) {
                    const filteredItems = equipmentItems.filter(item => item.status === statusFilter);
                    counts[equipment.equipment_id] = filteredItems.length;
                } else {
                    let count = 0;
                    equipment.variants.forEach(variant => {
                        if (variant.status === statusFilter) count += variant.quantity;
                    });
                    counts[equipment.equipment_id] = count;
                }
            });
            setFilteredCounts(counts);
        }
    }, [statusFilter, equipments, equipmentItems, expandedEquipment]);

    // Form validation
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

    // Input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEquipment(prev => ({ ...prev, [name]: value }));
    };

    // Add equipment handler
    const handleAddEquipment = async () => {
        if (!validateForm()) return;

        try {
            const equipmentData = {
                equipment_id: parseInt(newEquipment.equipment_id),//
                equipment_name: newEquipment.equipment_name.trim(),
                category: newEquipment.category.trim(),
                brand: newEquipment.brand.trim(),
                quantity: parseInt(newEquipment.quantity),
                purchase_date: new Date(newEquipment.purchase_date).toISOString().split('T')[0],
                price: parseFloat(newEquipment.price),
                status: newEquipment.status
            };

            if (isNaN(equipmentData.quantity) || equipmentData.quantity <= 0)
                throw new Error("Quantity must be a positive number");
            if (isNaN(equipmentData.price) || equipmentData.price <= 0)
                throw new Error("Price must be a positive number");

            const response = await fetch("http://localhost:8800/api/equipments/add", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(equipmentData)
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || "Failed to add equipment");

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

            setNewEquipment({
                equipment_name: "", category: "", brand: "", quantity: 1, purchase_date: "", price: "", status: "Available"
            });
            setOpenDialog(false);
            alert("Equipment added successfully!");
        } catch (err) {
            console.error("Add equipment error:", err);
            alert(err.message || "Failed to add equipment");
            setError(err.message);
        }
    };

    // Toggle expand handler
    const handleToggleExpand = (equipmentId) => {
        setExpandedEquipment(expandedEquipment === equipmentId ? null : equipmentId);
    };

    // Update equipment handler
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
            setOpenDialog(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete equipment handler
    const handleDelete = async (equipmentId) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
            try {
                const response = await fetch(`http://localhost:8800/api/equipments/delete/${equipmentId}`, {
                    method: "DELETE",
                    headers: { "Accept": "application/json" }
                });

                if (!response.ok) throw new Error("Failed to delete equipment");
                setEquipments(prev => prev.filter(equipment => equipment.equipment_id !== equipmentId));
                alert("Equipment deleted successfully!");
            } catch (err) {
                console.error("Delete equipment error:", err);
                alert(err.message || "Failed to delete equipment");
            }
        }
    };

    // Open item management dialog
    const handleOpenItemManagement = (itemId) => {
        const itemToManage = equipmentItems.find((item) => item.variant_id === itemId);
        if (!itemToManage) {
            console.error("Error: Equipment item not found.");
            return;
        }
        setSelectedItem({ ...itemToManage });
        setItemManagementDialog(true);
    };

    // Save item changes handler
    const handleSaveItemChanges = async () => {
        if (!selectedItem) return;

        try {
            const response = await fetch(`http://localhost:8800/api/equipments/edit/${selectedItem.variant_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ status: selectedItem.status })
            });

            if (!response.ok) throw new Error("Failed to update status in backend.");

            const updatedItems = equipmentItems.map(item =>
                item.variant_id === selectedItem.variant_id ? { ...item, ...selectedItem } : item
            );

            const updatedEquipments = equipments.map(equipment => {
                if (equipment.equipment_id === selectedItem.equipment_id) {
                    const updatedVariants = equipment.variants.map(variant => {
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
                    return { ...equipment, variants: updatedVariants };
                }
                return equipment;
            });

            setEquipmentItems(updatedItems);
            setEquipments(updatedEquipments);

            if (statusFilter !== "all") {
                const newFilteredCounts = { ...filteredCounts };
                const equipmentId = selectedItem.equipment_id;
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

    // Delete item handler
    const handleDeleteItem = async () => {
        if (!selectedItem) return;

        if (window.confirm(`Are you sure you want to delete this ${selectedItem.equipment_name} item?`)) {
            try {
                setItemLoading(true);
                const response = await fetch(`http://localhost:8800/api/equipments/delete-item/${selectedItem.variant_id}`, {
                    method: "DELETE",
                    headers: { "Accept": "application/json" }
                });

                if (!response.ok) throw new Error("Failed to delete item");

                const updatedItems = equipmentItems.filter(item => item.variant_id !== selectedItem.variant_id);
                setEquipmentItems(updatedItems);

                const updatedEquipments = equipments.map(equipment => {
                    if (equipment.equipment_id === selectedItem.equipment_id) {
                        return { ...equipment, total_quantity: equipment.total_quantity - 1 };
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

    // Filter equipments
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

    // Render form fields
    const renderTextField = (field) => (
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
                field === "purchase_date" ? "date" :
                    field === "price" || field === "quantity" ? "number" : "text"
            }
            InputLabelProps={field === "purchase_date" ? { shrink: true } : {}}
            select={field === "status"}
            inputProps={
                field === "purchase_date" ? { max: new Date().toISOString().split('T')[0] } :
                    field === "price" || field === "quantity" ? { min: 0 } : {}
            }
            onInput={
                field === "price" || field === "quantity"
                    ? (e) => { e.target.value = Math.abs(e.target.value) }
                    : undefined
            }
            sx={styles.formField}
        >
            {field === "status" && ["Available", "In Use", "Under Maintenance"].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </TextField>
    );

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>GYM EQUIPMENTS</Typography>

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
                            <div className="ml-4 mt-[15px]">
                                <FormControl variant="outlined" size="small" style={{ minWidth: 180 }}>
                                    <InputLabel>Filter by Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        label="Filter by Status"
                                        className="h-[40px]"
                                        sx={styles.formField}
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
                                <button className="bg-red-900 text-white w-44 rounded-lg flex items-center shadow-md hover:bg-red-800 transition h-[40px] "
                                        onClick={() => {
                                            setNewEquipment({
                                                equipment_name: "", category: "", brand: "", quantity: 1,
                                                purchase_date: "", price: "", status: "Available"
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
                    <Paper elevation={3} className="rounded-lg overflow-hidden">
                        <TableContainer component={Paper} sx={styles.tableContainer}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={styles.tableHeader}>ID</TableCell>
                                        <TableCell align="center" sx={styles.tableHeader}>Equipment Name</TableCell>
                                        <TableCell align="center" sx={styles.tableHeader}>Category</TableCell>
                                        <TableCell align="center" sx={styles.tableHeader}>
                                            {statusFilter === "all" ? "Total Quantity" : `${statusFilter} Quantity`}
                                        </TableCell>
                                        <TableCell align="center" sx={styles.tableHeader}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredEquipments.map((equipment, index) => (
                                        <React.Fragment key={equipment.equipment_id}>
                                            <TableRow
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                                                    transition: "background-color 0.2s",
                                                    "&:hover": { backgroundColor: "#f1f5f9" },
                                                    borderLeft: expandedEquipment === equipment.equipment_id
                                                        ? "4px solid #7f1d1d" : "4px solid transparent",
                                                }}
                                            >
                                                <TableCell align="center" sx={{ padding: "12px 16px" }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleToggleExpand(equipment.equipment_id)}
                                                        sx={{
                                                            color: expandedEquipment === equipment.equipment_id ? "#7f1d1d" : "#64748b",
                                                            transition: "transform 0.2s",
                                                            transform: expandedEquipment === equipment.equipment_id ? "rotate(90deg)" : "rotate(0deg)",
                                                        }}
                                                    >
                                                        <ChevronRight size={18} />
                                                    </IconButton>
                                                    <span className="ml-2 font-medium">{equipment.equipment_id}</span>
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        padding: "12px 16px",
                                                        fontWeight: expandedEquipment === equipment.equipment_id ? "600" : "normal",
                                                        color: expandedEquipment === equipment.equipment_id ? "#1e293b" : "#334155",
                                                    }}
                                                >
                                                    {equipment.equipment_name}
                                                </TableCell>
                                                <TableCell align="center" sx={{ padding: "12px 16px", color: "#475569" }}>
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                        {equipment.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center" sx={{ padding: "12px 16px", fontWeight: "500" }}>
                                                    {statusFilter === "all"
                                                        ? equipment.total_quantity
                                                        : filteredCounts[equipment.equipment_id] || 0}
                                                </TableCell>
                                                <TableCell align="center" sx={{ padding: "12px 16px" }}>
                                                    <IconButton
                                                        sx={{
                                                            color: "#e11d48",
                                                            "&:hover": { backgroundColor: "#fee2e2" },
                                                        }}
                                                        onClick={() => handleDelete(equipment.equipment_id)}
                                                    >
                                                        <DeleteIcon size={18} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>

                                            {/* Expanded view - Individual Items */}
                                            {expandedEquipment === equipment.equipment_id && (
                                                <TableRow>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                                        <Collapse in={true} timeout="auto" unmountOnExit>
                                                            <Box sx={{
                                                                margin: 2, backgroundColor: "#f8fafc", borderRadius: "8px",
                                                                border: "1px solid #e2e8f0", overflow: "hidden",
                                                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                                            }}>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        fontWeight: "600", padding: "12px 16px",
                                                                        backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0",
                                                                        color: "#334155"
                                                                    }}
                                                                >
                                                                    Individual Items
                                                                </Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                                                            {["Item ID", "Brand", "Purchase Date", "Price", "Status", "Actions"].map(header => (
                                                                                <TableCell
                                                                                    key={header}
                                                                                    align="center"
                                                                                    sx={{
                                                                                        fontWeight: "600", color: "#475569",
                                                                                        borderBottom: "1px solid #e2e8f0", fontSize: "0.8rem"
                                                                                    }}
                                                                                >
                                                                                    {header}
                                                                                </TableCell>
                                                                            ))}
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {equipmentItems
                                                                            .filter(item => statusFilter === "all" || item.status === statusFilter)
                                                                            .map((item, idx) => {
                                                                                const purchaseDate = new Date(item.purchase_date);
                                                                                const isFutureDate = purchaseDate > new Date();

                                                                                return (
                                                                                    <TableRow
                                                                                        key={item.variant_id}
                                                                                        sx={{
                                                                                            backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                                                                                            "&:hover": { backgroundColor: "#f1f5f9" },
                                                                                        }}
                                                                                    >
                                                                                        <TableCell align="center" sx={{ padding: "8px", fontSize: "0.8rem", color: "#334155" }}>
                                                                                            {item.variant_id}
                                                                                        </TableCell>
                                                                                        <TableCell align="center" sx={{ padding: "8px", fontSize: "0.8rem", color: "#334155", fontWeight: "500" }}>
                                                                                            {item.brand}
                                                                                        </TableCell>
                                                                                        <TableCell align="center" sx={{ padding: "8px", fontSize: "0.8rem", color: isFutureDate ? "#e11d48" : "#334155" }}>
                                                                                            {new Date(item.purchase_date).toLocaleDateString()}
                                                                                            {isFutureDate && <span className="ml-2 text-xs text-red-600">(Future date)</span>}
                                                                                        </TableCell>
                                                                                        <TableCell align="center" sx={{ padding: "8px", fontSize: "0.8rem", color: "#334155" }}>
                                                                                            Rs.{item.price.toLocaleString()}
                                                                                        </TableCell>
                                                                                        <TableCell align="center" sx={{ padding: "8px" }}>
                                                                                            <span className={getStatusBadgeClass(item.status)}>
                                                                                                {item.status}
                                                                                            </span>
                                                                                        </TableCell>
                                                                                        <TableCell align="center" sx={{ padding: "8px" }}>
                                                                                            <button
                                                                                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                                                                                onClick={() => handleOpenItemManagement(item.variant_id)}
                                                                                            >
                                                                                                Manage
                                                                                            </button>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                );
                                                                            })}
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
                    </Paper>
                )}

                {/* Add Equipment Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    fullWidth
                    maxWidth="md"
                    PaperProps={{ sx: { borderRadius: "8px", overflow: "hidden" } }}
                >
                    <DialogTitle sx={styles.dialogTitle}>
                        {selectedEquipment ? "Edit Equipment" : "Add New Equipment"}
                    </DialogTitle>
                    <DialogContent sx={{ padding: "24px 20px" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                {["equipment_name", "category", "brand", "quantity"].map(renderTextField)}
                            </Grid>
                            <Grid item xs={6}>
                                {["purchase_date", "price", "status"].map(renderTextField)}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={styles.dialogActions}>
                        <Button onClick={() => setOpenDialog(false)} sx={styles.cancelBtn}>Cancel</Button>
                        <Button
                            onClick={selectedEquipment ? handleUpdateEquipment : handleAddEquipment}
                            sx={styles.primaryBtn}
                        >
                            {selectedEquipment ? "Update Equipment" : "Add Equipment"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Item Management Dialog */}
                <Dialog
                    open={itemManagementDialog}
                    onClose={() => !itemLoading && setItemManagementDialog(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{ sx: { borderRadius: "8px", overflow: "hidden" } }}
                >
                    <DialogTitle sx={styles.itemDialogTitle}>Manage Equipment Item</DialogTitle>
                    <DialogContent sx={{ padding: "24px 20px" }}>
                        {itemLoading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress sx={{ color: "#7f1d1d" }} />
                            </Box>
                        ) : (
                            <>
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                {selectedItem && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box sx={{
                                                backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px",
                                                marginBottom: "16px", border: "1px solid #e2e8f0"
                                            }}>
                                                <Typography variant="subtitle1" sx={{ color: "#334155", marginBottom: "8px" }}>
                                                    <strong>Equipment:</strong> {selectedItem.equipment_name}
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ color: "#334155" }}>
                                                    <strong>Item ID:</strong> {selectedItem.variant_id}
                                                </Typography>
                                            </Box>

                                            <FormControl fullWidth sx={{
                                                marginTop: "16px",
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "6px",
                                                    "&:hover fieldset": { borderColor: "#0284c7" },
                                                    "&.Mui-focused fieldset": { borderColor: "#0284c7" }
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": { color: "#0284c7" }
                                            }}>
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
                    <DialogActions sx={styles.itemDialogActions}>
                        <Button
                            onClick={handleDeleteItem}
                            sx={styles.deleteBtn}
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            disabled={itemLoading}
                        >
                            Delete Item
                        </Button>
                        <Button
                            onClick={() => setItemManagementDialog(false)}
                            sx={styles.cancelBtn}
                            disabled={itemLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveItemChanges}
                            sx={styles.blueBtn}
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
