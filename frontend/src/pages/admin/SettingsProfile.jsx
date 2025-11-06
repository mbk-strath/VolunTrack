import React, { useState } from "react";
import "../../styles/admin/settprofile.css";

const AdminSettingsProfile = () => {
  const [avatar, setAvatar] = useState(null);

  // Handle avatar image upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); // show preview
    }
  };

  // Handle delete avatar
  const handleDeleteAvatar = () => {
    setAvatar(null);
  };

  return (
    <div className="settings-profile-container">
      {/* Avatar Section */}
      <div className="profile-avatar-section">
        <div className="avatar-wrapper">
          <div className="avatar-placeholder">
            {avatar ? (
              <img src={avatar} alt="Avatar Preview" />
            ) : (
              <span className="avatar-initial">+</span>
            )}
            {/* Hidden File Input */}
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
            <label htmlFor="avatarInput" className="camera-icon">
              📷
            </label>
          </div>
        </div>

        {/* Avatar Action Buttons */}
        <div className="avatar-buttons">
          <button onClick={() => document.getElementById("avatarInput").click()}>
            Update Avatar
          </button>
          <button onClick={handleDeleteAvatar}>Delete Avatar</button>
        </div>
      </div>

      {/* Profile Details Form */}
      <form className="profile-details-form">
        <div className="form-row">
          <div className="form-field">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Doe" />
          </div>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" placeholder="janedoe@gmail.com" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Phone Number</label>
            <input type="text" placeholder="+254700000000" />
          </div>
          <div className="form-field">
            <label>Country</label>
            <input type="text" placeholder="Kenya" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Gender</label>
            <input type="text" placeholder="Male" />
          </div>
          <div className="form-field">
            <label>Role</label>
            <input type="text" placeholder="Admin" />
          </div>
        </div>

        {/* Save Button */}
        <div className="save-changes-section">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsProfile;
