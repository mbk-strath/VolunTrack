import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/organization/applicationsOrg.css";

const ApplicationsOrg = ({ opportunityId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!opportunityId) {
        setLoading(false);
        setApplications([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/api/my-applicants/${opportunityId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filter only pending applications
        const pendingApplications = response.data.filter(
          (app) => app.status.toLowerCase() === "pending"
        );

        setApplications(pendingApplications);
      } catch (err) {
        console.error("Fetch applications error:", err);
        setError(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [opportunityId]);

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!applications || applications.length === 0)
    return <p className="no-opp">No applicants </p>;

  return (
    <div className="applications-container">
      <div className="main-card">
        {applications.map((app) => (
          <div key={app.id} className="application-card">
            <div className="application-content">
              <div className="application-info">
                <h3 className="application-position">
                  Opportunity ID: {app.opportunity_id}
                </h3>
                <div className="application-details">
                  <p>
                    <span className="label">Volunteer ID:</span>{" "}
                    {app.volunteer?.id || app.volunteer_id}
                  </p>
                  <p>
                    <span className="label">Name:</span>{" "}
                    {app.volunteer?.name || "N/A"}
                  </p>
                  <p>
                    <span className="label">Email:</span>{" "}
                    {app.volunteer?.email || "N/A"}
                  </p>
                </div>
                <button className="btn-outline">Download CV</button>
              </div>

              {/* Right side buttons */}
              <div className="action-buttons">
                <button className="btn btn-success">Contact</button>
                <button className="btn btn-primary">Approve</button>
                <button className="btn btn-danger">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsOrg;
