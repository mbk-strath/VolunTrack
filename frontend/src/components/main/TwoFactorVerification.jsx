import React, { useState } from "react";
import "../../styles/main/two-factor.css";
const TwoFactorVerification = ({ onVerify, onResend, isLoading = false }) => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [resendMessage, setResendMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits, max 6
    setCode(value);
    if (errors.code) {
      setErrors({ ...errors, code: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      setErrors({ code: "Please enter a 6-digit code" });
      return;
    }

    onVerify(code);
  };

  const handleResend = async () => {
    try {
      await onResend();
      setResendMessage("A new code has been sent to your email.");
      setTimeout(() => setResendMessage(""), 5000);
    } catch (error) {
      setErrors({ general: "Failed to resend code. Please try again." });
    }
  };

  return (
    <div className="two-factor-contain">
      <div className="two-factor-header">
        <h2>Two-Factor Authentication</h2>
        <p>Enter the 6-digit code sent to your email</p>
      </div>

      <form onSubmit={handleSubmit} className="two-factor-form">
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        {resendMessage && (
          <div className="success-message">{resendMessage}</div>
        )}

        <div className="input-group">
          <label htmlFor="code">Verification Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={code}
            onChange={handleChange}
            placeholder="000000"
            maxLength="6"
            className={errors.code ? "error" : ""}
            disabled={isLoading}
          />
          {errors.code && <span className="error-text">{errors.code}</span>}
        </div>

        <button
          type="submit"
          className="verify-btn"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <div className="two-factor-footer">
        <p>Didn't receive the code?</p>
        <button
          type="button"
          className="resend-btn"
          onClick={handleResend}
          disabled={isLoading}
        >
          Resend Code
        </button>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
