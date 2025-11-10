import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin/org.css";

const AdminOrganisations = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authorization token found.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(""); // Clear any previous errors

        const response = await axios.get("http://localhost:8000/api/all-applications", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched organisation applications:", response.data);

        const data = response.data.applications || [];
        if (data.length === 0) {
          setError("No applications pending verification.");
        } else {
          setApplications(data);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);

        if (err.response) {
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          setError("No response from server. Check your backend or CORS settings.");
        } else {
          setError(`Error: ${err.message}`);
        }

        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // 🧠 Conditional UI rendering
  if (loading) return <h3 className="no-opp">Loading organisation applications...</h3>;
  if (error) return <h3 className="no-opp">{error}</h3>;

  return (
    <div className="OrganisationsPage">
      <h2 className="page-title">Organisation Verification</h2>

      {applications.map((app) => (
        <div key={app.id} className="org-card">
          <div className="org-info">
            <strong>Application ID:</strong> {app.id} <br />
            <strong>Status:</strong>{" "}
            <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
            <br />
            <strong>Application Date:</strong>{" "}
            {app.application_date
              ? new Date(app.application_date).toLocaleDateString()
              : "—"}
          </div>

          <div className="btns">
            <button className="btn-approve">Approve</button>
            <button className="btn-reject">Reject</button>
            <button className="btn-view">View Documents</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrganisations;
