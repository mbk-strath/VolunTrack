import React, { useEffect, useState } from "react";
import Sidebar from "../src/components/volunteer/Sidebar";
import TopBar from "../src/components/volunteer/TopBar";
import { Outlet, useLocation } from "react-router-dom";
import "../src/styles/volunteer/DashboardVol.css";

function DashboardLayoutVol() {
  const location = useLocation();
  const [fadeKey, setFadeKey] = useState(0);

  // Trigger animation on route change
  useEffect(() => {
    setFadeKey((prevKey) => prevKey + 1);
  }, [location]);

  return (
    <div className="dashboard">
      <Sidebar className="sidebar" />
      <div className="dashboard-content">
        <TopBar />
        <div key={fadeKey} className="page-transition">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayoutVol;
