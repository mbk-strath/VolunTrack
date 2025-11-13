import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/home.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AdminHome = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    organisations: 0,
    events: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://your-api.com/all-memberships", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const volunteersCount = res.data.volunteers?.length || 0;
        const organisationsCount = res.data.organisations?.length || 0;
        setStats((prev) => ({
          ...prev,
          volunteers: volunteersCount,
          organisations: organisationsCount,
        }));
      })
      .catch((err) => console.error("Error fetching memberships:", err));

    axios
      .get("https://your-api.com/all-opportunities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const eventsCount = Array.isArray(res.data) ? res.data.length : 0;
        setStats((prev) => ({
          ...prev,
          events: eventsCount,
        }));
      })
      .catch((err) => console.error("Error fetching opportunities:", err));
  }, []);

  const data = [
    { name: "Volunteers", count: stats.volunteers },
    { name: "Organizations", count: stats.organisations },
    { name: "Events", count: stats.events },
  ];

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h3 className="section-title">Platform Overview</h3>

        <div className="metrics-container">
          <div className="metric-card">
            <p>Active Volunteers</p>
            <h2>{stats.volunteers}</h2>
          </div>
          <div className="metric-card">
            <p>Verified Organisations</p>
            <h2>{stats.organisations}</h2>
          </div>
          <div className="metric-card">
            <p>Ongoing Events</p>
            <h2>{stats.events}</h2>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
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
