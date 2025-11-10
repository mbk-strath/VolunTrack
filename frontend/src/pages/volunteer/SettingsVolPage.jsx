import React from "react";
import SettingLinks from "../../components/volunteer/SettingLinks";
import "../../styles/volunteer/SettingsVol.css";
import { Outlet } from "react-router-dom";

function SettingsVolPage() {
  return (
    <div className="settingsPage">
      <SettingLinks />
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsVolPage;
