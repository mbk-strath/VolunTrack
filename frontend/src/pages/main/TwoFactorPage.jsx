import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TwoFactorVerification from "../../components/main/TwoFactorVerification";
import "../../styles/main/two-factor.css";

const TwoFactorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // email passed from login

  if (!email) {
    navigate("/login");
  }

  const handleVerifyCode = async (code) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user + token directly from backend response
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Navigate based on role
        if (data.user?.role === "volunteer") {
          navigate("/dashboard");
        } else if (data.user?.role === "student") {
          navigate("/student-dashboard");
        } else if (data.user?.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/login");
        }
      } else {
        setError(data.message || "Invalid verification code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return true;
      } else {
        setError(data.message || "Failed to resend code");
        return false;
      }
    } catch (err) {
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
