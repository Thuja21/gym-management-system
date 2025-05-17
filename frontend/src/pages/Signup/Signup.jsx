import React, { useState, useEffect } from "react";
import "./signup.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserCircle2, Users, Lock, CheckCircle } from 'lucide-react';
import PaymentPage from "@/components/Member/PaymentPage.jsx";
import Bill from "@/components/Member/BillPreview.jsx";

const Signup = () => {
  const location = useLocation();
  const [formStep, setFormStep] = useState(1);
  const [userType, setUserType] = useState("MEMBER");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingToPayment, setLoadingToPayment] = useState(false);

  const [showBill, setShowBill] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    payment_id: "",
    payment_date: new Date().toISOString(),
    amount: 0
  });


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
      ["username", "password", "fullname", "email", "contactNo", "address",].forEach(field => {
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
      // Validate second step fields for MEMBER
      ["gender", "bloodGroup", "height", "weight", "currentFitnessLevel", "fitnessGoal", "healthIssues"].forEach(field => {
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
    if (!validateFormStep(1)) {
      return;
    }

    setLoadingToPayment(true); // Show loading

    setTimeout(() => {
      localStorage.setItem('tempFormData', JSON.stringify(formData));
      setLoadingToPayment(false); // Done loading
      setFormStep(1.5); // Move to payment page
    }, 1000); // Simulated delay — you can remove or shorten this if unnecessary
  };

  const completeRegistration = async () => {
    try {
      // Create the data object to send to the backend
      const dataToSubmit = {
        ...formData,
        userType: userType,
        dob: dob,
        age: age
      };

      // Generate a payment ID
      const paymentId = "TRX" + Date.now();

      // Add payment details for members
      if (userType === "MEMBER" && selectedPlan) {
        const paymentData = {
          amount: selectedPlan.plan_price,
          payment_date: new Date().toISOString(),
          payment_method: "Credit Card",
          payment_id: paymentId,
          plan_id: formData.plan_id
        };

        dataToSubmit.payment_details = paymentData;
        setPaymentDetails(paymentData);
      }

      await axios.post(
          "http://localhost:8800/api/auth/register",
          dataToSubmit
      );

      return true;
    } catch (error) {
      alert(error.response?.data || "Registration failed.");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // For customers, register directly
    if (userType === "CUSTOMER") {
      const response = await registerUser();
      if (response) {
        alert(response.data); // Success message
        navigate("/login"); // Redirect to login
      }
    } else {
      // For members, just show the bill (registration already happened after payment)
      setShowBill(true);
    }
  };

  const handleProceedToPay = () => {
    setLoadingToPayment(true); // show loading

    // Optional: validate previous form steps here if needed

    setTimeout(() => {
      setFormStep(2); // Go to payment step
      setLoadingToPayment(false); // stop loading (can be moved to payment page if needed)
    }, 1000); // simulate delay or remove this if unnecessary
  };


  return (
      <div className="h-[98vw] min-h-screen bg-[url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-fixed" style={{ width: "100vw" }}>
        <div className="h-[98vw] absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm">
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
              {formStep !== 2 && (<div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4">
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

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mt-11 mb-4">Fitness Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Gender */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                              <select
                                  name="gender"
                                  value={formData.gender}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                              {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                            </div>

                            {/* Blood Group */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                              <select
                                  name="bloodGroup"
                                  value={formData.bloodGroup}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="" disabled>Select Blood Group</option>
                                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                              {errors.bloodGroup && <span className="text-red-500 text-sm">{errors.bloodGroup}</span>}
                            </div>

                            {/* Height */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                              <input
                                  type="number"
                                  name="height"
                                  value={formData.height}
                                  onChange={handleChange}
                                  step="0.1"
                                  placeholder="Height (cm)"
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
                            </div>

                            {/* Weight */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                              <input
                                  type="number"
                                  name="weight"
                                  value={formData.weight}
                                  onChange={handleChange}
                                  step="0.1"
                                  placeholder="Weight (kg)"
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                              {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
                            </div>

                            {/* Fitness Level */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Current Fitness Level</label>
                              <select
                                  name="currentFitnessLevel"
                                  value={formData.currentFitnessLevel}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="" disabled>Select Fitness Level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                              {errors.currentFitnessLevel && <span className="text-red-500 text-sm">{errors.currentFitnessLevel}</span>}
                            </div>

                            {/* Fitness Goal */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                              <input
                                  type="text"
                                  name="fitnessGoal"
                                  value={formData.fitnessGoal}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                              {errors.fitnessGoal && <span className="text-red-500 text-sm">{errors.fitnessGoal}</span>}
                            </div>

                            {/* Health Issues */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Any Health Issues</label>
                              <input
                                  type="text"
                                  name="healthIssues"
                                  value={formData.healthIssues}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                              {errors.healthIssues && <span className="text-red-500 text-sm">{errors.healthIssues}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Next/Submit Button */}
                        {userType === "CUSTOMER" ? (
                            <div className="mt-6">
                              <button
                                  type="submit"
                                  className="bg-[#FF4500] text-white rounded-md text-base w-[200px] h-[45px] hover:bg-orange-700 font-semibold transition"
                              >
                                Register
                              </button>
                            </div>
                        ) : userType === "MEMBER" && (
                            <div className="mt-6 flex justify-end">
                              <button
                                  type="button"
                                  onClick={proceedToPayment}
                                  className="bg-[#FF4500] text-white rounded-md text-base w-[200px] h-[45px] hover:bg-orange-700 font-semibold transition"
                              >
                                Next &gt;
                              </button>
                            </div>
                        )}
                      </div>
                  )}

                  {/* Payment Section */}
                  {userType === "MEMBER" && formStep === 1.5 && (
                      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
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

                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                                  {/*<p className="text-gray-600 text-sm mt-1">{plan.features}</p>*/}
                                  <div className="mt-4 pt-2 border-t border-gray-100">
                                    <p className="text-xl font-bold text-blue-600">Rs.{plan.plan_price}</p>
                                    <p className="text-sm text-gray-500">Duration: {plan.plan_duration}</p>
                                  </div>
                                </div>
                            ))}
                          </div>

                          {errors.plan_id && <span className="text-red-500 text-sm block mt-2">{errors.plan_id}</span>}
                        </div>
                      </div>
                  )}

                  {/* Payment Success Message - Add this code in the appropriate section of your form */}
                  {userType === "MEMBER" && (formStep === 3 || showBill) && (
                      <>
                        {showBill ? (
                            <Bill
                                memberDetails={{
                                  username: formData.username,
                                  fullname: formData.fullname,
                                  email: formData.email,
                                  contactNo: formData.contactNo,
                                  address: formData.address
                                }}
                                planDetails={selectedPlan}
                                paymentDetails={paymentDetails}
                            />
                        ) : (
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 mb-6">
                              <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                  <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                              </div>

                              {selectedPlan && (
                                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                                    <h4 className="text-lg font-medium mb-3">Your Purchased Plan</h4>
                                    <div className="flex justify-between mb-2">
                                      <span className="text-gray-600">Plan:</span>
                                      <span className="font-medium">{selectedPlan.plan_name}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="text-gray-600">Duration:</span>
                                      <span>{selectedPlan.plan_duration}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                      <span>Total Paid:</span>
                                      <span className="text-[#FF4500]">Rs.{selectedPlan.plan_price}</span>
                                    </div>
                                  </div>
                              )}

                              <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => setShowBill(true)}
                                    className="bg-[#FF4500] text-white rounded-md text-base w-[200px] h-[45px] hover:bg-[#6e0404] font-semibold transition"
                                >
                                  View Invoice
                                </button>
                              </div>
                            </div>
                        )}
                      </>
                  )}
                </form>
              </div>
              )}

              {formStep === 2 && (
                  <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto">
                    <div className="flex-1 ">
                      <PaymentPage
                          selectedPlan={selectedPlan}
                          onBack={() => setFormStep(1.5)}
                          onPaymentSuccess={async () => {
                            const registrationSuccess = await completeRegistration();
                            if (registrationSuccess) {
                              setFormStep(3);
                            }
                          }}
                      />
                    </div>

                    {/* Right: Summary Box */}
                    <div className="w-full md:w-[300px] bg-white rounded-md shadow border p-4 h-fit">
                      <h3 className="text-lg font-medium border-b pb-2 mb-4">Your Order</h3>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-1">Total amount</p>
                        <p className="text-2xl font-semibold text-gray-800">Rs.{selectedPlan.plan_price}</p>
                      </div>
                    </div>

                  </div>
              )}


              {userType === "MEMBER" && formStep === 1.5 && selectedPlan && (
                  <div>
                    <div className="bg-gray-50 p-5 border rounded-lg mt-10">
                      <h4 className="text-lg font-semibold mb-3">Payment Summary</h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{selectedPlan.plan_name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Duration:</span>
                        <span>{selectedPlan.plan_duration}</span>
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

                    {/* Proceed to Pay Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                          type="button"
                          onClick={handleProceedToPay}
                          className={`bg-[#FF4500] text-white rounded-md text-base w-[200px] h-[45px] font-semibold transition hover:bg-[#6e0404] ${
                              loadingToPayment ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={loadingToPayment}
                      >
                        {loadingToPayment ? 'Processing...' : 'Proceed to Pay'}
                      </button>

                    </div>
                  </div>
              )}
              <div className="text-center mt-4">
                <p className="text-white text-sm">Already have an account? <a href="/login" className="text-orange-400 hover:underline">Login here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Signup;
