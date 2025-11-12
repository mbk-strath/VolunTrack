import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin/report.css";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authorization token found.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        const response = await axios.get("http://localhost:8000/api/all-reports", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched reports:", response.data);

        const data = response.data || [];

        if (data.length === 0) {
          setError("No reports found.");
        } else {
          setReports(data);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);

        if (err.response) {
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          setError("No response from server. Check your backend or CORS settings.");
        } else {
          setError(`Error: ${err.message}`);
        }

        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h3 className="loading-text">Loading flagged reports...</h3>
      </div>
    );

  if (error) return <h3 className="no-opp">{error}</h3>;

  return (
    <div className="ReportsPage">
      <h2 className="page-title">Flagged Reports</h2>

      {reports.map((report) => (
        <div key={report.id} className="rep-card">
          <div className="rep-info">
            <strong>
              {report.user_name} ({report.user_role})
            </strong>{" "}
            reported an issue: <strong>{report.title}</strong>
            <br />
            <strong>Description:</strong> {report.description}
            <br />
            <strong>Email:</strong> {report.user_email}
            <br />
            <strong>Status:</strong>{" "}
            <span
              className={`status-adm ${report.status?.toLowerCase() || "pending"}`}
            >
              {report.status || "Pending"}
            </span>
            <br />
            <strong>Reported On:</strong>{" "}
            {report.created_at
              ? new Date(report.created_at).toLocaleString()
              : "—"}
          </div>

          <div className="btns">
            <button className="btn-review">Review</button>
            <button className="btn-suspend">Suspend</button>
            <button className="btn-ban">Ban</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminReports;
