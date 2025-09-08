import React from "react";
import Logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import "../styles/login.css";
import { Link } from "react-router-dom";
function Login() {
  return (
    <div className="loginPage">
      <img src={Logo} alt="logo" className="logo" />
      <form action="" className="loginForm">
        <h2 className="title">Login</h2>
        <div className="labels">
          <label htmlFor="email">
            Email Address
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />
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
