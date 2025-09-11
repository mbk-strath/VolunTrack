import React from "react";
import Logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import "../styles/login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Form submitted ✅", formData);
    }
  };

  return (
    <div className="loginPage">
      <img src={Logo} alt="logo" className="logo" />
      <form action="" className="loginForm" onSubmit={handleSubmit}>
        <h2 className="title">Login</h2>
        <div className="labels">
          <label htmlFor="email">
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
            {errors.email && <p className="errors">{errors.email}</p>}
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
            {errors.password && <p className="errors">{errors.password}</p>}
          </label>
        </div>

        <button type="submit" className="loginBtn">
          Login
        </button>
        <div className="or">
          <hr />
          <p>or</p>

          <hr />
        </div>
        <button className="googleBtn">
          <FcGoogle />
          Continue with google
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
