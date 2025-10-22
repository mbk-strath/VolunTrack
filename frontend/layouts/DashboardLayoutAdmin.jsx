import React, { useEffect, useState } from "react";
import SidebarAdmin from "../src/components/admin/SidebarAdmin";
import TopBarAdmin from "../src/components/admin/TopBarAdmin";
import { Outlet, useLocation } from "react-router-dom";
import "../src/styles/volunteer/DashboardVol.css";

function DashboardLayoutAdmin() {
  const location = useLocation();
  const [fadeKey, setFadeKey] = useState(0);

  // Trigger animation on route change
  useEffect(() => {
    setFadeKey((prevKey) => prevKey + 1);
  }, [location]);

  return (
    <div className="dashboard">
      <SidebarAdmin className="sidebar" />
      <div className="dashboard-content">
        <TopBarAdmin />
        <div key={fadeKey} className="page-transition">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayoutAdmin;