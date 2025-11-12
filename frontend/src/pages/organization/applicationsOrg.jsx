import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/organization/applicationsOrg.css";

const ApplicationsOrg = () => {
  const { id } = useParams();
  const opportunityId = id;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!opportunityId) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:8000/api/my-applicants/${opportunityId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setApplications(response.data.applications || []);
      } catch (err) {
        console.error(err);
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
    setTimeout(() => setShowPopup(false), 2500);
  };

  const handleDownloadCV = (cvPath) => {
    if (!cvPath) {
      handlePopup("No CV uploaded for this applicant");
      return;
    }
    const fileUrl = `http://localhost:8000/storage/${cvPath}`;
    window.open(fileUrl, "_blank");
  };

  // ✅ Update application status & send notification
  const updateApplicationStatus = async (
    applicationId,
    status,
    volunteerId
  ) => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Update status
      const response = await axios.patch(
        `http://localhost:8000/api/update-application/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: response.data.application.status }
            : app
        )
      );

      handlePopup(response.data.message || `Application ${status}`);

      // 2️⃣ Send notification to volunteer
      const messageText =
        status === "accepted"
          ? "Your application has been approved"
          : "Your application has been rejected";

      await axios.post(
        "http://localhost:8000/api/send-notification",
        {
          message: messageText,
          receiver_id: volunteerId,
          channel: "in_app", // or "email" if you want
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Notification sent to volunteer:", volunteerId);
    } catch (err) {
      console.error("Error updating status or sending notification:", err);
      handlePopup(
        err.response?.data?.message ||
          "Failed to update status / send notification"
      );
    }
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
                <h3>
                  {app.opportunity_title ||
                    `Opportunity #${app.opportunity_id}`}
                </h3>
                <h2 className="application-position">
                  Volunteer Name:{" "}
                  {app.volunteer_name || `ID: ${app.volunteer_id}`}
                </h2>

                <div className="application-details">
                  <p>
                    <span className="label">Applied:</span>{" "}
                    {app.application_date
                      ? new Date(app.application_date).toDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="label">Status:</span> {app.status || "N/A"}
                  </p>
                </div>

                <button
                  className="btn-outline"
                  onClick={() => handleDownloadCV(app.CV_path)}
                  disabled={!app.CV_path}
                >
                  {app.CV_path ? "Download CV" : "No CV"}
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

                {/* Approve */}
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    updateApplicationStatus(
                      app.id,
                      "accepted",
                      app.volunteer_id
                    )
                  }
                  disabled={app.status === "accepted"}
                >
                  Approve
                </button>

                {/* Reject */}
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    updateApplicationStatus(
                      app.id,
                      "rejected",
                      app.volunteer_id
                    )
                  }
                  disabled={app.status === "rejected"}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-message">{popupMessage}</div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsOrg;
