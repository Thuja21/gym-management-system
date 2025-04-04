import React from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx";

export default function PaymentHistory() {
    const payments = [
        {
            id: 'INV-2024-001',
            date: '2024-03-01',
            amount: 49.99,
            status: 'Paid',
            method: 'Credit Card (**** 1234)',
            description: 'Monthly Membership - March 2024'
        },
        {
            id: 'INV-2024-002',
            date: '2024-02-01',
            amount: 49.99,
            status: 'Paid',
            method: 'Credit Card (**** 1234)',
            description: 'Monthly Membership - February 2024'
        },
        {
            id: 'INV-2024-003',
            date: '2024-01-01',
            amount: 49.99,
            status: 'Paid',
            method: 'Credit Card (**** 1234)',
            description: 'Monthly Membership - January 2024'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50" style={{width:'100vw'}}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 mt-16 text-left" style={{fontFamily : "sans-serif"}}>Payment History</h1>

            <div className="space-y-4">
                {payments.map((payment) => (
                    <div key={payment.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                                <span className="text-lg font-medium " >{payment.description}</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-sm text-green-600">{payment.status}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Invoice ID</p>
                                <p className="font-medium">{payment.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Date</p>
                                <p className="font-medium">{payment.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Amount</p>
                                <p className="font-medium">${payment.amount}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Payment Method</p>
                                <p className="font-medium">{payment.method}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}