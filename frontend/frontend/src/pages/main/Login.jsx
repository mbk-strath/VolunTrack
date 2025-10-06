import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import "../../styles/main/login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const validate = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setApiError("");
      setLoading(true);

      try {
        const res = await fetch("http://127.0.0.1:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          setApiError(data.message || "Login failed");
          return;
        }

        // ✅ Temporarily save user + token for OTP flow
        sessionStorage.setItem("pending_user", JSON.stringify(data.user));
        sessionStorage.setItem("pending_token", data.token);

        //  Redirect to OTP page
        navigate("/two-factor", { state: { email: formData.email } });
      } catch (err) {
        console.error(err);
        setApiError("Something went wrong. Try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="loginPage">
      <img src={Logo} alt="logo" className="logo-login" />
      <form className="loginForm" onSubmit={handleSubmit}>
        <h2 className="title">Login</h2>

        {apiError && <p className="errors">{apiError}</p>}
        <div className="labels">
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
          <button type="submit" className="loginBtn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="resetLinks">
            <Link className="reset">Forgotten Password?</Link>
            <Link className="show">Show Password</Link>
          </div>
        </div>

        <div className="or">
          <hr />
          <p>or</p>
          <hr />
        </div>

        <button type="button" className="googleBtn" disabled={loading}>
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
