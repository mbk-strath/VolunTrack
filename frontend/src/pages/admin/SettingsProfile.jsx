import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import "../../styles/admin/settprofile.css";

const AdminSettingsProfile = () => {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
  };

  return (
    <div className="settings-profile-container">
      =
      <div className="profile-avatar-section">
        <div className="avatar-wrapper">
          <div className="avatar-placeholder">
            {avatar ? (
              <img src={avatar} alt="Avatar Preview" className="avatar-image" />
            ) : (
              <div className="avatar-circle"></div>
            )}

            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />

            <label htmlFor="avatarInput" className="camera-icon">
              <FaCamera />
            </label>
          </div>
        </div>

        <div className="avatar-buttons">
          <button
            onClick={() => document.getElementById("avatarInput").click()}
          >
            Update Avatar
          </button>
          <button onClick={handleDeleteAvatar}>Delete Avatar</button>
        </div>
      </div>
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

        <div className="save-changes-section">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsProfile;
