import React, { useState, useEffect } from "react";
import TwoFactorVerification from "./TwoFactorVerification";

const TwoFactorSettings = ({ user, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEnable2FA = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/two-factor/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setShowVerification(true);
        setMessage("A verification code has been sent to your email.");
      } else {
        setError(data.message || "Failed to enable two-factor authentication");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (
      !window.confirm(
        "Are you sure you want to disable two-factor authentication? This will make your account less secure."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/two-factor/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Two-factor authentication has been disabled.");
        onUpdate({ ...user, two_factor_enabled: false });
      } else {
        setError(data.message || "Failed to disable two-factor authentication");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/two-factor/verify-enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Two-factor authentication has been successfully enabled!");
        setShowVerification(false);
        onUpdate({ ...user, two_factor_enabled: true });
      } else {
        setError(data.errors?.code?.[0] || "Invalid verification code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/two-factor/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("A new verification code has been sent to your email.");
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="settings-container">
        <div className="settings-card">
          <h2>Enable Two-Factor Authentication</h2>
          <p>Please verify your email with the code sent to {user?.email}</p>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <TwoFactorVerification
            onVerify={handleVerifyCode}
            onResend={handleResendCode}
            isLoading={isLoading}
          />

          <button
            className="cancel-btn"
            onClick={() => setShowVerification(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Two-Factor Authentication</h2>
        <p>Add an extra layer of security to your account</p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="two-factor-status">
          <div className="status-indicator">
            <span
              className={`status-dot ${
                user?.two_factor_enabled ? "enabled" : "disabled"
              }`}
            ></span>
            <span className="status-text">
              {user?.two_factor_enabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <p className="status-description">
            {user?.two_factor_enabled
              ? "Your account is protected with two-factor authentication. You will receive a verification code via email when logging in."
              : "Two-factor authentication is not enabled. Enable it to add an extra layer of security to your account."}
          </p>
        </div>

        <div className="action-buttons">
          {user?.two_factor_enabled ? (
            <button
              className="disable-btn"
              onClick={handleDisable2FA}
              disabled={isLoading}
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </button>
          ) : (
            <button
              className="enable-btn"
              onClick={handleEnable2FA}
              disabled={isLoading}
            >
              {isLoading ? "Enabling..." : "Enable 2FA"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSettings;
