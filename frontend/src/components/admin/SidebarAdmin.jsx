import React from "react";
import Logo from "../../assets/logo-dark.png";
import { IoApps } from "react-icons/io5";
import { MdOutlineFindInPage } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { FaHistory } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import "../../styles/volunteer/sideVol.css";
import "../../styles/admin/sideVolAdm.css";
function SidebarAdmin() {
  return (
    <div className="sidebar">
      <img src={Logo} alt="logo" className="logo" />

      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <IoApps className="adm-dash-icon" />
        <p>Dashboard</p>
      </NavLink>

      <NavLink
        to="/dashboard/opportunites"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <MdOutlineFindInPage className="adm-dash-icon" />
        <p>Find Opportunities</p>
      </NavLink>

      <NavLink
        to="/dashboard-admin/organisations"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <FaFileAlt className="adm-dash-icon" />
        <p>Organisations</p>
      </NavLink>

      <NavLink
        to="/dashboard-admin/reports"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <TiMessages className="adm-dash-icon" />
        <p>Reports</p>
      </NavLink>

      <NavLink
        to="/dashboard-admin/events"
        className={({ isActive }) =>
          isActive ? "sideElementsAdm active" : "sideElementsAdm"
        }
      >
        <FaHistory className="adm-dash-icon" />
        <p>Events</p>
      </NavLink>

      <NavLink
        to="/dashboard/settings"
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