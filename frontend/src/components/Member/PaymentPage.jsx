import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PaymentPage({ selectedPlan, onBack, onPaymentSuccess }) {
    const [formData, setFormData] = useState({ payment_method: 'card' });
    const [processingPayment, setProcessingPayment] = useState(false);
    const navigate = useNavigate();

    const formatCardNumber = (value) => {
        const digitsOnly = value.replace(/\D/g, '');
        const limitedDigits = digitsOnly.slice(0, 16);
        return limitedDigits.replace(/(.{4})/g, '$1 ').trim();
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setFormData({ ...formData, card_number: formatted });
    };

    const handleCvvChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 3);
        setFormData({ ...formData, cvv: digitsOnly });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);

        setTimeout(() => {
            setProcessingPayment(false);
            alert("✅ Payment successful!");
            onPaymentSuccess();
        }, 1500);
    };

    return (
        <form onSubmit={handlePaymentSubmit}>
            <div className="max-w-[600px] mx-auto bg-gray-50 p-5 border-1 border-gray-900 rounded-lg">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-left" style={{ fontFamily: "Segoe UI" }}>
                        Payment Details🔒
                    </h3>
                    <div className="h-[1px] w-full bg-black"></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 text-right">* Required field</p>

                    {/* Card Type */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-left">Card Type *</label>
                        <div className="flex justify-center mb-4">
                            <div className="flex gap-4">
                                {/* VISA */}
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="card_type"
                                        value="visa"
                                        checked={formData.card_type === 'visa'}
                                        onChange={() => setFormData({ ...formData, card_type: 'visa' })}
                                        className="mr-2"
                                    />
                                    <div className="bg-white border rounded px-2 py-1">
                                        <span className="font-medium text-blue-600">VISA</span> Visa
                                    </div>
                                </label>

                                {/* Mastercard */}
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="card_type"
                                        value="mastercard"
                                        checked={formData.card_type === 'mastercard'}
                                        onChange={() => setFormData({ ...formData, card_type: 'mastercard' })}
                                        className="mr-2"
                                    />
                                    <div className="bg-white border rounded px-2 py-1 flex items-center">
                                        <div className="bg-red-500 rounded-full h-4 w-4 mr-1"></div>
                                        <div className="bg-yellow-500 rounded-full h-4 w-4 opacity-70"></div>
                                        <span className="ml-1">Mastercard</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Card Number */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-left">Card Number *</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full border border-gray-300 rounded p-2"
                            value={formData.card_number || ''}
                            onChange={handleCardNumberChange}
                        />
                    </div>

                    {/* Expiry */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-left">Expiration Month *</label>
                            <select
                                className="w-full border border-gray-300 rounded p-2"
                                value={formData.exp_month || ''}
                                onChange={(e) => setFormData({ ...formData, exp_month: e.target.value })}
                            >
                                <option value="">Month</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-left">Expiration Year *</label>
                            <select
                                className="w-full border border-gray-300 rounded p-2"
                                value={formData.exp_year || ''}
                                onChange={(e) => setFormData({ ...formData, exp_year: e.target.value })}
                            >
                                <option value="">Year</option>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* CVV */}
                    <div className="mb-4 flex items-start gap-4">
                        <label className="text-sm font-medium pt-2 w-16">CVN *</label>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <input
                                type="text"
                                placeholder="123"
                                className="border border-gray-300 rounded p-2 w-24"
                                value={formData.cvv || ''}
                                onChange={handleCvvChange}
                            />
                            <span className="text-sm text-gray-600 max-w-xs">
                                This code is a three digit number printed on the back or front of credit cards.
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-9">
                        <button
                            type="button"
                            className="px-8 py-2 border border-gray-300 rounded font-medium"
                            onClick={() => onBack?.()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-green-700 text-white rounded font-medium"
                            disabled={processingPayment}
                        >
                            {processingPayment ? 'Processing...' : 'Pay'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PaymentPage;
