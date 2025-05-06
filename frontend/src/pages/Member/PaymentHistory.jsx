import React, {useEffect, useState} from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";
import axios from "axios";

export default function PaymentHistory() {

    const [payments, setPayments] = useState([]); // State to store membership types

    const fetchPaymentDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/planpayments/details', {
                withCredentials: true
            });
            console.log(response.data);
            setPayments(response.data); // Set the fetched data to state
        } catch (error) {
            console.error('Error fetching payment details', error);
            setPayments([]); // <-- This is the fix
        }
    };
    useEffect(() => {
        fetchPaymentDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100" style={{ width: '100vw' }}>
            <Navbar />
            <div className="max-w-[1370px] mx-auto px-4 py-8 ">

                <div className="mb-4 mt-[60px] text-left">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>Payment History</h1>
                </div>

                <div className="space-y-4 "  style={{ fontFamily: "Segoe UI" }}>
                    {payments.map((payment) => (
                        <div key={payment.payment_id} className="bg-white rounded-lg border-1 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                                    <span className="text-lg font-medium " >{payment.plan_name} Membership - </span>
                                    <span className="text-lg font-medium">
                                      {new Date(payment.payment_date).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long'
                                      })}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-green-600">{payment.status}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Invoice ID</p>
                                    <p className="font-medium">
                                        {`INV-${new Date(payment.payment_date).getFullYear()}-${String(payment.payment_id).padStart(3, '0')}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Date</p>
                                    <p className="font-medium">
                                        {new Date(payment.payment_date).toISOString().split('T')[0]}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Amount</p>
                                    <p className="font-medium">Rs.{payment.amount}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Payment Method</p>
                                    <p className="font-medium">{payment.payment_method} (****4369)</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}