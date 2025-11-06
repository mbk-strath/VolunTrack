import React from "react";
import "../../styles/admin/settings.css";
import { Outlet } from "react-router-dom";
import SettAdmLinks from "../../components/admin/SettAdmLinks";

const AdminSettings = () => {
  return (
    <div className="settingsPage">
      <SettAdmLinks />
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSettings;
