import React from "react";
import { Outlet } from "react-router-dom";
import "../src/styles/main/PublicLayout.css";

function PublicLayout() {
  return (
    <div className="public-layout">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
