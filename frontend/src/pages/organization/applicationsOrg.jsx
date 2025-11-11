import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/organization/applicationsOrg.css";

const ApplicationsOrg = ({ opportunityId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!opportunityId) {
        setApplications([]);
        setLoading(false);
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

        console.log("API response:", response.data);

        const allApplications = response.data.applications || [];

        // OPTIONAL: filter only pending applications
        // const pendingApplications = allApplications.filter(
        //   (app) => app.status?.trim().toLowerCase() === "pending"
        // );

        setApplications(allApplications);
      } catch (err) {
        console.error("Fetch applications error:", err);
        setError(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [opportunityId]);

  const handlePopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500); // auto-close after 2.5s
  };

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!applications || applications.length === 0)
    return <p className="no-opp">No applicants found</p>;

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
                  <p>
                    <span className="label">Status:</span> {app.status || "N/A"}
                  </p>
                </div>
                <button
                  className="btn-outline"
                  onClick={() => handlePopup("Download CV not implemented yet")}
                >
                  Download CV
                </button>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    handlePopup("Contact functionality coming soon")
                  }
                >
                  Contact
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handlePopup(`Application ID ${app.id} Approved`)
                  }
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handlePopup(`Application ID ${app.id} Rejected`)
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-message">{popupMessage}</div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsOrg;
