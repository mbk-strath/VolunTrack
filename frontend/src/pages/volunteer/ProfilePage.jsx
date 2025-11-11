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
    country: "",
    bio: "",
    avatar: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" }); // success | error
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        gender: parsedUser.gender || "",
        country: parsedUser.country || "",
        bio: parsedUser.bio || "",
        avatar: parsedUser.avatar || "",
        date: parsedUser.date || "",
      });
      setAvatarPreview(parsedUser.avatar || "");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
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
      const id = storedUser?.id;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("gender", user.gender);
      formData.append("country", user.country);
      formData.append("bio", user.bio);
      formData.append("date", user.date);
      if (user.avatar instanceof File) {
        formData.append("profile_image", user.avatar);
      }

      const res = await axios.patch(
        `http://localhost:8000/api/update-user/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = res.data.user || res.data || {};

      setUser((prev) => ({
        name: updatedUser.name || prev.name || "",
        email: updatedUser.email || prev.email || "",
        phone: updatedUser.phone || prev.phone || "",
        gender: updatedUser.gender || prev.gender || "",
        country: updatedUser.country || prev.country || "",
        bio: updatedUser.bio || prev.bio || "",
        avatar: updatedUser.avatar || prev.avatar || "",
        date: updatedUser.date || prev.date || "",
      }));

      setAvatarPreview(updatedUser.avatar ? updatedUser.avatar : avatarPreview);

      // Save updated user to localStorage
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));

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
      {/* Alert box */}
      {alert.message && (
        <div className={`custom-alert ${alert.type}`}>{alert.message}</div>
      )}

      <div className="profile">
        <UserProfile
          name={user.name || "User"}
          avatar={avatarPreview}
          className="prof"
          size={100}
        />

        <input
          type="file"
          id="avatarInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleAvatarChange}
        />

        <button onClick={() => document.getElementById("avatarInput").click()}>
          Update Avatar
        </button>
        <button
          onClick={() => {
            setUser((prev) => ({ ...prev, avatar: "" }));
            setAvatarPreview("");
          }}
        >
          Delete Avatar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="fit">
          <div className="flex">
            <div className="left-content">
              <label>
                Full Name
                <input type="text" name="name" value={user.name} readOnly />
              </label>

              <label>
                Email
                <input type="email" name="email" value={user.email} readOnly />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={user.phone || ""}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="right-content">
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

              <label>
                Country
                <input
                  type="text"
                  name="country"
                  value={user.country || ""}
                  placeholder="Enter your country"
                  onChange={handleChange}
                />
              </label>

              <label>
                Date of Birth
                <input
                  type="date"
                  name="date"
                  value={user.date || ""}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <label className="bio">
            Bio
            <textarea
              name="bio"
              value={user.bio || ""}
              placeholder="Tell us about yourself..."
              onChange={handleChange}
            ></textarea>
          </label>
        </div>

        <button className="save" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
