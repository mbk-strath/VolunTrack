import React, { useState } from "react";

function PasswordReset() {
  const [user, setUser] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user.currentPassword || !user.newPassword || !user.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (user.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (user.newPassword !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/update-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: user.currentPassword,
            new_password: user.newPassword,
            new_password_confirmation: user.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || " Password updated successfully!");
        setUser({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordReset">
      <form onSubmit={handleSubmit}>
        <h2>Password Reset</h2>

        <label>
          Current Password
          <input
            type="password"
            name="currentPassword"
            value={user.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            required
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            name="newPassword"
            value={user.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button type="submit" className="save" disabled={loading}>
          {loading ? "Saving..." : "Save Password"}
        </button>
      </form>
    </div>
  );
}

export default PasswordReset;
