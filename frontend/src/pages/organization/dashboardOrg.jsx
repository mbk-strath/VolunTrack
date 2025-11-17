import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "../../styles/organization/dashboardOrg.css";

const DashboardOrg = () => {
  const [chartData, setChartData] = useState([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOpportunities = async () => {
      try {
        const oppRes = await axios.get(
          "http://localhost:8000/api/all-opportunities",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const opportunities = oppRes.data;

        // ➕ Calculate total applications from all opportunities
        const totalApps = opportunities.reduce(
          (sum, opp) => sum + (opp.total_applicants || 0),
          0
        );
        setTotalApplications(totalApps);

        // 📊 Prepare chart data (Applicants per Opportunity)
        const dataWithApplicants = opportunities.map((opp) => ({
          name: `ID: ${opp.id}`,
          applicants: opp.total_applicants || 0,
        }));

        setChartData(dataWithApplicants);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchVolunteerStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/total-volunteers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTotalVolunteers(res.data.total_volunteers || 0);
        setAttendanceRate(res.data.attendance_rate || 0);
      } catch (err) {
        console.error("Error fetching volunteer stats:", err);
      }
    };

    fetchOpportunities();
    fetchVolunteerStats();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Summary Cards */}
      <div className="highlights">
        <div className="summary-card">
          <h3>Total Volunteers</h3>
          <p>{totalVolunteers}</p>
        </div>

        <div className="summary-card">
          <h3>Attendance Rate</h3>
          <p>{attendanceRate}%</p>
        </div>

        <div className="summary-card">
          <h3>Total Applications</h3>
          <p>{totalApplications}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-org">
        <h2 className="chart-title mb-8">Applicants per Opportunity</h2>

        {loading ? (
          <div className="loading-message">
            <p>Loading chart data, please wait...</p>
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
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
                label={{
                  value: "Applicants",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Bar dataKey="applicants" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DashboardOrg;
