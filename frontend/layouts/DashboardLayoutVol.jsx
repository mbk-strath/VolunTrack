import React from "react";

import Sidebar from "../src/components/volunteer/Sidebar";
import TopBar from "../src/components/volunteer/TopBar";
import { Outlet } from "react-router-dom";
import "../src/styles/volunteer/DashboardVol.css";

function DashboardLayoutVol() {
  return (
    <div className="dashboard">
      <Sidebar className="sidebar " />
      <div className="dashboard-content">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayoutVol;
