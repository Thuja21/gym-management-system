import React, {useState, useEffect, useRef} from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import {Edit as EditIcon, Plus, Search, Trash as DeleteIcon} from "lucide-react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, Paper, Table, TableBody,
    TableContainer, TableHead, TableRow, TextField, Typography, Box
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const ManageSupplements = () => {
    const [supplements, setSupplements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [newSupplement, setNewSupplement] = useState({supplement_name: "", description: "", price: "", quantity_in_stock: "", expiry_date: "", category: "", image_url: "", size: "", brand: ""});
    const [selectedSupplement, setSelectedSupplement] = useState(null); // State for the selected plan for editing
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null)
    const [categories, setCategories] = useState([]);
    const [customCategory, setCustomCategory] = useState('');
    const [sortField, setSortField] = useState(""); // Field to sort by, e.g., "expiry_date" or "quantity_in_stock"
    const [sortOrder, setSortOrder] = useState(""); // "" for no sort, "asc" for ascending, "desc" for descending


    // // Filter supplements based on search term
    // const filteredSupplements = supplements.filter((supplement) => {
    //     if (!searchTerm) return true;
    //
    //     const searchTermLower = searchTerm.toLowerCase();
    //
    //     return (
    //         supplement.supplement_name?.toLowerCase().includes(searchTermLower) ||
    //         supplement.description?.toLowerCase().includes(searchTermLower) ||
    //         supplement.category?.toLowerCase().includes(searchTermLower) ||
    //         supplement.brand?.toLowerCase().includes(searchTermLower) ||
    //         supplement.size?.toLowerCase().includes(searchTermLower) ||
    //         String(supplement.price).includes(searchTerm) ||
    //         String(supplement.supplement_id).includes(searchTerm)
    //     );
    // });

    const filteredSupplements = supplements
        .filter((supplement) => {
            if (!searchTerm) return true;
            const searchTermLower = searchTerm.toLowerCase();
            return (
                supplement.supplement_name?.toLowerCase().includes(searchTermLower) ||
                supplement.category?.toLowerCase().includes(searchTermLower) ||
                supplement.brand?.toLowerCase().includes(searchTermLower) ||
                String(supplement.supplement_id).includes(searchTerm)
            );
        })
        .sort((a, b) => {
            if (!sortField || !sortOrder) return 0; // No sorting if either is empty
            if (sortField === "expiry_date") {
                const dateA = new Date(a.expiry_date);
                const dateB = new Date(b.expiry_date);
                // Handle invalid dates
                if (isNaN(dateA) && isNaN(dateB)) return 0;
                if (isNaN(dateA)) return sortOrder === "asc" ? 1 : -1;
                if (isNaN(dateB)) return sortOrder === "asc" ? -1 : 1;
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            } else if (sortField === "quantity_in_stock") {
                return sortOrder === "asc"
                    ? a.quantity_in_stock - b.quantity_in_stock
                    : b.quantity_in_stock - a.quantity_in_stock;
            }
            return 0;
        });



    // Clear search function
    const clearSearch = () => {
        setSearchTerm("");
    };

    // Fetch supplements from backend
    useEffect(() => {
        const fetchSupplements = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/supplements/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch supplements.");
                }
                const data = await response.json();
                console.log("Fetched supplements:", data);
                setSupplements(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSupplements();
    }, [loading]);

    useEffect(() => {
        fetch('http://localhost:8800/api/supplements/categories') // Replace with your actual endpoint
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Handle form input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSupplement((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSelectedSupplement((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    // Handle Edit button click for supplements
    const handleEdit = (supplementId) => {
        const supplementToEdit = supplements.find((supplement) => supplement.supplement_id === supplementId);
        if (!supplementToEdit) {
            console.error("Error: Supplement not found.");
            return;
        }
        console.log("Editing Supplement:", supplementToEdit);
        setSelectedSupplement({ ...supplementToEdit }); // Ensure a fresh state copy
        setEditDialogOpen(true);
    };

    // Function to handle saving changes
    const handleSaveChanges = async () => {
        try {
            let response;
            // If the user selected a new image (image is a File object)
            if (image) {
                const formData = new FormData();
                // Append all fields except image_url (will be set by backend)
                Object.entries(selectedSupplement).forEach(([key, value]) => {
                    if (key !== "image_url") {
                        formData.append(key, value);
                    }
                });
                formData.append("image", image); // Field name must match backend

                response = await fetch(`http://localhost:8800/api/supplements/edit/${selectedSupplement.supplement_id}`, {
                    method: "PUT",
                    body: formData, // Do NOT set Content-Type, browser will handle it
                });
            } else {
                // No new image, just send JSON
                response = await fetch(`http://localhost:8800/api/supplements/edit/${selectedSupplement.supplement_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedSupplement),
                });
            }

            if (!response.ok) throw new Error(`Failed to update supplement: ${response.statusText}`);
            const updatedSupplement = await response.json();

            setSupplements((prevSupplements) =>
                prevSupplements.map((supplement) =>
                    supplement.supplement_id === selectedSupplement.supplement_id
                        ? updatedSupplement
                        : supplement
                )
            );
            setEditDialogOpen(false);
            setImage(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error("Error updating supplement:", error);
        }
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



    useEffect(() => {
        const savedImageUrl = localStorage.getItem("imageUrl");
        if (savedImageUrl) {
            setImageUrl(savedImageUrl);
        }
    }, []);

    const handleFileChange = (e) => {
        const selectedImage = e.target.files[0];
        setPreviewUrl(URL.createObjectURL(selectedImage));
        setImage(selectedImage);
    };

    const handleUpload = async () => {
        if (!image || !newSupplement.supplement_name || !newSupplement.description || !newSupplement.price || !newSupplement.quantity_in_stock || !newSupplement.expiry_date || !newSupplement.category ||  !newSupplement.size || !newSupplement.brand) {
            alert("Please fill all fields and select an image.");
            return;
        }

        if (newSupplement.category === 'Other' && !customCategory) {
            alert("Please specify a custom category.");
            return;
        }
        const formData = new FormData();
        formData.append("image", image);

        const supplementToUpload = {...newSupplement};

        if (supplementToUpload.category === 'Other') {
            supplementToUpload.category = customCategory;
        }

        Object.entries(newSupplement).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await fetch("http://localhost:8800/addSupplement", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const uploadedImageUrl = `http://localhost:8800${data.url}`;

            setImageUrl(uploadedImageUrl);
            localStorage.setItem("imageUrl", uploadedImageUrl);

            const newSupplementData = {
                ...newSupplement,
                supplement_id: data.supplement_id, // assuming server returns it
                image_url: uploadedImageUrl
            };

            setSupplements(prev => [...prev, newSupplementData]);

            setNewSupplement({
                supplement_name: "",
                description: "",
                price: "",
                quantity_in_stock: "",
                expiry_date: "",
                category: "",
                size: "",
                brand: ""
            });

            // Reset the image preview and file input
            setPreviewUrl(null);
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            setCustomCategory('');

            alert("Supplement added successfully!");
            setOpenDialog(false);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    function formatDateForInput(dateString) {
        if (!dateString) return "";
        // Handles both ISO and already-formatted dates
        const d = new Date(dateString);
        if (isNaN(d)) return "";
        // Get YYYY-MM-DD
        return d.toISOString().slice(0, 10);
    }

    return (
        <div  className="bg-gray-100" style={{ display: "flex", height: "100vh" ,paddingRight: "30px" }}>
            <AdminSideBar/>
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh",  width:"1300px" ,overflowY: "auto" , marginLeft: "-45px", marginTop: "10px" }}>
                {/* <TopBar /> */}
                <Typography variant="h4" gutterBottom>
                    GYM SUPPLEMENTS
                </Typography>

                <Paper elevation={1} className="p-4 mb-6 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl">
                        <div className="relative flex-1" >
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search supplements..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={clearSearch}
                                >
                                    <CloseIcon fontSize="small" />
                                </button>
                            )}
                        </div>

                        {/* Search results count */}
                        {searchTerm && (
                            <div className="text-sm text-gray-500">
                                Found {filteredSupplements.length} of {supplements.length} supplements
                            </div>
                        )}


                        {/* Sort by Expiry Date Dropdown */}
                        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
                            <InputLabel>Sort by Expiry Date</InputLabel>
                            <Select
                                value={sortField === "expiry_date" ? sortOrder : ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSortField(value ? "expiry_date" : "");
                                    setSortOrder(value);
                                }}
                                label="Sort by Expiry Date"
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="asc">Ascending (Earliest First)</MenuItem>
                                <MenuItem value="desc">Descending (Latest First)</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Sort by Stock Quantity Dropdown */}
                        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
                            <InputLabel>Sort by Stock Quantity</InputLabel>
                            <Select
                                value={sortField === "quantity_in_stock" ? sortOrder : ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSortField(value ? "quantity_in_stock" : "");
                                    setSortOrder(value);
                                }}
                                label="Sort by Stock Quantity"
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="asc">Ascending (Lowest First)</MenuItem>
                                <MenuItem value="desc">Descending (Highest First)</MenuItem>
                            </Select>
                        </FormControl>

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
                </Paper>

                {loading && <Typography>Loading supplements...</Typography>}
                {error && <Typography color="error">{error}</Typography>}


                <Paper elevation={1} className="mb-6 rounded-lg">
                    <div className="bg-white rounded-xl  overflow-x-auto" >
                        <TableContainer
                            component={Paper} className="table-container"
                            sx={{height: "calc(100vh - 240px)",
                                width:"calc(100vw - 305px)",
                                marginLeft: "13px",
                                scrollbarWidth: "none", // Hide scrollbar for Firefox
                                "&::-webkit-scrollbar": {
                                    display: "none", // Hide scrollbar for Webkit-based browsers (Chrome, Edge, etc.)
                                },}}
                        >
                            <Table className="w-full border-collapse">
                                <TableHead style={{ position: "sticky", top: 0,zIndex: 10 }}>
                                    <TableRow className="bg-gray-200  text-blue-950 text-xs font-medium uppercase tracking-wider text-center">
                                        <th className="px-1 py-1 text-center">ID</th>
                                        <th className="px-3 py-3">Image</th>
                                        <th className="px-6 py-3">Supplement Name</th>
                                        <th className="px-16 py-3">Description</th>
                                        <th className="px-2 py-3">Category</th>
                                        <th className="px-6 py-3">Brand</th>
                                        <th className="px-6 py-3">Size</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-2 py-3">Expiry Date</th>
                                        <th className="px-2 py-3">Stock Quantity</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-gray-200">
                                    {filteredSupplements.length > 0 ? (
                                        filteredSupplements.map((supplement, index) => (
                                            <TableRow
                                                key={supplement.supplement_id} className="table-row text-[14px]"
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff", // Alternate row colors
                                                    "&:hover": {
                                                        backgroundColor: "#e0e0e0", // Highlight on hover
                                                    },
                                                }}
                                            >
                                                <td className="px-3 py-1 text-center ">{supplement.supplement_id}</td>
                                                <td className="px-3 py-1 text-center">
                                                    <img
                                                        src={
                                                            supplement.image_url && supplement.image_url.startsWith('http')
                                                                ? supplement.image_url  // External URL
                                                                : `http://localhost:8800${supplement.image_url || ''}` // Local image path or fallback
                                                        }
                                                        alt={supplement.supplement_name}
                                                        className="h-12 w-12 object-cover rounded-md"
                                                    />
                                                </td>
                                                <td className="px-6 py-1 text-center text-[13px] font-medium">{supplement.supplement_name}</td>
                                                <td className="px-6 py-1 text-center">
                                                    {supplement.description ? supplement.description.split(" ").slice(0, 5).join(" ") + "..." : "N/A"}
                                                </td>
                                                <td className="px-2 py-1 text-center">{supplement.category}</td>
                                                <td className="px-6 py-1 text-center">{supplement.brand}</td>
                                                <td className="px-6 py-1 text-center">{supplement.size}</td>
                                                <td className="px-6 py-1 text-center">Rs.{supplement.price}</td>
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
                                        ))
                                    ) : (
                                        <TableRow>
                                            <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                                                {searchTerm ? (
                                                    <div className="flex flex-col items-center">
                                                        <Search className="w-8 h-8 mb-2 text-gray-400" />
                                                        <p>No supplements found matching "{searchTerm}"</p>
                                                        <button
                                                            className="mt-2 text-red-800 hover:text-red-900 underline"
                                                            onClick={clearSearch}
                                                        >
                                                            Clear search
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p>No supplements available.</p>
                                                )}
                                            </td>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </div>
                </Paper>

            </div>

            {/* Add Supplement Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    // Reset the image preview when closing the dialog
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Add New Supplement</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* Left Column */}
                        <Grid item xs={6}>
                            {["supplement_name", "description", "brand", "size"].map((field) => (
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
                                    type={field === "price" ? "number" : "text"}
                                />
                            ))}
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={6}>
                            {/* Fields other than category */}
                            {["expiry_date", "price", "quantity_in_stock"].map((field) => (
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
                                    type={field === "expiry_date" ? "date" : "number"}
                                    InputLabelProps={field === "expiry_date" ? { shrink: true } : {}}
                                    inputProps={
                                        field === "expiry_date"
                                            ? { min: new Date().toISOString().split("T")[0] }
                                            : { min: 0 }
                                    }
                                />
                            ))}

                            {/* Category field with dropdown and custom input */}
                            <FormControl fullWidth margin="dense" variant="outlined" error={!!errors['category']}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category-select"
                                    name="category"
                                    value={newSupplement.category || ''}
                                    onChange={handleInputChange}
                                    label="Category"
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.supplement_id} value={cat.category}>
                                            {cat.category}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>

                            {newSupplement.category === 'Other' && (
                                <TextField
                                    margin="dense"
                                    label="Specify Category"
                                    name="customCategory"
                                    value={customCategory}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCustomCategory(value);
                                        setNewSupplement(prev => ({
                                            ...prev,
                                            category: value
                                        }));
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    error={!!errors['customCategory']}
                                    helperText={errors['customCategory']}
                                />
                            )}
                        </Grid>



                        {/* Image Upload Box - Improved UI */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box
                                sx={{
                                    border: '2px dashed #ccc',
                                    borderRadius: '8px',
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: '#1976d2',
                                        backgroundColor: '#f0f7ff'
                                    }
                                }}
                            >
                                <Typography variant="h6" gutterBottom>Product Image</Typography>

                                {!previewUrl ? (
                                    <>
                                        <Box sx={{ mb: 2 }}>
                                            <CloudUploadIcon sx={{ fontSize: 60, color: '#9e9e9e' }} />
                                        </Box>
                                        <Typography variant="body1" gutterBottom>
                                            Drag and drop an image here, or click to select a file
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            Recommended: 800x800px, JPG or PNG, max 5MB
                                        </Typography>
                                    </>
                                ) : (
                                    <Box sx={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: -12,
                                                right: -12,
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#d32f2f'
                                                },
                                                padding: '4px'
                                            }}
                                            onClick={() => {
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                                setPreviewUrl(null);
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                                <Button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 text-white rounded-lg hover:bg-red-800 transition-colors mt"
                                    sx={{ mt: 2, backgroundColor: '#9CA3AF' }}
                                    startIcon={<PhotoCameraIcon />}
                                >
                                    {previewUrl ? 'Change Image' : 'Select Image'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => {
                            setOpenDialog(false);
                            // Reset the image preview when canceling
                            setPreviewUrl(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        color="inherit"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <button
                        type="button"
                        onClick={() => { handleUpload(); }}
                        className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
                    >
                        Add Supplement
                    </button>
                </DialogActions>
            </Dialog>



            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Edit Supplement</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* Left Column */}
                        <Grid item xs={6}>
                            {["supplement_name", "description", "brand", "size"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={selectedSupplement?.[field] || ""}
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                />
                            ))}
                        </Grid>
                        {/* Right Column */}
                        <Grid item xs={6}>
                            {["expiry_date", "price", "quantity_in_stock"].map((field) => (
                                <TextField
                                    key={field}
                                    margin="dense"
                                    label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                                    fullWidth
                                    variant="outlined"
                                    name={field}
                                    value={
                                        field === "expiry_date"
                                            ? formatDateForInput(selectedSupplement?.[field])
                                            : selectedSupplement?.[field] || ""
                                    }
                                    onChange={handleInputChange}
                                    error={!!errors[field]}
                                    helperText={errors[field]}
                                    type={field === "expiry_date" ? "date" : "number"}
                                    InputLabelProps={field === "expiry_date" ? { shrink: true } : {}}
                                    inputProps={field === "expiry_date" ? { min: new Date().toISOString().split("T")[0] } : { min: 0 }}
                                />
                            ))}

                            {/* Category Dropdown */}
                            <FormControl fullWidth margin="dense" variant="outlined" error={!!errors['category']}>
                                <InputLabel id="edit-category-label">Category</InputLabel>
                                <Select
                                    labelId="edit-category-label"
                                    name="category"
                                    value={selectedSupplement?.category || ''}
                                    onChange={handleInputChange}
                                    label="Category"
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.supplement_id} value={cat.category}>
                                            {cat.category}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                            {selectedSupplement?.category === 'Other' && (
                                <TextField
                                    margin="dense"
                                    label="Specify Category"
                                    name="customCategory"
                                    value={customCategory}
                                    onChange={(e) => {
                                        setCustomCategory(e.target.value);
                                        setSelectedSupplement(prev => ({
                                            ...prev,
                                            category: e.target.value
                                        }));
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    error={!!errors['customCategory']}
                                    helperText={errors['customCategory']}
                                />
                            )}
                        </Grid>
                        {/* Image Upload */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box
                                sx={{
                                    border: '2px dashed #ccc',
                                    borderRadius: '8px',
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: '#f8f9fa',
                                    '&:hover': { borderColor: '#1976d2', backgroundColor: '#f0f7ff' }
                                }}
                            >
                                <Typography variant="h6" gutterBottom>Product Image</Typography>
                                {!previewUrl && selectedSupplement?.image_url ? (
                                    <Box sx={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                                        <img
                                            src={selectedSupplement.image_url.startsWith('http')
                                                ? selectedSupplement.image_url
                                                : `http://localhost:8800${selectedSupplement.image_url}`}
                                            alt="Current"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                                        />
                                        <IconButton
                                            sx={{ position: 'absolute', top: -12, right: -12, backgroundColor: '#f44336', color: 'white' }}
                                            onClick={() => {
                                                setPreviewUrl(null);
                                                setSelectedSupplement(prev => ({ ...prev, image_url: "" }));
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ) : previewUrl ? (
                                    <Box sx={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                                        />
                                        <IconButton
                                            sx={{ position: 'absolute', top: -12, right: -12, backgroundColor: '#f44336', color: 'white' }}
                                            onClick={() => {
                                                setPreviewUrl(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <>
                                        <CloudUploadIcon sx={{ fontSize: 60, color: '#9e9e9e' }} />
                                        <Typography variant="body1" gutterBottom>
                                            Drag and drop an image here, or click to select a file
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            Recommended: 800x800px, JPG or PNG, max 5MB
                                        </Typography>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                                <Button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{ mt: 2, backgroundColor: '#9CA3AF' }}
                                    startIcon={<PhotoCameraIcon />}
                                >
                                    {previewUrl || selectedSupplement?.image_url ? 'Change Image' : 'Select Image'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="inherit" >
                        Cancel
                    </Button>
                    <button
                        type="button"
                        onClick={() => { handleSaveChanges(); }}
                        className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
                    >
                        Save Changes
                    </button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ManageSupplements;