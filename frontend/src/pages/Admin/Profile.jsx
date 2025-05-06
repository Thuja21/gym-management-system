import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import { Plus, Search, Edit as EditIcon, Trash as DeleteIcon, ChevronDown, ChevronRight } from "lucide-react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, IconButton, Grid, MenuItem, Select, InputLabel, FormControl, Collapse, Box,
    CircularProgress, Alert, InputAdornment
} from "@mui/material";

const ManageEquipments = () => {
    // ... (keep all your existing state declarations)

    // Fetch item details when manage button is clicked
    const handleOpenItemManagement = async (item) => {
        try {
            setItemLoading(true);
            // Call your backend API to get the specific item details
            const response = await fetch(`http://localhost:8800/api/equipment-items/${item.variant_db_id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch item details");
            }
            const data = await response.json();

            setSelectedItem({
                ...data.data,  // Assuming your API returns { success: true, data: {...} }
                variant_id: item.variant_id,  // Keep the frontend ID
                purchase_date: data.data.purchase_date.split('T')[0]  // Format date for date input
            });
            setItemManagementDialog(true);
        } catch (err) {
            setError(err.message);
            alert(`Error loading item: ${err.message}`);
        } finally {
            setItemLoading(false);
        }
    };

    // Save changes to the item
    const handleSaveItemChanges = async () => {
        if (!selectedItem) return;

        try {
            setItemLoading(true);

            // Prepare the update data
            const updateData = {
                brand: selectedItem.brand,
                purchase_date: selectedItem.purchase_date,
                price: selectedItem.price,
                status: selectedItem.status
            };

            // Call your backend API to update the item
            const response = await fetch(`http://localhost:8800/api/equipment-items/${selectedItem.variant_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update item");
            }

            // Update local state
            const updatedItems = equipmentItems.map(item =>
                item.variant_id === selectedItem.variant_id ? { ...item, ...updateData } : item
            );

            const updatedEquipments = equipments.map(equipment => {
                if (equipment.equipment_id === selectedItem.equipment_id) {
                    const updatedVariants = equipment.variants.map(variant => {
                        if (variant.variant_id.toString() === selectedItem.variant_id.toString()) {
                            return { ...variant, ...updateData };
                        }
                        return variant;
                    });
                    return { ...equipment, variants: updatedVariants };
                }
                return equipment;
            });

            setEquipmentItems(updatedItems);
            setEquipments(updatedEquipments);

            alert("Item updated successfully!");
            setItemManagementDialog(false);
        } catch (err) {
            setError(err.message);
            alert(`Error updating item: ${err.message}`);
        } finally {
            setItemLoading(false);
        }
    };

    // ... (keep all your other existing functions)

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            {/* ... (keep all your existing JSX until the Item Management Dialog) */}

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

                                        <TextField
                                            margin="dense"
                                            label="Brand"
                                            fullWidth
                                            variant="outlined"
                                            value={selectedItem.brand || ""}
                                            onChange={(e) => setSelectedItem({...selectedItem, brand: e.target.value})}
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="Purchase Date"
                                            fullWidth
                                            variant="outlined"
                                            type="date"
                                            value={selectedItem.purchase_date || ""}
                                            onChange={(e) => setSelectedItem({...selectedItem, purchase_date: e.target.value})}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="Price"
                                            fullWidth
                                            variant="outlined"
                                            type="number"
                                            value={selectedItem.price || ""}
                                            onChange={(e) => setSelectedItem({...selectedItem, price: e.target.value})}
                                            sx={{ mb: 2 }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                            }}
                                        />

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
    );
};

export default ManageEquipments;