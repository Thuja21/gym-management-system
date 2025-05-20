import React, {useEffect, useState} from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";
import axios from "axios";

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [supplementPayments, setSupplementPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('plans'); // To toggle between plans and supplements

    const fetchPaymentDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/planpayments/details', {
                withCredentials: true
            });
            console.log(response.data);
            setPayments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payment details', error);
            setPayments([]);
            setLoading(false);
        }
    };

    const fetchSupplementPaymentDetails = async () => {
        try {
            const response = await axios.get("http://localhost:8800/api/planpayments/supplePayments", {
                withCredentials: true
            });
            setSupplementPayments(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching supplement payment details:", error);
            setError("Failed to load supplement payment data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentDetails();
        fetchSupplementPaymentDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100" style={{ width: '100vw' }}>
            <Navbar />
            <div className="max-w-[1370px] mx-auto px-4 py-8 ">
                <div className="mb-4 mt-[60px] text-left">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>Payment History</h1>
                </div>

                {/* Tab navigation */}
                <div className="flex mb-6 border-b">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'plans' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('plans')}
                    >
                        Plan Payments
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'supplements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('supplements')}
                    >
                        Supplement Payments
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <p>Loading payment data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Plan Payments Table */}
                        {activeTab === 'plans' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Plan Name</th>
                                        <th className="py-3 px-4 text-left">Date</th>
                                        <th className="py-3 px-4 text-left">Invoice ID</th>
                                        <th className="py-3 px-4 text-left">Amount</th>
                                        <th className="py-3 px-4 text-left">Payment Method</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payments.length > 0 ? (
                                        payments.map((payment) => (
                                            <tr key={payment.payment_id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{payment.plan_name} Membership</td>
                                                <td className="py-3 px-4">{new Date(payment.payment_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</td>
                                                <td className="py-3 px-4">{`INV-${new Date(payment.payment_date).getFullYear()}-${String(payment.payment_id).padStart(3, '0')}`}</td>
                                                <td className="py-3 px-4">Rs.{payment.amount}</td>
                                                <td className="py-3 px-4">{payment.payment_method} (****4369)</td>
                                                <td className="py-3 px-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            {payment.status}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">No plan payment records found</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Supplement Payments Table */}
                        {activeTab === 'supplements' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Supplement Name</th>
                                        <th className="py-3 px-4 text-left">Date</th>
                                        <th className="py-3 px-4 text-left">Invoice ID</th>
                                        <th className="py-3 px-4 text-left">Amount</th>
                                        <th className="py-3 px-4 text-left">Payment Method</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {supplementPayments.length > 0 ? (
                                        supplementPayments.map((payment) => (
                                            <tr key={payment.payment_id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{payment.supplement_name}</td>
                                                <td className="py-3 px-4">{new Date(payment.payment_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</td>
                                                <td className="py-3 px-4">{`SUP-${new Date(payment.payment_date).getFullYear()}-${String(payment.payment_id).padStart(3, '0')}`}</td>
                                                <td className="py-3 px-4">Rs.{payment.amount}</td>
                                                <td className="py-3 px-4">{payment.payment_method || 'Card'}</td>
                                                <td className="py-3 px-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            {payment.status || 'Completed'}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">No supplement payment records found</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
