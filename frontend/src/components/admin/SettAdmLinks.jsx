import React from "react";
import { NavLink } from "react-router-dom";
import { ImProfile } from "react-icons/im";
function SettAdmLinks() {
  return (
    <div className="settingVolNav">
      <NavLink
        to="/dashboard/admuin/settings"
        end
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        Profile
      </NavLink>

      <NavLink
        to="/dashboard/admin/settings/account"
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        Account
      </NavLink>
    </div>
  );
}

export default SettAdmLinks;
