import React, { useState, useEffect } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [userType, setUserType] = useState("MEMBER");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [membershipTypes, setMembershipTypes] = useState([]); // State to store membership types
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
    membershipType: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/members/membership-types");
        setMembershipTypes(response.data); // Store membership types in the state
      } catch (error) {
        console.error("Error fetching membership types:", error);
      }
    };
    fetchMembershipTypes();
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "User Name is required.";
    if (!formData.fullname.trim())
      newErrors.fullname = "Full Name is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email format is invalid.";
    if (!formData.contactNo)
      newErrors.contactNo = "Contact Number is required.";
    else if (!/^\d{10}$/.test(formData.contactNo))
      newErrors.contactNo = "Contact Number must be 10 digits.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";

    if (userType === "MEMBER") {
      if (!dob) newErrors.dob = "Date of Birth is required.";
      if (!formData.gender) newErrors.gender = "Gender is required.";
      if (!formData.height) newErrors.height = "Height is required.";
      else if (!/^\d+(\.\d+)?$/.test(formData.height))
        newErrors.height = "Height must be a valid number.";
      if (!formData.weight) newErrors.weight = "Weight is required.";
      else if (!/^\d+(\.\d+)?$/.test(formData.weight))
        newErrors.weight = "Weight must be a valid number.";
      if (!formData.membershipType)
        newErrors.membershipType = "Membership Type is required.";
      if (!formData.bloodGroup)
        newErrors.bloodGroup = "Blood Group is required.";
      if (!formData.fitnessGoal)
        newErrors.fitnessGoal = "Fitness Goal is required.";
      if (!formData.currentFitnessLevel)
        newErrors.currentFitnessLevel = "Current Fitness Level is required.";
      if (!formData.healthIssues)
        newErrors.healthIssues =
          "Please specify if there are any health issues.";
    }

    setErrors(newErrors);
    console.log("Errors:::", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValidForm = validateForm();
    if (isValidForm) {
      try {
        const response = await axios.post(
            "http://localhost:8800/api/auth/register",
            {...formData, userType: userType}

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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
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
                <div className="input-field">
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

              <div className="form-group">
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

              <div className="form-group">
                <label>Any Health Issues</label>

                <input
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
                <div className="input-field">
                  <select
                      name="membershipType"
                      value={formData.membershipType}
                      onChange={handleChange}
                      required
                  >
                    <option value="" disabled>
                      Select Membership Type
                    </option>
                    {membershipTypes.map((type) => (
                        <option key={type.plan_id} value={type.plan_id}>
                          {type.plan_name} {/* Assuming 'type.id' is the ID and 'type.name' is the name */}
                        </option>
                    ))}
                  </select>
                  {errors.membershipType && (
                      <span className="error">{errors.membershipType}</span>
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
