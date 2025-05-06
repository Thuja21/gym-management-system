import React, { useState, useEffect } from "react";
// import "./signup.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserCircle2, Users, ArrowLeft, CreditCard, Lock, Building, CheckCircle } from 'lucide-react';
import App from "@/pages/Login/Sample2.jsx";

function Signup () {
    const location = useLocation();
    const [formStep, setFormStep] = useState(1);
    const [userType, setUserType] = useState("MEMBER");
    const [dob, setDob] = useState("");
    const [age, setAge] = useState("");
    const [plans, setPlans] = useState([
        {
            plan_id: 1,
            plan_name: "Basic Membership",
            features: "Access to basic features and community forums",
            plan_price: "999",
            plan_duration: 30
        },
        {
            plan_id: 2,
            plan_name: "Premium Membership",
            features: "Full access to all features and priority support",
            plan_price: "1999",
            plan_duration: 90
        },
        {
            plan_id: 3,
            plan_name: "VIP Membership",
            features: "Everything in Premium plus exclusive content and events",
            plan_price: "4999",
            plan_duration: 365
        }
    ]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Check if returning from payment
    useEffect(() => {
        // If there's payment status in the URL, check it
        const params = new URLSearchParams(location.search);
        const status = params.get('payment_status');

        if (status === 'success') {
            // Get stored form data from localStorage
            const savedFormData = localStorage.getItem('tempFormData');
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
                setPaymentCompleted(true);
                setFormStep(2); // Move to fitness information step

                // If user was at payment step, move them back to form
                if (formStep === 1.5) {
                    setFormStep(2);
                }

                // Clear saved form data
                localStorage.removeItem('tempFormData');
            }
        }
    }, [location]);

    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        password: "",
        email: "",
        contactNo: "",
        address: "",
        height: "",
        weight: "",
        gender: "",
        bloodGroup: "",
        currentFitnessLevel: "",
        fitnessGoal: "",
        healthIssues: "",
        plan_id: "",
        payment_method: "card",
        card_type: "visa",
        card_number: "",
        exp_month: "",
        exp_year: "",
        cvv: "",
        cardholder_name: ""
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get("http://localhost:8800/api/members/plans");
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching membership plans:", error);
            }
        };
        fetchPlans();
    }, []);

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleDobChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const today = new Date();
        if (selectedDate > today) {
            setErrors((prev) => ({
                ...prev,
                dob: "Date of Birth cannot be in the future.",
            }));
            setDob("");
            setAge("");
        } else {
            setDob(event.target.value);
            const calculatedAge = today.getFullYear() - selectedDate.getFullYear();
            setAge(
                today.getMonth() - selectedDate.getMonth() < 0 ||
                (today.getMonth() === selectedDate.getMonth() &&
                    today.getDate() < selectedDate.getDate())
                    ? calculatedAge - 1
                    : calculatedAge
            );
            setErrors((prev) => ({ ...prev, dob: "" }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Update form data
        setFormData((prev) => ({ ...prev, [name]: value }));

        // If this is the plan_id field, find the selected plan
        if (name === "plan_id") {
            const plan = plans.find(p => p.plan_id.toString() === value);
            setSelectedPlan(plan);
        }

        // Validate field and update errors
        setErrors((prev) => ({
            ...prev,
            [name]: validateForm(name, value),
        }));
    };

    const validateForm = (name, value) => {
        let error = "";

        switch (name) {
            case "username":
                if (!value.trim()) error = "User Name is required.";
                break;
            case "fullname":
                if (!value.trim()) error = "Full Name is required.";
                break;
            case "password":
                if (!value) error = "Password is required.";
                else if (value.length < 6) error = "Password must be at least 6 characters.";
                break;
            case "email":
                if (!value) error = "Email is required.";
                else if (!/\S+@\S+\.\S+/.test(value)) error = "Email format is invalid.";
                break;
            case "contactNo":
                if (!value) error = "Contact Number is required.";
                else if (!/^\d{10}$/.test(value)) error = "Contact Number must be 10 digits.";
                break;
            case "address":
                if (!value.trim()) error = "Address is required.";
                break;
            case "dob":
                if (!value) error = "Date of Birth is required.";
                break;
            case "gender":
                if (!value) error = "Gender is required.";
                break;
            case "height":
                if (!value) error = "Height is required.";
                else if (!/^\d+(\.\d+)?$/.test(value)) error = "Height must be a valid number.";
                break;
            case "weight":
                if (!value) error = "Weight is required.";
                else if (!/^\d+(\.\d+)?$/.test(value)) error = "Weight must be a valid number.";
                break;
            case "plan_id":
                if (!value) error = "Membership Plan is required.";
                break;
            case "bloodGroup":
                if (!value) error = "Blood Group is required.";
                break;
            case "fitnessGoal":
                if (!value) error = "Fitness Goal is required.";
                break;
            case "currentFitnessLevel":
                if (!value) error = "Current Fitness Level is required.";
                break;
            case "healthIssues":
                if (!value) error = "Please specify if there are any health issues.";
                break;
            case "card_number":
                if (!value) error = "Card number is required.";
                else if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) error = "Card number must be 16 digits.";
                break;
            case "exp_month":
                if (!value) error = "Expiration month is required.";
                break;
            case "exp_year":
                if (!value) error = "Expiration year is required.";
                break;
            case "cvv":
                if (!value) error = "CVV is required.";
                else if (!/^\d{3,4}$/.test(value)) error = "CVV must be 3 or 4 digits.";
                break;
            default:
                break;
        }

        return error;
    };

    const validateFormStep = (step) => {
        let newErrors = {};
        let isValid = true;

        if (step === 1) {
            // Validate first step fields
            ["username", "password", "fullname", "email", "contactNo", "address"].forEach(field => {
                const error = validateForm(field, formData[field]);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });

            if (userType === "MEMBER" && !dob) {
                newErrors.dob = "Date of Birth is required.";
                isValid = false;
            }
        } else if (step === 1.5) {
            // Validate payment fields
            if (!selectedPlan) {
                newErrors.plan_id = "Please select a plan";
                isValid = false;
            }
        } else if (step === 2) {
            // Validate second step fields for MEMBER
            ["gender", "bloodGroup", "height", "weight", "currentFitnessLevel", "fitnessGoal", "healthIssues", "plan_id"].forEach(field => {
                const error = validateForm(field, formData[field]);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });
        }

        setErrors(newErrors);
        return isValid;
    };

    const proceedToPayment = () => {
        // Validate step 1 first
        if (!validateFormStep(1)) {
            return;
        }

        // Store form data temporarily
        localStorage.setItem('tempFormData', JSON.stringify(formData));

        // Set form step to payment (1.5)
        setFormStep(1.5);
    };

    const handlePayment = () => {
        // Validate payment selection
        if (!validateFormStep(1.5)) {
            return;
        }

        // Move to the payment gateway form
        setFormStep(1.7);
    };

    const submitPaymentForm = (e) => {
        e.preventDefault();

        // Validate payment form fields
        let paymentErrors = {};
        let isValid = true;

        ["card_number", "exp_month", "exp_year", "cvv"].forEach(field => {
            const error = validateForm(field, formData[field]);
            if (error) {
                paymentErrors[field] = error;
                isValid = false;
            }
        });

        if (!isValid) {
            setErrors(paymentErrors);
            return;
        }

        setProcessingPayment(true);

        // Simulate payment processing
        setTimeout(() => {
            setProcessingPayment(false);
            setPaymentCompleted(true);
            setFormStep(2);

            // Display success message
            alert("Payment successful! Please complete your registration.");
        }, 2000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // For members, validate step 2
        if (userType === "MEMBER" && !validateFormStep(2)) {
            return;
        }

        // For customers, validate step 1
        if (userType === "CUSTOMER" && !validateFormStep(1)) {
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8800/api/auth/register",
                { ...formData, userType: userType, dob: dob, age: age },
            );
            alert(response.data); // Success message
            navigate("/login"); // Redirect to login
        } catch (error) {
            alert(error.response?.data || "Registration failed.");
        }
    };

    return (
        <div className="h-[60vw] min-h-screen bg-[url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-fixed" style={{ width: "100vw" }}>
            <div className="h-[60vw] absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm">
                <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-white mb-2">Join Our Fitness Community</h2>
                            <p className="text-lg text-gray-300">Start your fitness journey today!</p>
                        </div>

                        {/* User Type Selection */}
                        <div className="flex justify-center mb-8 space-x-4">
                            <label className={`flex items-center px-4 py-2 rounded-lg text-lg font-semibold cursor-pointer ${
                                userType === "MEMBER" ? 'bg-[#FF4500] text-white' : 'bg-white/90 text-gray-900 hover:bg-white'
                            } transition duration-300`}>
                                <UserCircle2 className="w-6 h-6 mr-2" />
                                <input
                                    type="radio"
                                    name="userType"
                                    value="MEMBER"
                                    checked={userType === "MEMBER"}
                                    onChange={handleUserTypeChange}
                                    className="hidden"
                                />
                                Member Registration
                            </label>
                            <label className={`flex items-center px-8 py-3 rounded-lg text-lg font-semibold cursor-pointer ${
                                userType === "CUSTOMER" ? 'bg-[#FF4500] text-white' : 'bg-white/90 text-gray-900 hover:bg-white'
                            } transition duration-300`}>
                                <Users className="w-6 h-6 mr-2" />
                                <input
                                    type="radio"
                                    name="userType"
                                    value="CUSTOMER"
                                    checked={userType === "CUSTOMER"}
                                    onChange={handleUserTypeChange}
                                    className="hidden"
                                />
                                Customer Registration
                            </label>
                        </div>

                        {/* Registration Form */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Section 1: Personal Information */}
                                {(!userType || userType === "CUSTOMER" || (userType === "MEMBER" && formStep === 1)) && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-5 ">Account Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Username */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                                {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                                            </div>

                                            {/* Full Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="fullname"
                                                    value={formData.fullname}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                                {errors.fullname && <span className="text-red-500 text-sm">{errors.fullname}</span>}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                            </div>

                                            {/* Contact No */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                                                <input
                                                    type="tel"
                                                    name="contactNo"
                                                    value={formData.contactNo}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                                {errors.contactNo && <span className="text-red-500 text-sm">{errors.contactNo}</span>}
                                            </div>

                                            {/* Address */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                                {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                                            </div>

                                            {/* MEMBER: DOB & Age */}
                                            {userType === "MEMBER" && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={dob}
                                                            onChange={handleDobChange}
                                                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                        />
                                                        {errors.dob && <span className="text-red-500 text-sm">{errors.dob}</span>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                                        <input
                                                            type="number"
                                                            value={age}
                                                            readOnly
                                                            placeholder="Age"
                                                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Next/Submit Button */}
                                        {userType === "CUSTOMER" ? (
                                            <div className="mt-6">
                                                <button
                                                    type="submit"
                                                    className="bg-[#FF4500] text-white rounded-md text-base w-[200px] h-[45px] hover:bg-[#6e0404] font-semibold transition"
                                                >
                                                    Register
                                                </button>
                                            </div>
                                        ) : userType === "MEMBER" && (
                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={proceedToPayment}
                                                    className="bg-[#FF4500] text-white rounded-md text-base w-[200px] h-[45px] hover:bg-[#6e0404] font-semibold transition"
                                                >
                                                    Next &gt;
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Payment Section - Plan Selection */}
                                {userType === "MEMBER" && formStep === 1.5 && (
                                    <div className="max-w-4xl mx-auto">
                                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                                            <h3 className="text-2xl font-bold text-gray-900">Membership Payment</h3>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Lock className="h-4 w-4 mr-1" />
                                                <span>Secure Payment</span>
                                            </div>
                                        </div>

                                        {/* Plan Selection */}
                                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                                            <h4 className="text-lg font-semibold mb-4">Select a Membership Plan</h4>

                                            <div className="grid gap-4 md:grid-cols-3">
                                                {plans.map((plan) => (
                                                    <div
                                                        key={plan.plan_id}
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, plan_id: plan.plan_id.toString() }));
                                                            setSelectedPlan(plan);
                                                            setErrors({});
                                                        }}
                                                        className={`cursor-pointer border rounded-lg p-5 transition hover:shadow-md ${
                                                            formData.plan_id === plan.plan_id.toString()
                                                                ? 'border-[#FF4500] bg-orange-50 ring-2 ring-orange-200'
                                                                : 'border-gray-200 hover:border-orange-200'
                                                        }`}
                                                    >
                                                        {formData.plan_id === plan.plan_id.toString() && (
                                                            <div className="float-right">
                                                                <CheckCircle className="h-5 w-5 text-[#FF4500]" />
                                                            </div>
                                                        )}
                                                        <h5 className="font-semibold text-lg">{plan.plan_name}</h5>
                                                        <p className="text-gray-600 text-sm mt-1">{plan.features}</p>
                                                        <div className="mt-4 pt-2 border-t border-gray-100">
                                                            <p className="text-xl font-bold text-[#FF4500]">Rs.{plan.plan_price}</p>
                                                            <p className="text-sm text-gray-500">Duration: {plan.plan_duration} days</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {errors.plan_id && <span className="text-red-500 text-sm block mt-2">{errors.plan_id}</span>}
                                        </div>

                                        {/* Payment Summary */}
                                        {selectedPlan && (
                                            <div className="mb-8">
                                                <h4 className="text-lg font-semibold mb-3">Payment Summary</h4>
                                                <div className="bg-gray-50 p-5 border rounded-lg">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-gray-600">Plan:</span>
                                                        <span className="font-medium">{selectedPlan.plan_name}</span>
                                                    </div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-gray-600">Duration:</span>
                                                        <span>{selectedPlan.plan_duration} days</span>
                                                    </div>
                                                    <div className="border-t border-dashed my-3"></div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-gray-600">Subtotal:</span>
                                                        <span>Rs.{selectedPlan.plan_price}</span>
                                                    </div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-gray-600">Tax:</span>
                                                        <span>Rs.0.00</span>
                                                    </div>
                                                    <div className="border-t border-gray-200 my-3"></div>
                                                    <div className="flex justify-between font-bold text-lg">
                                                        <span>Total:</span>
                                                        <span className="text-[#FF4500]">Rs.{selectedPlan.plan_price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between w-full mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setFormStep(1)}
                                                className="bg-gray-500 text-white rounded-md px-6 py-2 hover:bg-gray-600 font-semibold transition flex items-center"
                                            >
                                                <ArrowLeft className="w-5 h-5 mr-1" /> Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handlePayment}
                                                disabled={!selectedPlan || processingPayment}
                                                className={`bg-[#FF4500] text-white rounded-md px-6 py-2 font-semibold transition flex items-center justify-center w-[250px] ${
                                                    (!selectedPlan || processingPayment) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6e0404]'
                                                }`}
                                            >
                                                {processingPayment ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>Proceed to Pay Rs.{selectedPlan ? selectedPlan.plan_price : '0.00'}</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Gateway Form */}
                                {userType === "MEMBER" && formStep === 1.7 && (
                                    <div className="max-w-md mx-auto">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Details</h3>
                                            <div className="h-1 w-full bg-gray-200"></div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm text-gray-600 text-right">* Required field</p>

                                            <div className="mb-4">
                                                <label className="block mb-2 font-medium">Card Type *</label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="card_type"
                                                            value="visa"
                                                            checked={formData.card_type === 'visa'}
                                                            onChange={() => setFormData({...formData, card_type: 'visa'})}
                                                            className="mr-2"
                                                        />
                                                        <div className="bg-white border rounded px-2 py-1">
                                                            <span className="font-medium text-blue-600">VISA</span> Visa
                                                        </div>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="card_type"
                                                            value="mastercard"
                                                            checked={formData.card_type === 'mastercard'}
                                                            onChange={() => setFormData({...formData, card_type: 'mastercard'})}
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

                                            <div className="mb-4">
                                                <label className="block mb-2 font-medium">Card Number *</label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full border border-gray-300 rounded p-2"
                                                    value={formData.card_number}
                                                    onChange={(e) => setFormData({...formData, card_number: e.target.value})}
                                                />
                                                {errors.card_number && <span className="text-red-500 text-sm">{errors.card_number}</span>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block mb-2 font-medium">Expiration Month *</label>
                                                    <select
                                                        className="w-full border border-gray-300 rounded p-2"
                                                        value={formData.exp_month}
                                                        onChange={(e) => setFormData({...formData, exp_month: e.target.value})}
                                                    >
                                                        <option value="">Month</option>
                                                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                                            <option key={month} value={month}>{month}</option>
                                                        ))}
                                                    </select>
                                                    {errors.exp_month && <span className="text-red-500 text-sm">{errors.exp_month}</span>}
                                                </div>
                                                <div>
                                                    <label className="block mb-2 font-medium">Expiration Year *</label>
                                                    <select
                                                        className="w-full border border-gray-300 rounded p-2"
                                                        value={formData.exp_year}
                                                        onChange={(e) => setFormData({...formData, exp_year: e.target.value})}
                                                    >
                                                        <option value="">Year</option>
                                                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block mb-2 font-medium">CVN *</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="border border-gray-300 rounded p-2 w-24"
                                                        value={formData.cvv}
                                                        onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                                                    />
                                                    <div className="flex items-center">
                                                        <img src="/api/placeholder/40/25" alt="CVV location" className="mr-2" />
                                                        <span className="text-sm text-gray-600">This code is a three or four digit number printed on the back or front of credit cards.</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-6">
                                                <button
                                                    type="button"
                                                    className="px-8 py-2 border border-gray-300 rounded font-medium"
                                                    onClick={() => setFormStep(1)}
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
                                )}

                                {formStep === 3 && (
                                    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                                        <p className="text-gray-600 mb-6">Your membership has been activated successfully.</p>
                                        <p className="text-gray-600 mb-6">
                                            You selected the <span className="font-medium">{selectedPlan?.plan_name}</span> plan for{' '}
                                            <span className="font-medium">Rs.{selectedPlan?.plan_price}</span>.
                                        </p>
                                        <button
                                            onClick={goToRegistration}
                                            className="bg-blue-600 text-white rounded-md px-6 py-3 font-medium hover:bg-blue-700 transition"
                                        >
                                            Continue to Registration
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
        }

export default Signup;