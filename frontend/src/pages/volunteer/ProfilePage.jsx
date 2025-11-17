import React, { useState, useEffect } from "react";
import "../../styles/volunteer/profileVol.css";
import UserProfile from "../../components/main/UserProfile";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        id: storedUser.id,
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        gender: storedUser.gender || "",
      });
    }
  }, []);

  // Form handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Alerts
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 2500);
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
      };

      const res = await axios.put(
        `http://localhost:8000/api/update-user/${user.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Backend returns: { message, user }
      const updatedUser = res.data.user;

      // Save fresh updated user to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update UI
      setUser(updatedUser);

      showAlert("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Update error:", err);
      showAlert(
        err.response?.data?.message || "Failed to update profile. Try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profilePage">
      {alert.message && (
        <div className={`custom-alert ${alert.type}`}>{alert.message}</div>
      )}

      <div className="profile">
        <UserProfile
          name={user.name || "User"}
          avatar={user.avatar || ""}
          className="prof"
          size={100}
        />
      </div>

      <form onSubmit={handleSubmit} className="form-column">
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender
          <select name="gender" value={user.gender} onChange={handleChange}>
            <option value="">Select…</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>

        <button className="save" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
