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

  // --- Field definitions ---
  const userFields = ["name", "email", "gender", "phone"];
  const orgFields = [
    "org_name",
    "country",
    "website",
    "org_type",
    "city",
    "address",
    "reg_number", // Note: your controller validates 'reg_no', not 'reg_number'
    "focus_area",
    "logo",
  ];

  // --- State ---
  const [profileData, setProfileData] = useState(
    [...userFields, ...orgFields].reduce(
      (acc, field) => ({ ...acc, [field]: "" }),
      {}
    )
  );

  const [avatarPreview, setAvatarPreview] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  // --- Prefill from localStorage ---
  useEffect(() => {
    setProfileData({
      ...profileData,
      ...userFields.reduce(
        (acc, key) => ({ ...acc, [key]: storedUser[key] || "" }),
        {}
      ),
      ...orgFields.reduce(
        (acc, key) => ({ ...acc, [key]: storedUser[key] || "" }),
        {}
      ),
    });
    setAvatarPreview(storedUser.logo_url || storedUser.logo || ""); // Use logo_url if available
  }, []);

  // --- Handlers ---
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setProfileData((prev) => ({ ...prev, [name]: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Profile Form Submit (organization info) ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      orgFields.forEach((key) => {
        if (profileData[key] !== null && profileData[key] !== "") {
          formData.append(key, profileData[key]);
        }
      });

      // --- CHANGE 1: Add this line for method spoofing ---
      formData.append("_method", "PUT");

      // --- CHANGE 2: Use axios.post instead of axios.patch/put ---
      const res = await axios.post(
        `http://localhost:8000/api/update/${storedUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // --- CHANGE 3: Update localStorage and state from the nested 'organisation' object ---
      const updatedOrg = res.data.organisation || {};
      const updatedUser = { ...storedUser, ...updatedOrg };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfileData((prev) => ({ ...prev, ...updatedUser }));

      // --- CHANGE 4: Use the 'logo_url' from the response for the preview ---
      if (updatedOrg.logo_url) {
        setAvatarPreview(updatedOrg.logo_url);
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // --- Contacts Tab handlers using update-user API ---
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        gender: profileData.gender,
      };

      const res = await axios.put(
        `http://localhost:8000/api/update-user/${storedUser.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfileData((prev) => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
      }));

      setMessage("Contact details updated successfully!");
    } catch (err) {
      console.error("Contact update error:", err);
      setMessage(
        err.response?.data?.message || "Failed to update contact details"
      );
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
            className={`tab-btnn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content-org">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="settings-card-org prof-org">
            <h2 className="prof-org-title">Organization Profile</h2>

            <div className="avatar-section">
              <UserProfile
                name={profileData.org_name || "Organization"}
                avatar={avatarPreview}
                size={100}
              />
              <input
                type="file"
                name="logo"
                accept="image/*"
                style={{ display: "none" }}
                id="avatarInput"
                onChange={handleProfileChange}
              />
              <div className="avatar-buttons">
                <button
                  type="button"
                  onClick={() => document.getElementById("avatarInput").click()}
                >
                  Update Avatar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileData((prev) => ({ ...prev, logo: null }));
                    setAvatarPreview("");
                  }}
                >
                  Delete Avatar
                </button>
              </div>
            </div>

            <form className="form-grid" onSubmit={handleProfileSubmit}>
              {orgFields
                .filter((key) => key !== "logo")
                .map((key) => (
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>

            {message && <p className="update-message">{message}</p>}
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === "contacts" && (
          <div className="settings-card-org cont-org">
            <h2 className="prof-org-title">Contact Person Details</h2>
            <form className="form-column" onSubmit={handleContactSubmit}>
              {["name", "email", "phone", "gender"].map((field) => (
                <label key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {field === "gender" ? (
                    <select
                      name={field}
                      value={profileData[field] || ""}
                      onChange={handleContactChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  ) : (
                    <input
                      name={field}
                      value={profileData[field] || ""}
                      onChange={handleContactChange}
                    />
                  )}
                </label>
              ))}

              <button type="submit" className="save-cont" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
            {message && <p className="update-message">{message}</p>}
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === "account" && <AccountPage />}
      </div>
    </div>
  );
};

export default SettingsOrg;
