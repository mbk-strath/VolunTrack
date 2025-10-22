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

function SidebarAdmin() {
  return (
    <div className="sidebar">
      <img src={Logo} alt="logo" className="logo" />

      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <IoApps className="dash-icon" />
        <p>Dashboard</p>
      </NavLink>

      <NavLink
        to="/dashboard/opportunites"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <MdOutlineFindInPage className="dash-icon" />
        <p>Find Opportunities</p>
      </NavLink>

      <NavLink
        to="/dashboard-admin/organisations"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <FaFileAlt className="dash-icon" />
        <p>Organisations</p>
      </NavLink>

      <NavLink
        to="/dashboard/messages"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <TiMessages className="dash-icon" />
        <p>Messages</p>
      </NavLink>

      <NavLink
        to="/dashboard/history"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <FaHistory className="dash-icon" />
        <p>History</p>
      </NavLink>

      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <IoSettings className="dash-icon" />
        <p>Settings</p>
      </NavLink>
    </div>
  );
}

export default SidebarAdmin;