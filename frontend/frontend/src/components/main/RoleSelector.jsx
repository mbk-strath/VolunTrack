import React, { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import "../../styles/main/roleSelector.css";

const RoleSelector = ({ onCancel }) => {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="role-selector">
      <h3>Select Your Role</h3>

      {!selectedRole ? (
        <div className="roles">
          <button onClick={() => setSelectedRole("volunteer")}>
            Volunteer
          </button>
          <button onClick={() => setSelectedRole("organization")}>
            Organization
          </button>
          <button onClick={() => setSelectedRole("admin")}>Admin</button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="google-login-container">
          <p className="role-label">
            Logging in as: <b>{selectedRole}</b>
          </p>
          <GoogleLoginButton role={selectedRole} />
          <button className="cancel-btn" onClick={() => setSelectedRole("")}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
