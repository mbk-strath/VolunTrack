import React, { useState, useEffect } from "react";
import "../../styles/volunteer/profileVol.css";
import UserProfile from "../../components/main/UserProfile";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        gender: parsedUser.gender || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("gender", user.gender);

      const res = await axios.patch(
        `http://localhost:8000/api/update-user/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = res.data.user || res.data;
      setUser((prev) => ({ ...prev, ...updatedUser }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedUser })
      );

      showAlert("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Profile update error:", err);
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
            value={user.phone || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender
          <select
            name="gender"
            value={user.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
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
