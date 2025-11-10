import React from "react";
import Logo from "../../assets/logo-dark.png";
import { IoApps } from "react-icons/io5";
import { HiMiniUsers } from "react-icons/hi2";
import { CgOrganisation } from "react-icons/cg";
import { GoReport } from "react-icons/go";
import { MdEvent } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import "../../styles/volunteer/sideVol.css";
import "../../styles/admin/sideVolAdm.css";
function SidebarAdmin() {
  return (
    <div className="sidebar">
      <img src={Logo} alt="logo" className="logo" />

      <NavLink
        to="/dashboard/admin"
        end
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <IoApps className="adm-dash-icon" />
        <p>Dashboard</p>
      </NavLink>

      <NavLink
        to="/dashboard/admin/users"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <HiMiniUsers className="adm-dash-icon" />
        <p>Users</p>
      </NavLink>

      <NavLink
        to="/dashboard/admin/organisations"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <CgOrganisation className="adm-dash-icon" />
        <p>Organisations</p>
      </NavLink>

      <NavLink
        to="/dashboard/admin/reports"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <GoReport className="adm-dash-icon" />
        <p>Reports</p>
      </NavLink>

      <NavLink
        to="/dashboard/admin/events"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <MdEvent className="adm-dash-icon" />
        <p>Events</p>
      </NavLink>

      <NavLink
        to="/dashboard/admin/settings"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <IoSettings className="adm-dash-icon" />
        <p>Settings</p>
      </NavLink>
    </div>
  );
}

export default SidebarAdmin;
