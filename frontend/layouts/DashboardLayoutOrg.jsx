import React, { useEffect, useState } from "react";
import SidebarOrg from "../src/components/organization/sidebarOrg";
import TopBarOrg from "../src/components/organization/topbarOrg";
import { Outlet, useLocation } from "react-router-dom";
import "../src/styles/volunteer/DashboardVol.css";

function DashboardLayoutOrg() {
  const location = useLocation();
  const [fadeKey, setFadeKey] = useState(0);

  // Trigger animation on route change
  useEffect(() => {
    setFadeKey((prevKey) => prevKey + 1);
  }, [location]);

  return (
    <div className="dashboard">
      <SidebarOrg className="sidebar" />
      <div className="dashboard-content">
        <TopBarOrg />
        <div key={fadeKey} className="page-transition">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayoutOrg;
