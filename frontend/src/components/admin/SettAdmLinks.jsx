import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle, FaLock } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import "../../styles/admin/settadmlinks.css";

function SettAdmLinks() {
  return (
    <div className="settingVolNav">
      <NavLink
        to="/dashboard/admin/settings"
        end
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        <FaUserCircle className="icon" />
        <span>Profile</span>
      </NavLink>

      <NavLink
        to="/dashboard/admin/settings/account"
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        <FaLock className="icon" />
        <span>Account</span>
      </NavLink>
    </div>
  );
}

export default SettAdmLinks;
