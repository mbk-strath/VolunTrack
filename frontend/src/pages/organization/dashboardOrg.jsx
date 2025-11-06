import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../../styles/organization/dashboardOrg.css";

const chartData = [
  { name: "Food Bank", hours: 240 },
  { name: "Beach Cleanup", hours: 180 },
  { name: "Tutoring", hours: 310 },
  { name: "Animal Shelter", hours: 280 },
  { name: "Community Garden", hours: 160 },
  { name: "Senior Care", hours: 220 },
];

const DashboardOrg = () => {
  return (
    <div className="dashboard-container ">
      {/* Summary Cards */}
      <div className="highlights">
        <div className="summary-card">
          <h3>Total Volunteers</h3>
          <p>1200</p>
        </div>

        <div className="summary-card">
          <h3>Attendance Rate</h3>
          <p>87%</p>
        </div>

        <div className="summary-card">
          <h3>Ongoing Events</h3>
          <p>30</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-org">
        <h2 className="chart-title mb-8">
          Total Volunteer Hours by Opportunity
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9ca3af"
              label={{ value: "Hours", angle: -90, position: "insideLeft" }}
            />
            <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOrg;
