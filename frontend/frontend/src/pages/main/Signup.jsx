import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import "../../styles/main/signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "", backend: "" }); // clear individual field errors
  };

  // Basic frontend validation
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
  const handleSubmit = (e) => {
    e.preventDefault();

    // Run frontend validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Send POST request to Laravel API
    fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setMessage("Registered successfully!");
          setFormData({ name: "", email: "", password: "", role: "" });
          setErrors({});
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setErrors({ backend: data.message || "Registration failed" });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setErrors({ backend: "Server error. Please try again." });
      });
  };

  return (
    <div className="signupPage">
      <img src={Logo} alt="logo" className="logo-sign" />
      <form className="signupForm" onSubmit={handleSubmit}>
        <h2 className="title">Signup</h2>

        {errors.backend && <p className="errors">{errors.backend}</p>}

        <div className="labels">
          <div className="flex">
            <label>
              Full Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && <p className="errors">{errors.name}</p>}
            </label>

            <label>
              Email
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <p className="errors">{errors.email}</p>}
            </label>
          </div>
          <div className="flex">
            <label>
              Role
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="volunteer">Volunteer</option>
                <option value="organization">Organization</option>
              </select>
              {errors.role && <p className="errors">{errors.role}</p>}
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
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

          {message && <p>{message}</p>}

          <div className="or">
            <hr />
            <p>or</p>
            <hr />
          </div>

          <button type="button" className="googleBtn">
            <FcGoogle />
            Continue with Google
          </button>
        </div>
        <p className="noAccount">
          Have an Account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
