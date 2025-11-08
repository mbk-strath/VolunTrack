import React, { useState, useEffect } from "react";
import { User, Users, Lock } from "lucide-react";
import axios from "axios";
import "../../styles/organization/settingsOrg.css";
import UserProfile from "../../components/main/UserProfile";
import AccountPage from "../volunteer/AccountPage";

const SettingsOrg = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- Editable fields ---
  const profileFields = [
    "org_name",
    "email",
    "phone",
    "country",
    "website",
    "org_type",
    "city",
    "address",
    "reg_number",
    "focus_areas",
  ];

  const contactFields = ["name", "email", "phone", "role"];

  // --- State for Profile ---
  const [profileData, setProfileData] = useState(
    profileFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const [avatarPreview, setAvatarPreview] = useState(null);

  // --- State for Contacts ---
  const [contactData, setContactData] = useState(
    contactFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );

  // Prefill from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    // Profile
    setProfileData((prev) => ({
      ...prev,
      ...profileFields.reduce(
        (acc, key) => ({ ...acc, [key]: storedUser[key] || "" }),
        {}
      ),
    }));
    setAvatarPreview(storedUser.avatar || "");

    // Contacts
    setContactData((prev) => ({
      ...prev,
      ...contactFields.reduce(
        (acc, key) => ({ ...acc, [key]: storedUser[key] || "" }),
        {}
      ),
    }));
  }, []);

  // --- Handlers ---
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfileData((prev) => ({ ...prev, [name]: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      const token = localStorage.getItem("token");

      const payload = new FormData();
      profileFields.forEach((key) => {
        if (profileData[key]) payload.append(key, profileData[key]);
      });
      if (profileData.profile_image)
        payload.append("profile_image", profileData.profile_image);

      const res = await axios.patch(
        `http://localhost:8000/api/update-user/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = res.data.user || res.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedUser })
      );
      setProfileData((prev) => ({ ...prev, ...updatedUser }));
      setAvatarPreview(updatedUser.avatar || avatarPreview);
      setMessage(res.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      const token = localStorage.getItem("token");

      const payload = { ...contactData };

      const res = await axios.patch(
        `http://localhost:8000/api/update-user/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data.user || res.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedUser })
      );
      setContactData((prev) => ({ ...prev, ...updatedUser }));
      setMessage(res.data.message || "Contacts updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setMessage(err.response?.data?.message || "Failed to update contacts.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User /> },
    { id: "contacts", label: "Contacts", icon: <Users /> },
    { id: "account", label: "Account", icon: <Lock /> },
  ];

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content-org">
        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="settings-card-org prof-org">
            <h2 className="prof-org-title">Profile</h2>

            <div className="avatar-section">
              <UserProfile
                name={profileData.org_name}
                avatar={avatarPreview}
                size={100}
              />
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                style={{ display: "none" }}
                id="avatarInput"
                onChange={handleProfileChange}
              />
              <div className="avatar-buttons">
                <button
                  onClick={() => document.getElementById("avatarInput").click()}
                >
                  Update Avatar
                </button>
                <button
                  onClick={() => {
                    setProfileData((prev) => ({
                      ...prev,
                      profile_image: null,
                    }));
                    setAvatarPreview("");
                  }}
                >
                  Delete Avatar
                </button>
              </div>
            </div>

            <form className="form-grid" onSubmit={handleProfileSubmit}>
              {profileFields.map((key) => (
                <label key={key}>
                  {key
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  <input
                    name={key}
                    placeholder={`Enter ${key.replace("_", " ")}`}
                    value={profileData[key] || ""}
                    onChange={handleProfileChange}
                  />
                </label>
              ))}

              <button className="save-org" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </form>

            {message && <p className="update-message">{message}</p>}
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === "contacts" && (
          <div className="settings-card-org cont-org">
            <h2 className="prof-org-title">Contact Personal Details</h2>

            <form className="form-column" onSubmit={handleContactSubmit}>
              {contactFields.map((field) => (
                <label key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <input
                    name={field}
                    placeholder={`Enter your ${field}`}
                    value={contactData[field] || ""}
                    onChange={handleContactChange}
                  />
                </label>
              ))}

              <button type="submit" className="save-cont" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>

            {message && <p className="update-message">{message}</p>}
          </div>
        )}

        {/* ACCOUNT */}
        {activeTab === "account" && <AccountPage />}
      </div>
    </div>
  );
};

export default SettingsOrg;
