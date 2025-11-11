import React from "react";
import { Outlet } from "react-router-dom";
import SidebarOrg from "../src/components/organization/sidebarOrg.jsx";
import TopBarOrg from "../src/components/organization/topbarOrg.jsx";
import "../src/styles/organization/DashboardLayoutOrg.css";

const DashboardLayoutOrganization = () => {
  return (
    <div className="layout-container">
      <SidebarOrg />
      <div className="layout-content">
        <TopBarOrg />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayoutOrganization;
