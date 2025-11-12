import React from "react";
import "../../styles/organization/sideOrg.css";
import Logo from "../../assets/logo-dark.png";
import { IoApps } from "react-icons/io5";
import { MdOutlineFindInPage } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { FaHistory } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

import { NavLink } from "react-router-dom";

function SidebarOrg() {
  return (
    <div className="sidebar">
      <img src={Logo} alt="logo" className="logo" />

      <NavLink
        to="/dashboard/organization"
        end
        className={({ isActive }) =>
          isActive ? "sideElementsOrg active" : "sideElementsOrg"
        }
      >
        <IoApps className="dash-icon-org" />
        <p>Dashboard</p>
      </NavLink>

      <NavLink
        to="/dashboard/organization/opportunitIes"
        className={({ isActive }) =>
          isActive ? "sideElementsOrg active" : "sideElementsOrg"
        }
      >
        <MdOutlineFindInPage className="dash-icon-org" />
        <p>Opportunities</p>
      </NavLink>

      <NavLink
        to="/dashboard/organization/applicants"
        className={({ isActive }) =>
          isActive ? "sideElementsOrg active" : "sideElementsOrg"
        }
      >
        <FaFileAlt className="dash-icon-org" />
        <p>Applications</p>
      </NavLink>

      <NavLink
        to="/dashboard/organization/messages"
        className={({ isActive }) =>
          isActive ? "sideElementsOrg active" : "sideElementsOrg"
        }
      >
        <TiMessages className="dash-icon-org" />
        <p>Messages</p>
      </NavLink>

      <NavLink
        to="/dashboard/organization/history"
        className={({ isActive }) =>
          isActive ? "sideElementsOrg active" : "sideElementsOrg"
        }
      >
        <FaHistory className="dash-icon-org" />
        <p>History</p>
      </NavLink>

      <NavLink
        to="/dashboard/organization/settings"
        className={({ isActive }) =>
          isActive ? "sideElementsOrg active" : "sideElementsOrg"
        }
      >
        <IoSettings className="dash-icon-org" />
        <p>Settings</p>
      </NavLink>
    </div>
  );
}

export default SidebarOrg;
