import React from "react";
import "../../styles/admin/home.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  { name: "Volunteers", count: 1200 },
  { name: "Organizations", count: 87 },
  { name: "Events", count: 30 },
];

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

        {/* Chart Section */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
