import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import "../../styles/main/signup.css";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "", backend: "" });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = res.data;

      if (data.user || res.status === 201) {
        setMessage(
          "Registration successful! Check your email to verify account! Redirecting to login..."
        );
        setFormData({ name: "", email: "", password: "", role: "" });
        setErrors({});

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors({ backend: data.message || "Registration failed" });
      }
    } catch (err) {
      console.error("Axios error:", err);
      if (err.response && err.response.data) {
        setErrors({
          backend: err.response.data.message || "Registration failed",
        });
      } else {
        setErrors({ backend: "Server error. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupPage">
      <form className="signupForm" onSubmit={handleSubmit}>
        <h2 className="title">Signup</h2>

        {errors.backend && <p className="errors">{errors.backend}</p>}
        {message && <p className="successMessage">{message}</p>}

        <div className="labels">
          <div className="flex">
            <label>
              Full Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={loading}
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
                disabled={loading}
              />
              {errors.email && <p className="errors">{errors.email}</p>}
            </label>
          </div>

          <div className="flex">
            <label className="role-label">
              Role
              <select
                name="role"
                className="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Role</option>
                <option value="volunteer">Volunteer</option>
                <option value="organisation">Organisation</option>
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
                disabled={loading}
              />
              {errors.password && <p className="errors">{errors.password}</p>}
            </label>
          </div>

          <button type="submit" className="loginBtn" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>

          <div className="or">
            <hr />
            <p>or</p>
            <hr />
          </div>

          <button
            type="button"
            className="googleBtn googleSignup"
            disabled={loading}
          >
            <FcGoogle />
            Continue with Google
          </button>
        </div>

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
