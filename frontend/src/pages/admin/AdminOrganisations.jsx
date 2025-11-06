import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin/org.css";

const AdminOrganisations = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example: retrieve token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/all-applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure applications array exists
        const data = response.data.applications || [];
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="OrganisationsPage">
      <h2>Organisation Verification</h2>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="no-op">No applications pending verification.</p>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="org-card">
            <div className="org-info">
              <strong>Application ID: {app.id}</strong>
              <br />
              Status: <span className="status">{app.status}</span>
              <br />
              Application Date:{" "}
              {new Date(app.application_date).toLocaleDateString()}
            </div>
            <div className="btns">
              <button className="btn-approve">Approve</button>
              <button className="btn-reject">Reject</button>
              <button className="btn-view">View Documents</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrganisations;
