import React, { useState } from "react";
import "../../styles/main/forgot.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "User not found");
      } else {
        setMessage("OTP sent to your email. Please check your inbox.");
        setTimeout(() => navigate("/reset-password"), 2500);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgotPage">
      <form className="forgotForm" onSubmit={handleSubmit}>
        <h2>Forgot Password?</h2>
        <p>Enter your email to receive a password reset OTP.</p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <p className="backToLogin" onClick={() => navigate("/login")}>
          ← Back to Login
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
