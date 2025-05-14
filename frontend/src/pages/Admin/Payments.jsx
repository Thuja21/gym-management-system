import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import { IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { FiFilter } from "react-icons/fi";
import axios from "axios";

const Payment = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [payments, setPayments] = useState([]);

    // Fetch payments from backend
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8800/api/planpayments/payments");
                setPayments(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching payment details:", error);
                setError("Failed to load payment data");
                setLoading(false);
            }
        };
        fetchPaymentDetails();
    }, []);

    // Add this function to handle marking payment as paid
    const handleMarkPayment = (payment) => {
        console.log("Marking payment as paid:", payment);
        // Implement your payment update logic here
    };

    // Filter payments based on search term and status
    const filteredPayments = payments.filter((payment) => {
        const lowerSearchTerm = searchTerm.toLowerCase();

        return (
            (filterStatus === "all" || payment?.status?.toLowerCase() === filterStatus.toLowerCase()) &&
            (
                payment?.member_id?.toString().toLowerCase().includes(lowerSearchTerm) ||
                payment?.plan_name?.toLowerCase().includes(lowerSearchTerm) ||
                payment?.full_name?.toLowerCase().includes(lowerSearchTerm) ||
                payment?.payment_date?.toString().toLowerCase().includes(lowerSearchTerm) ||  // Add due_date search
                payment?.status?.toLowerCase().includes(lowerSearchTerm)       // Add status search
            )
        );
    });



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
                                <TableRow className="bg-gray-300  text-blue-950 text-left text-xs font-medium uppercase tracking-wider">
                                    <th className="px-6 py-3 text-center">ID</th>
                                    <th className="px-6 py-3 text-center">Member Id</th>
                                    <th className="px-6 py-3 text-center">Member</th>
                                    <th className="pl-14 py-3">Plan</th>
                                    <th className="pl-32 py-3">Amount</th>
                                    <th className="pl-24 py-3">Due Date</th>
                                    <th className="px-5 py-3">Status</th>
                                    {/*<th className="pl-14 py-3">Action</th>*/}
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y divide-gray-200 text-[15px]">
                                {loading ? (
                                    <TableRow>
                                        <td colSpan={6} className="px-6 py-4 text-center">Loading payment data...</td>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <td colSpan={6} className="px-6 py-4 text-center text-red-500">{error}</td>
                                    </TableRow>
                                ) : filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <td colSpan={6} className="px-6 py-4 text-center">No payment records found</td>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment, index) => (
                                        <TableRow key={payment.payment_id || index}>
                                            {/*<td className="px-6 py-3 text-center">{index + 1}</td>  /!* Auto incremented ID *!/*/}
                                            <td className="px-6 py-3 text-center">{payment.payment_id}</td>  {/* Auto incremented ID */}
                                            <td className="px-6 py-3 text-center">{payment.member_id}</td>
                                            <td className="px-6 py-3 text-center">{payment.full_name}</td>
                                            <td className="pl-6 py-3">
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                                    {payment.plan_name}
                                                </span>
                                            </td>
                                            <td className="pl-16 py-3 text-center">{payment.amount}</td>
                                            <td className="px-16 py-3 text-center">
                                                {payment.payment_date &&
                                                    new Date(payment.payment_date).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}
                                            </td>
                                            <td className="pr-10 ">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[payment.status] || "bg-gray-100 text-gray-700"}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            {/*<td className="pr-6 ">*/}
                                            {/*    <button*/}
                                            {/*        onClick={() => handleMarkPayment(payment)}*/}
                                            {/*        className="text-indigo-600 hover:text-indigo-900"*/}
                                            {/*    >*/}
                                            {/*        Mark as Paid*/}
                                            {/*    </button>*/}
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