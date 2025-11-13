import React from "react";
import { NavLink } from "react-router-dom";
import { ImProfile } from "react-icons/im";
function SettingLinks() {
  return (
    <div className="settingVolNav">
      <NavLink
        to="/dashboard/volunteer/settings"
        end
        className={({ isActive }) =>
          isActive ? "btn-sett active" : "btn-sett"
        }
      >
        Personal Details
      </NavLink>
      <NavLink
        to="/dashboard/volunteer/settings/other-details"
        end
        className={({ isActive }) =>
          isActive ? "btn-sett active" : "btn-sett"
        }
      >
        Other Details
      </NavLink>

      <NavLink
        to="/dashboard/volunteer/settings/account"
        className={({ isActive }) =>
          isActive ? "btn-sett active" : "btn-sett"
        }
      >
        Account
      </NavLink>
    </div>
  );
}

export default SettingLinks;
