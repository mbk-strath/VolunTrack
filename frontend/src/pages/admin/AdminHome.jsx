import React from "react";
import "../../styles/admin/home.css";

const AdminHome = () => {
  return (
    <div className="admin-container">
      {/* Main content area */}
      <div className="admin-content">
        <h2 className="welcome-text">Welcome user</h2>

        <h3 className="section-title">Platform Overview</h3>

        {/* Metric Cards */}
        <div className="metrics-container">
          <div className="metric-card">
            <p>Active Volunteers</p>
            <h2>1200</h2>
          </div>
          <div className="metric-card">
            <p>Verified Organisations</p>
            <h2>87</h2>
          </div>
          <div className="metric-card">
            <p>Ongoing Events</p>
            <h2>30</h2>
          </div>
        </div>

        {/* Chart section */}
        <div className="chart-container">
          <p>Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
