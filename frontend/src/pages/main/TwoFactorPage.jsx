import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TwoFactorVerification from "../../components/main/TwoFactorVerification";
import "../../styles/main/two-factor.css";
import axios from "axios";

const TwoFactorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // email passed from login

  // If email is not passed, redirect to login
  if (!email) {
    navigate("/login");
  }

  const handleVerifyCode = async (code) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
        email,
        otp: code,
      });

      const data = res.data;
      console.log("OTP Verification response:", data);

      // Save user + token from backend response
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate based on role
      const role = data.user?.role?.toLowerCase();

      switch (role) {
        case "volunteer":
          navigate("/dashboard/volunteer");
          break;
        case "organisation":
          navigate("/dashboard/organisation");
          break;
        case "admin":
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid verification code");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/resend-otp", {
        email,
      });

      if (res.status === 200) {
        return true;
      } else {
        setError(res.data.message || "Failed to resend code");
        return false;
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="main">
      <div className="two-factor-container">
        <div className="two-factor-card">
          {error && <div className="error-message">{error}</div>}

          <TwoFactorVerification
            onVerify={handleVerifyCode}
            onResend={handleResendCode}
            isLoading={isLoading}
          />

          <div className="two-factor-footer">
            <button
              type="button"
              className="back-to-login-btn"
              onClick={handleBackToLogin}
              disabled={isLoading}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorPage;
