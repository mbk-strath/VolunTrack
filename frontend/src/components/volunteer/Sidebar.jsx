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

function Sidebar() {
  return (
    <div className="sidebar">
      <img src={Logo} alt="logo" className="logo" />

      <NavLink
        to="/dashboard/volunteer"
        end
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <IoApps className="dash-icon" />
        <p>Dashboard</p>
      </NavLink>

      <NavLink
        to="/dashboard/volunteer/opportunitIes"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <MdOutlineFindInPage className="dash-icon" />
        <p>Find Opportunities</p>
      </NavLink>

      <NavLink
        to="/dashboard/volunteer/applications"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <FaFileAlt className="dash-icon" />
        <p>My Applications</p>
      </NavLink>

      <NavLink
        to="/dashboard/volunteer/history"
        className={({ isActive }) =>
          isActive ? "sideElements active" : "sideElements"
        }
      >
        <FaHistory className="dash-icon" />
        <p>History</p>
      </NavLink>

      <NavLink
        to="/dashboard/volunteer/settings"
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

export default Sidebar;
