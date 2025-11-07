import React, { useState } from "react";
import { User, Users, Lock } from "lucide-react";
import "../../styles/organization/settingsOrg.css";
import UserProfile from "../../components/main/UserProfile";
import AccountPage from "../volunteer/AccountPage";

const SettingsOrg = () => {
  const [activeTab, setActiveTab] = useState("profile");

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
        {activeTab === "profile" && (
          <div className="settings-card-org prof-org">
            <h2 className="prof-org-title">Profile</h2>
            <div className="avatar-section">
              <UserProfile />
              <div className="avatar-buttons">
                <button className="btn-update">Update Avatar</button>
                <button className="btn-out">Delete Avatar</button>
              </div>
            </div>

            <form className="form-grid">
              <div className="org-form">
                <label>
                  Organization Name
                  <input placeholder="Enter organization name" />
                </label>
                <label>
                  Email Address
                  <input placeholder="Enter your email" />
                </label>
                <label>
                  Phone Number <input placeholder="Enter phone number" />
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
              </div>
              <button className="save-org">Save</button>
            </form>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="settings-card-org cont-org">
            <h2 className="prof-org-title"> Contact Personal Details</h2>
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
              <button className="save-cont">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === "account" && <AccountPage />}
      </div>
    </div>
  );
};

export default SettingsOrg;
