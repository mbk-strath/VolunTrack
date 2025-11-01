import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import "../../styles/main/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = res.data;
      console.log("Login API response:", data);

      // Handle OTP sent response
      if (data.message === "OTP sent to email") {
        sessionStorage.setItem("otp_user_id", data.user?.id);
        navigate("/two-factor");
        return;
      }

      // Normal login
      sessionStorage.setItem("user", JSON.stringify(data.user));
      const role = (data.user.role || "").trim().toLowerCase();
      console.log("Role after processing:", `"${role}"`);
      if (role === "volunteer") {
        navigate("/dashboard/volunteer");
      } else if (role === "organisation" || role === "organization") {
        navigate("/dashboard/organization");
      } else if (role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Axios login error:", err);
      if (err.response && err.response.data) {
        setApiError(err.response.data.message || "Login failed");
      } else {
        setApiError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h2 className="title">Login</h2>

        {apiError && <p className="errors">{apiError}</p>}

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          id="email"
          placeholder="Enter your email"
          onChange={handleChange}
          disabled={loading}
        />
        {errors.email && <p className="errors">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          id="password"
          placeholder="Enter your password"
          onChange={handleChange}
          disabled={loading}
        />
        {errors.password && <p className="errors">{errors.password}</p>}

        <button
          type="submit"
          className="loginBtn loginBtnForm"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="resetLinks">
          <Link className="reset" to="/password-reset">
            Forgotten Password?
          </Link>
          <Link className="show">Show Password</Link>
        </div>

        <div className="or">
          <hr />
          <p>or</p>
          <hr />
        </div>

        <button
          type="button"
          className="googleBtn googlelogin"
          disabled={loading}
        >
          <FcGoogle />
          Continue with Google
        </button>

        <p className="noAccount">
          Don't Have an Account?
          <Link to="/signup" className="link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
