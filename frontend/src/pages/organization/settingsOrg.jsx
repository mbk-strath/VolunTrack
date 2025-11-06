import React, { useState } from "react";
import { User, Users, Lock } from "lucide-react";
import "../../styles/organization/settingsOrg.css";

const SettingsOrg = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User /> },
    { id: "contacts", label: "Contacts", icon: <Users /> },
    { id: "account", label: "Account", icon: <Lock /> },
  ];

  return (
    <div className="settings-container">
      {/* Sidebar Tabs */}
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

      {/* Content Section */}
      <div className="settings-content">
        {activeTab === "profile" && (
          <div className="settings-card">
            <h2>Profile</h2>
            <div className="avatar-section">
              <div className="avatar-circle">👤</div>
              <div className="avatar-buttons">
                <button className="btn primary">Update Avatar</button>
                <button className="btn outline">Delete Avatar</button>
              </div>
            </div>

            <form className="form-grid">
              <label>
                Organization Name
                <input placeholder="Enter organization name" />
              </label>
              <label>
                Email Address
                <input placeholder="Enter your email" />
              </label>
              <label>
                Phone Number
                <input placeholder="Enter phone number" />
              </label>
              <label>
                Country
                <input placeholder="Enter your country" />
              </label>
              <label>
                Website URL
                <input placeholder="http://..." />
              </label>
              <label>
                Organization Type
                <input placeholder="Enter organization type" />
              </label>
              <label>
                City/Town
                <input placeholder="Enter city of operation" />
              </label>
              <label>
                Address
                <input placeholder="Enter address" />
              </label>
              <label>
                Registration Number
                <input placeholder="Enter registration number" />
              </label>
              <label>
                Focus Areas
                <input placeholder="Enter area of focus" />
              </label>
            </form>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="settings-card">
            <h2>Contact Personal Details</h2>
            <form className="form-column">
              <label>
                Full Name
                <input placeholder="Enter your name" />
              </label>
              <label>
                Email Address
                <input placeholder="Enter your email" />
              </label>
              <label>
                Phone Number
                <input placeholder="Enter phone number" />
              </label>
              <label>
                Role
                <input placeholder="Enter your role" />
              </label>
              <button className="btn primary full">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === "account" && (
          <div className="settings-card">
            <h2>Account Settings</h2>
            <form className="form-column">
              <label>
                Current Password
                <input type="password" placeholder="********" />
              </label>
              <label>
                New Password
                <input type="password" placeholder="********" />
              </label>
              <label>
                Confirm Password
                <input type="password" placeholder="********" />
              </label>
              <button className="btn primary full">Save Changes</button>
            </form>

            <div className="danger-zone">
              <h3>Delete Account</h3>
              <p>
                This is a permanent action. Once deleted, all your information will be lost.
              </p>
              <button className="btn danger">Delete Account</button>
            </div>

            <div className="danger-zone">
              <h3>Log Out</h3>
              <p>You will be logged out from your account.</p>
              <button className="btn danger">Log Out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsOrg;
