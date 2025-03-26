import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import { IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Button, Menu, MenuItem } from '@mui/material';
import { Edit as EditIcon, Trash as DeleteIcon, Search } from "lucide-react";
import { FiCheckCircle, FiClock, FiXCircle, FiFilter } from "react-icons/fi";

const Payment = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [payments, setPayments] = useState([]);


    // Fetch payments from backend
    useEffect(() => {
        const fetchAllMembers = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/planpayments/getmembers"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch payments.");
                }
                const data = await response.json();
                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllMembers();
    }, []);

    // Filtered payments based on search and status
    const filteredPayments = payments.filter((payment) => {
        return (
            (filterStatus === "all" || payment?.status?.toLowerCase() === filterStatus.toLowerCase()) &&
            (payment?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const handleStatusChange = (id, newStatus) => {
        setPayments((prev) =>
            prev.map((payment) =>
                payment.id === id ? { ...payment, status: newStatus } : payment
            )
        );
    };
    const statusStyles = {
        paid: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        overdue: "bg-red-100 text-red-700",
    };


    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", paddingRight: "30px" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", marginLeft: "-45px", marginTop: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    GYM TRAINERS
                </Typography>

                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <div className="flex items-center">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="ml-4 flex items-center space-x-3">
                            <span className="text-gray-700 font-medium flex items-center space-x-2">
                                <FiFilter className="w-5 h-5 text-gray-500" />
                                <span>Filter:</span>
                            </span>
                            <select
                                className="bg-white border border-gray-300 text-gray-700 font-medium w-48 px-4 py-2 rounded-lg shadow-sm hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Payments</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>

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
                                    <th className="px-6 py-3 text-center">Member Name</th>
                                    <th className="pl-14 py-3">Plan</th>
                                    <th className="pl-32 py-3">Amount</th>
                                    <th className="pl-24 py-3">Due Date</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="pl-14 py-3">Action</th>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y divide-gray-200">
                                {loading ? (
                                    <TableRow>
                                        <td colSpan="6" className="text-center py-4">Loading...</td>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <td colSpan="6" className="text-center text-red-500 py-4">{error}</td>
                                    </TableRow>
                                ) : filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <td colSpan="6" className="text-center py-4">No results found.</td>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        // <TableRow key={payment.payment_id}>
                                        <TableRow key={payment.payment_id}>
                                            <td className="px-6 py-3 text-center">{payment.full_name}</td>
                                            <td className="pl-6 py-3">
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                                {payment.plan_name}
                                                </span>
                                            </td>
                                            <td className="pl-16 py-3 text-center">{payment.plan_price}</td>
                                            <td className="px-16 py-3 text-center">
                                                {new Date(payment.registered_date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="pr-10 ">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[payment.status]}`}>
                                                {payment.status}
                                                </span>
                                            </td>
                                            <td className = "pr-6 ">
                                                <button
                                                    onClick={() => handleMarkPayment(payment)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Mark as Paid
                                                </button>
                                            </td>
                                            {/*<td className="p-2">*/}
                                            {/*    <select*/}
                                            {/*        value={payment.status}*/}
                                            {/*        onChange={(e) =>*/}
                                            {/*            handleStatusChange(payment.id, e.target.value)*/}
                                            {/*        }*/}
                                            {/*        className="rounded p-1 shadow-sm"*/}
                                            {/*    >*/}
                                            {/*        <option value="paid">Paid</option>*/}
                                            {/*        <option value="pending">Pending</option>*/}
                                            {/*        <option value="overdue">Overdue</option>*/}
                                            {/*    </select>*/}
                                            {/*</td>*/}

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default Payment;
