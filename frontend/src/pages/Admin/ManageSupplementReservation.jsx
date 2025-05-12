import React, { useState, useEffect } from 'react';
import { Typography, Paper, Chip, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import AdminSideBar from '../Admin/AdminSideBar.jsx';
import { toast } from 'react-hot-toast';

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState('');
    const [loading, setLoading] = useState(true);
    const [supplements, setSupplements] = useState({});
    const [users, setUsers] = useState({});

    // Fetch reservations data
    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8800/api/reservations/viewall", {
                method: "GET"
            });

            if (response.ok) {
                const data = await response.json();

                // Process reservations to update expired status
                const currentDate = new Date();
                const processedReservations = [];
                const updatePromises = [];

                for (const reservation of data) {
                    const expiryDate = new Date(reservation.expiry_date);

                    // Check if reservation is pending and has expired
                    if (reservation.status === 'pending' && expiryDate < currentDate) {
                        // Update the status in the database
                        const updatePromise = fetch(`http://localhost:8800/api/reservations/update-status/${reservation.reservation_id}`, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ status: 'expired' })
                        }).then(response => {
                            if (!response.ok) {
                                console.error(`Failed to update reservation ${reservation.reservation_id} status to expired`);
                            }
                            return { ...reservation, status: 'expired' };
                        }).catch(err => {
                            console.error(`Error updating reservation ${reservation.reservation_id}:`, err);
                            return { ...reservation, status: 'expired' }; // Still show as expired in UI even if DB update fails
                        });

                        updatePromises.push(updatePromise);
                        processedReservations.push({ ...reservation, status: 'expired' });
                    } else {
                        processedReservations.push(reservation);
                    }
                }

                // Wait for all update operations to complete
                if (updatePromises.length > 0) {
                    await Promise.allSettled(updatePromises);
                    console.log(`Updated ${updatePromises.length} expired reservations in the database`);
                }

                setReservations(processedReservations);
            } else {
                toast.error("Failed to fetch reservations");
            }
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
            toast.error("An error occurred while fetching reservations");
        } finally {
            setLoading(false);
        }
    };

    // Handle reservation status update
    const updateReservationStatus = async (reservationId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8800/api/reservations/update-status/${reservationId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success(`Reservation marked as ${newStatus}`);
                setReservations(prev =>
                    prev.map(res =>
                        res.reservation_id === reservationId
                            ? {...res, status: newStatus}
                            : res
                    )
                );
            } else {
                toast.error("Failed to update reservation status");
            }
        } catch (err) {
            console.error("Error updating reservation:", err);
            toast.error("An error occurred");
        } finally {
            setConfirmDialog(false);
        }
    };

    // Handle reservation deletion
    const deleteReservation = async (reservationId) => {
        try {
            const response = await fetch(`http://localhost:8800/api/reservations/${reservationId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Reservation deleted successfully");
                setReservations(prev => prev.filter(res => res.reservation_id !== reservationId));
            } else {
                toast.error("Failed to delete reservation");
            }
        } catch (err) {
            console.error("Error deleting reservation:", err);
            toast.error("An error occurred");
        } finally {
            setConfirmDialog(false);
        }
    };

    // Handle menu open
    const handleMenuOpen = (event, reservation) => {
        setAnchorEl(event.currentTarget);
        setSelectedReservation(reservation);
    };

    // Handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle action confirmation
    const handleConfirmAction = (action) => {
        setDialogAction(action);
        setConfirmDialog(true);
        handleMenuClose();
    };

    // Execute confirmed action
    const executeAction = async () => {
        if (!selectedReservation) return;

        switch (dialogAction) {
            case 'collect':
                await updateReservationStatus(selectedReservation.reservation_id, 'collected');
                break;
            case 'cancel':
                await updateReservationStatus(selectedReservation.reservation_id, 'cancelled');
                break;
            case 'delete':
                await deleteReservation(selectedReservation.reservation_id);
                break;
            default:
                break;
        }
    };

    // Filter reservations based on search term and status filter
    const filteredReservations = reservations.filter(reservation => {
        const supplementInfo = supplements[reservation.supplement_id] || {};

        const searchMatch =
            (supplementInfo.supplement_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (String(reservation.reservation_id) || '').includes(searchTerm);

        const statusMatch = statusFilter === 'all' || reservation.status === statusFilter;

        return searchMatch && statusMatch;
    });

    // Get status chip color
    const getStatusChipColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-blue-100 text-blue-800';
            case 'collected':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width:"1300px", overflowY: "auto", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    MANAGE RESERVATIONS
                </Typography>

                <Paper elevation={1} className="p-4 mb-6 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reservations..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex space-x-2">
                            <button
                                className={`px-3 py-2 rounded-lg ${statusFilter === 'all' ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setStatusFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`px-3 py-2 rounded-lg ${statusFilter === 'pending' ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setStatusFilter('pending')}
                            >
                                Pending
                            </button>
                            <button
                                className={`px-3 py-2 rounded-lg ${statusFilter === 'collected' ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setStatusFilter('collected')}
                            >
                                Collected
                            </button>
                            <button
                                className={`px-3 py-2 rounded-lg ${statusFilter === 'cancelled' ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setStatusFilter('cancelled')}
                            >
                                Cancelled
                            </button>
                            <button
                                className={`px-3 py-2 rounded-lg ${statusFilter === 'expired' ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setStatusFilter('expired')}
                            >
                                Expired
                            </button>
                        </div>
                    </div>
                </Paper>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-900"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reservation ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplement
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reserved On
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expires On
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReservations.length > 0 ? (
                                    filteredReservations.map((reservation) => {

                                        return (
                                            <tr key={reservation.reservation_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{reservation.reservation_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{reservation.user_id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{reservation.full_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {reservation.supplement_name || 'Unknown Supplement'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {reservation.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    Rs. {reservation.total_price}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(reservation.reservation_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(reservation.expiry_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipColor(reservation.status)}`}>
                                                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                                        </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <IconButton
                                                        aria-label="more"
                                                        aria-controls="reservation-menu"
                                                        aria-haspopup="true"
                                                        onClick={(e) => handleMenuOpen(e, reservation)}
                                                    >
                                                        <MoreVertical className="h-5 w-5" />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No reservations found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Action Menu */}
                <Menu
                    id="reservation-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {selectedReservation && selectedReservation.status === 'pending' && (
                        <MenuItem onClick={() => handleConfirmAction('collect')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Collected
                        </MenuItem>
                    )}
                    {selectedReservation && selectedReservation.status === 'pending' && (
                        <MenuItem onClick={() => handleConfirmAction('cancel')}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Reservation
                        </MenuItem>
                    )}
                    <MenuItem onClick={() => handleConfirmAction('delete')}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Reservation
                    </MenuItem>
                </Menu>

                {/* Confirmation Dialog */}
                <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
                    <DialogTitle>
                        {dialogAction === 'collect' && "Mark Reservation as Collected"}
                        {dialogAction === 'cancel' && "Cancel Reservation"}
                        {dialogAction === 'delete' && "Delete Reservation"}
                    </DialogTitle>
                    <DialogContent>
                        {dialogAction === 'collect' && "Are you sure you want to mark this reservation as collected? This action cannot be undone."}
                        {dialogAction === 'cancel' && "Are you sure you want to cancel this reservation?"}
                        {dialogAction === 'delete' && "Are you sure you want to delete this reservation? This action cannot be undone."}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
                        <Button onClick={executeAction} color="primary" variant="contained">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default ManageReservations;
