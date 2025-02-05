import React, { useState, useEffect } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [userType, setUserType] = useState("MEMBER");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [plans, setPlans] = useState([]); // State to store membership types
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
        setPlans(response.data); // Store membership plans in the state
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValidForm = validateForm();
    if (isValidForm) {
      try {
        const response = await axios.post(
            "http://localhost:8800/api/auth/register",
            {...formData, userType: userType, dob: dob, age: age},

        );
        alert(response.data); // Success message
        navigate("/login"); // Redirect to login
      } catch (error) {
        alert(error.response?.data || "Registration failed.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="SignUp-title">Sign Up</div>

        <div className="user-type">
          <label>
            <input
              type="radio"
              name="userType"
              value="MEMBER"
              checked={userType === "MEMBER"}
              onChange={handleUserTypeChange}
            />
            As a member
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="CUSTOMER"
              checked={userType === "CUSTOMER"}
              onChange={handleUserTypeChange}
            />
            As a customer
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>
            <div className="input-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <div className="input-field">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
              />
              {errors.fullname && (
                <span className="error">{errors.fullname}</span>
              )}
            </div>
            <div className="input-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="input-field">
              <label>Contact No</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="Contact No"
              />
              {errors.contactNo && (
                <span className="error">{errors.contactNo}</span>
              )}
            </div>
            <div className="input-field">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </div>
          </div>

          {userType === "MEMBER" && (
            <>
              <div className="form-group">
                <div className="input-field">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={handleDobChange}
                    required
                  />
                  {errors.dob && <span className="error">{errors.dob}</span>}
                </div>
                <div className="input-field">
                  <label>Age</label>
                  <input type="number" value={age} readOnly placeholder="Age" />
                </div>
              </div>

              <div className="form-group">
                <div className="input-field">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <span className="error">{errors.gender}</span>
                  )}
                </div>

                <div className="input-field">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Blood Group
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  {errors.bloodGroup && (
                    <span className="error">{errors.bloodGroup}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="input-field">
                  <label>Height</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Height (cm)"
                    step="0.1"
                  />
                  {errors.height && (
                    <span className="error">{errors.height}</span>
                  )}
                </div>
                <div className="input-field">
                  <label>Weight</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Weight (kg)"
                    step="0.1"
                  />
                  {errors.weight && (
                    <span className="error">{errors.weight}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Current Fitness Level</label>
                <div className="input-field1">
                  <select
                    name="currentFitnessLevel"
                    value={formData.currentFitnessLevel}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Fitness Level
                    </option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {errors.currentFitnessLevel && (
                    <span className="error">{errors.currentFitnessLevel}</span>
                  )}
                </div>{" "}
              </div>

              <div className="form-group1">
                <label>Fitness Goal</label>
                <input
                  type="text"
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  placeholder="E.g., Lose weight, Build muscle"
                />
                {errors.fitnessGoal && (
                  <span className="error">{errors.fitnessGoal}</span>
                )}
              </div>

              <div className="form-group1">
                <label>Any Health Issues</label>

                <input sx={{width:"500px",}}
                  type="text"
                  name="healthIssues"
                  value={formData.healthIssues}
                  onChange={handleChange}
                  placeholder="E.g., E.g., Asthma, Back pain, None"
                />
                {errors.healthIssues && (
                  <span className="error">{errors.healthIssues}</span>
                )}
              </div>

              <div className="form-group">
                <label>Membership Type</label>
                <div className="input-field1">
                  <select
                      name="plan_id"
                      value={formData.plan_id}
                      onChange={handleChange}
                      required
                  >
                    <option value="" disabled>
                      Select Membership Plan
                    </option>
                    {plans.map((type) => (
                        <option key={type.plan_id} value={type.plan_id}>
                          {type.plan_name} {/* Assuming 'type.id' is the ID and 'type.name' is the name */}
                        </option>
                    ))}
                  </select>
                  {errors.plan_id && (
                      <span className="error">{errors.plan_id}</span>
                  )}
                </div>
              </div>
            </>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
