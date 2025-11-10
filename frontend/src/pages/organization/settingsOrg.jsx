import { useState } from "react";
import { Card, CardContent, Button, TextField } from "@mui/material";
import { User, Users, Heart, Lock } from "lucide-react";
import "../../styles/organization/settingsOrg.css";

const SettingsOrg = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "supporters", label: "Supporters", icon: Heart },
    { id: "account", label: "Account", icon: Lock },
  ];

  return (
    <div className="settings-container">
      <div className="settings-layout">
        <div className="settings-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab-btn ${
                  activeTab === tab.id ? "settings-tab-active" : ""
                }`}
              >
                <Icon className="settings-tab-icon" />
                <span className="settings-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="settings-content">
          {activeTab === "profile" && (
            <Card className="settings-card">
              <CardContent>
                <h2 className="settings-title">Organization Profile Details</h2>
                
                <div className="settings-form">
                  <div className="settings-form-row">
                    <div className="settings-form-field">
                      <label className="settings-label">Organization Name</label>
                      <TextField 
                        placeholder="Enter organization name" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <div className="settings-form-field">
                      <label className="settings-label">Email Address</label>
                      <TextField 
                        type="email" 
                        placeholder="Enter your email" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                  </div>

                  <div className="settings-form-row">
                    <div className="settings-form-field">
                      <label className="settings-label">Phone Number</label>
                      <TextField 
                        type="tel" 
                        placeholder="Enter phone number" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <div className="settings-form-field">
                      <label className="settings-label">Country</label>
                      <TextField 
                        placeholder="Enter your country" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                  </div>

                  <div className="settings-form-row">
                    <div className="settings-form-field">
                      <label className="settings-label">Website Url</label>
                      <TextField 
                        type="url" 
                        placeholder="http://..." 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <div className="settings-form-field">
                      <label className="settings-label">Organization Type</label>
                      <TextField 
                        placeholder="Enter your organization type" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                  </div>

                  <div className="settings-form-row">
                    <div className="settings-form-field">
                      <label className="settings-label">City/Town</label>
                      <TextField 
                        placeholder="Enter city of operation" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <div className="settings-form-field">
                      <label className="settings-label">Address</label>
                      <TextField 
                        placeholder="Enter address" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                  </div>

                  <div className="settings-form-row">
                    <div className="settings-form-field">
                      <label className="settings-label">Registration Number</label>
                      <TextField 
                        placeholder="Enter organisation registration number" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <div className="settings-form-field">
                      <label className="settings-label">Focus Areas</label>
                      <TextField 
                        placeholder="Enter area of focus" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                  </div>

                  <div className="settings-form-field-full">
                    <label className="settings-label">Bio</label>
                    <TextField 
                      placeholder="Tell us about your organization..." 
                      fullWidth 
                      multiline
                      rows={4}
                      className="settings-input"
                    />
                  </div>

                  <Button variant="contained" fullWidth className="settings-save-btn">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "contacts" && (
            <Card className="settings-card">
              <CardContent>
                <h2 className="settings-title">Contact Personal Details</h2>
                
                <div className="settings-form">
                  <div className="settings-form-field-full">
                    <label className="settings-label">Full Name</label>
                    <TextField 
                      placeholder="Enter your name" 
                      fullWidth 
                      size="small"
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-form-field-full">
                    <label className="settings-label">Email Address</label>
                    <TextField 
                      type="email" 
                      placeholder="Enter your email" 
                      fullWidth 
                      size="small"
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-form-field-full">
                    <label className="settings-label">Phone Number</label>
                    <TextField 
                      type="tel" 
                      placeholder="Enter phone number" 
                      fullWidth 
                      size="small"
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-form-field-full">
                    <label className="settings-label">Role</label>
                    <TextField 
                      placeholder="Enter your role" 
                      fullWidth 
                      size="small"
                      className="settings-input"
                    />
                  </div>
                  <Button variant="contained" fullWidth className="settings-save-btn">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "supporters" && (
            <Card className="settings-card">
              <CardContent>
                <h2 className="settings-title">Supporters</h2>
                <p className="settings-description">Manage your organization supporters and donors here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "account" && (
            <div className="settings-account-section">
              <Card className="settings-card">
                <CardContent>
                  <h2 className="settings-title">Change Password</h2>
                  <div className="settings-form">
                    <div className="settings-form-field-full">
                      <label className="settings-label">Current password</label>
                      <TextField 
                        type="password" 
                        placeholder="******************" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <div className="settings-form-field-full">
                      <label className="settings-label">New password</label>
                      <TextField 
                        type="password" 
                        placeholder="******************" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <div className="settings-form-field-full">
                      <label className="settings-label">Confirm password</label>
                      <TextField 
                        type="password" 
                        placeholder="******************" 
                        fullWidth 
                        size="small"
                        className="settings-input"
                      />
                    </div>
                    <Button variant="contained" fullWidth className="settings-save-btn">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="settings-card">
                <CardContent>
                  <h2 className="settings-title">Delete Account</h2>
                  <p className="settings-description">
                    Deleting your account is a permanent action. Once deleted, you will no longer be able to access your account, and all of your personal information. This action cannot be undone.
                  </p>
                  <Button variant="contained" color="error" className="settings-danger-btn">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>

              <Card className="settings-card">
                <CardContent>
                  <h2 className="settings-title">Log Out</h2>
                  <p className="settings-description">
                    Log out from your current session. You can log back in anytime.
                  </p>
                  <Button variant="outlined" className="settings-logout-btn">
                    Log Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsOrg;