import React from "react";
import { NavLink } from "react-router-dom";
import { ImProfile } from "react-icons/im";
function SettingLinks() {
  return (
    <div className="settingVolNav">
      <NavLink
        to="/dashboard/settings"
        end
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        Profile
      </NavLink>

      <NavLink
        to="/dashboard/settings/account"
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        Account
      </NavLink>
    </div>
  );
}

export default SettingLinks;
