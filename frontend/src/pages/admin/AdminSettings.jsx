import React from "react";
import "../../styles/admin/settings.css"; 


const AdminSettings = () => {
  return (
    <div className="settings-container">
      <h2 className="settings-title">Account Settings</h2>

      {/* Change Password Card */}
      <div className="settings-card">
        <h3>Change Password</h3>
        <form className="password-form">
          <label>Current password</label>
          <input type="password" placeholder="Enter current password" />

          <label>New password</label>
          <input type="password" placeholder="Enter new password" />

          <label>Confirm password</label>
          <input type="password" placeholder="Confirm new password" />

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>

      {/* Delete Account Card */}
      <div className="settings-card danger-card">
        <h3>Delete Account</h3>
        <p>
          Deleting your account is a permanent action. Once deleted, you will no
          longer be able to access your account or any of your personal information.
          This action cannot be undone.
        </p>
        <button className="delete-btn">Delete Account</button>
      </div>

      {/* Log Out Card */}
      <div className="settings-card danger-card">
        <h3>Log Out</h3>
        <p>
          Logging out will end your session. Once logged out, you’ll need to sign in
          again to access your account.
        </p>
        <button className="logout-btn">Log Out</button>
      </div>
    </div>
  );
};

export default AdminSettings;
