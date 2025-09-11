import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import "../styles/signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "", backend: "" }); // clear field errors
  };

  // Frontend validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.role) newErrors.role = "Role is required";

    return newErrors;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/IAP_VOLUNTRACK_GRP_A13/backend/register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message);
        setFormData({ name: "", email: "", password: "", role: "" });
        setErrors({});
      } else {
        setErrors({ backend: result.message });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErrors({ backend: "Network or server error. Please try again." });
    }
  };

  return (
    <div className="signupPage">
      <img src={Logo} alt="logo" className="logo" />
      <form className="signupForm" onSubmit={handleSubmit}>
        <h2 className="title">Signup</h2>

        {/* Backend errors */}
        {errors.backend && <p className="errors">{errors.backend}</p>}

        <div className="labels">
          <label htmlFor="name">
            Full Name
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name/organization name"
            />
            {errors.name && <p className="errors">{errors.name}</p>}
          </label>

          <label htmlFor="email">
            Email Address
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="errors">{errors.email}</p>}
          </label>

          <label htmlFor="role">
            Role
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="volunteer">Volunteer</option>
              <option value="organization">Organization</option>
            </select>
            {errors.role && <p className="errors">{errors.role}</p>}
          </label>

          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <p className="errors">{errors.password}</p>}
          </label>
        </div>

        <button type="submit" className="loginBtn">
          Signup
        </button>

        <div className="or">
          <hr />
          <p>or</p>
          <hr />
        </div>

        <button type="button" className="googleBtn">
          <FcGoogle />
          Continue with Google
        </button>

        <p className="noAccount">
          Have an Account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
