import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, Building2, Check, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import Navbar from "@/components/Member/Navbar.jsx";
import axios from "axios";


const steps = [
    { title: 'Information', description: 'Your details', icon: 'user' },
    { title: 'Payment', description: 'Choose payment method', icon: 'credit-card' },
    { title: 'Confirmation', description: 'Review your order', icon: 'check' }
];

export default function Checkout() {
    const { planId } = useParams();
    const navigate = useNavigate();
    // const plan = plans.find((p) => p.id === planId);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState('card');
    const location = useLocation();
    const selectedPlan = location.state?.plan;
    const token = localStorage.getItem('token'); // or from state/context

    console.log("selected plan",selectedPlan)

    // Default fallback plan (if none selected)
    const plan = selectedPlan || {
        title: "Monthly Plan",
        price: 500,
        period: "month",
        features: "Access to gym equipment, 1 group class per week"
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                'http://localhost:8800/api/plans/update-plan',
                { plan_id: selectedPlan.plan_id },
                { withCredentials: true }
            );
            alert('Payment successful!');
            setCurrentStep(2);
        } catch (error) {
            console.error('Error updating plan:', error);
            if (error.response) {
                alert('Payment succeeded, but failed to update plan in DB.');
            } else {
                alert('An error occurred during the purchase.');
            }
        }

    };


    // Main theme color
    const themeColor = '#FF4500';
    const themeColor1 = '#FF6333';

    return (
        <div className="min-h-screen bg-gray-50" style={{ width: '100vw' }}>
            <Navbar />
            <div className="max-w-[1370px] mx-auto px-4 py-10 bg-o">

                {/* Header for Membership Plans */}
                <div className="mb-4 mt-[60px] text-left">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>Complete Your Purchase</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2">
                        <div className="mb-10">
                            <div className="flex justify-between relative">
                                {steps.map((step, index) => (
                                    <div key={step.title} className="flex flex-col items-center relative z-10 w-full">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            index <= currentStep
                                                ? `text-white`
                                                : 'text-gray-400 bg-gray-100'
                                        }`} style={{
                                            backgroundColor: index <= currentStep ? themeColor1 : '',
                                            boxShadow: index <= currentStep ? '0 0 15px rgba(255, 69, 0, 0.5)' : 'none'
                                        }}>
                                            <span className="text-sm font-bold">{index + 1}</span>
                                        </div>
                                        <div className="mt-3 text-sm font-medium" style={{
                                            color: index <= currentStep ? themeColor : 'rgb(107, 114, 128)'
                                        }}>
                                            {step.title}
                                        </div>
                                        <div className="text-xs text-gray-500">{step.description}</div>
                                    </div>
                                ))}

                                {/* Progress bar */}
                                <div className="absolute top-5 h-0.5 w-full bg-gray-200 -z-0">
                                    <div className="h-full transition-all duration-300" style={{
                                        width: `${currentStep * 50}%`,
                                        backgroundColor: themeColor
                                    }}></div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColor }}>Personal Information</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all"
                                            style={{ focusRing: `${themeColor}40` }}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all"
                                            placeholder="+1 (234) 567-8901"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColor }}>Payment Method</h2>
                                    <div className="space-y-4">
                                        <div
                                            className={`p-5 border rounded-lg cursor-pointer transition-all hover:border-gray-400 ${
                                                selectedPayment === 'card'
                                                    ? 'border-2 shadow-sm'
                                                    : 'border-gray-200'
                                            }`}
                                            style={{
                                                borderColor: selectedPayment === 'card' ? themeColor : '',
                                                backgroundColor: selectedPayment === 'card' ? `${themeColor}10` : ''
                                            }}
                                            onClick={() => setSelectedPayment('card')}
                                        >
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4"
                                                     style={{
                                                         backgroundColor: selectedPayment === 'card' ? themeColor : '#F3F4F6',
                                                         color: selectedPayment === 'card' ? 'white' : '#9CA3AF'
                                                     }}>
                                                    <CreditCard className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-lg">Credit Card</h3>
                                                    <p className="text-sm text-gray-500">Pay with credit or debit card</p>
                                                </div>
                                                {selectedPayment === 'card' && (
                                                    <Check className="ml-auto h-5 w-5" style={{ color: themeColor }} />
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className={`p-5 border rounded-lg cursor-pointer transition-all hover:border-gray-400 ${
                                                selectedPayment === 'bank'
                                                    ? 'border-2 shadow-sm'
                                                    : 'border-gray-200'
                                            }`}
                                            style={{
                                                borderColor: selectedPayment === 'bank' ? themeColor : '',
                                                backgroundColor: selectedPayment === 'bank' ? `${themeColor}10` : ''
                                            }}
                                            onClick={() => setSelectedPayment('bank')}
                                        >
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4"
                                                     style={{
                                                         backgroundColor: selectedPayment === 'bank' ? themeColor : '#F3F4F6',
                                                         color: selectedPayment === 'bank' ? 'white' : '#9CA3AF'
                                                     }}>
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-lg">Bank Transfer</h3>
                                                    <p className="text-sm text-gray-500">Pay directly from your bank</p>
                                                </div>
                                                {selectedPayment === 'bank' && (
                                                    <Check className="ml-auto h-5 w-5" style={{ color: themeColor }} />
                                                )}
                                            </div>
                                        </div>

                                        {selectedPayment === 'card' && (
                                            <div className="mt-8 space-y-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Card Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all"
                                                        placeholder="1234 5678 9012 3456"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Expiry Date
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="expiryDate"
                                                            value={formData.expiryDate}
                                                            onChange={handleInputChange}
                                                            placeholder="MM/YY"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            CVV
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="cvv"
                                                            value={formData.cvv}
                                                            onChange={handleInputChange}
                                                            placeholder="123"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColor }}>Order Confirmation</h2>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                            <h3 className="text-lg font-medium mb-4" style={{ color: themeColor }}>Personal Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Full Name</p>
                                                    <p className="font-medium">{formData.name || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{formData.email || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="font-medium">{formData.phone || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="font-medium">{formData.address || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                            <h3 className="text-lg font-medium mb-4" style={{ color: themeColor }}>Payment Details</h3>
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Method</p>
                                                <div className="flex items-center mt-1">
                                                    {selectedPayment === 'card' ? (
                                                        <CreditCard className="h-5 w-5 mr-2" style={{ color: themeColor }} />
                                                    ) : (
                                                        <Building2 className="h-5 w-5 mr-2" style={{ color: themeColor }} />
                                                    )}
                                                    <p className="font-medium capitalize">
                                                        {selectedPayment === 'card' ? 'Credit Card' : 'Bank Transfer'}
                                                    </p>
                                                </div>

                                                {selectedPayment === 'card' && (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-gray-500">Card Number</p>
                                                        <p className="font-medium">
                                                            {formData.cardNumber ?
                                                                `**** **** **** ${formData.cardNumber.slice(-4)}` :
                                                                "Not provided"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-10 flex justify-between items-center">
                                {currentStep > 0 ? (
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </button>
                                ) : (
                                    <div></div> // Empty div for spacing
                                )}

                                <button
                                    type="button"
                                    onClick={
                                        currentStep === steps.length - 1
                                            ? handleSubmit
                                            : handleNextStep
                                    }
                                    className="flex items-center px-8 py-3 text-white rounded-lg font-medium transition-all hover:shadow-lg"
                                    style={{
                                        backgroundColor: themeColor,
                                        boxShadow: '0 4px 14px rgba(255, 69, 0, 0.25)'
                                    }}
                                >
                                    {currentStep === steps.length - 1 ? 'Complete Purchase' : 'Continue'}
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </button>

                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-1 mt-[40px]">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6 shadow-sm">
                            <div className="flex items-center mb-6">
                                <ShoppingBag className="h-5 w-5 mr-2" style={{ color: themeColor }} />
                                <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Order Summary</h2>
                            </div>

                            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${themeColor}10` }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium text-lg">{plan.title}</h3>
                                    <span className="text-2xl font-bold" style={{ color: themeColor }}>Rs.{plan.price}</span>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {plan.features.split(", ").map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <Check className="h-4 w-4 mr-2" style={{ color: themeColor }} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3 pb-4"></div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Total</span>
                                    <div className="text-right">
                                        <span className="font-bold text-2xl" style={{ color: themeColor }}>Rs.{plan.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-dashed">
                                <div className="flex items-center mb-2">
                                    <Check className="h-4 w-4 mr-2" style={{ color: themeColor }} />
                                    <p className="text-sm text-gray-600">Secure payment</p>
                                </div>
                                <div className="flex items-center mb-2">
                                    <Check className="h-4 w-4 mr-2" style={{ color: themeColor }} />
                                    <p className="text-sm text-gray-600">30-day money back guarantee</p>
                                </div>
                                <div className="flex items-center">
                                    <Check className="h-4 w-4 mr-2" style={{ color: themeColor }} />
                                    <p className="text-sm text-gray-600">24/7 customer support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}