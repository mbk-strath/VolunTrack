import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/volunteer/ApplicationVol.css";

function ApplicationHistoryPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          }
        );

        console.log("Fetched applications:", res.data);

        if (
          !res.data ||
          !res.data.applications ||
          res.data.applications.length === 0
        ) {
          setError("No Applications Found");
        } else {
          setApplications(res.data.applications);
        }
      } catch (err) {
        // Log full error object
        console.error("Axios error object:", err);

        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          console.error("Request made but no response:", err.request);
          setError("No response from server. Check your backend.");
        } else {
          console.error("Error message:", err.message);
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <h3 className="no-opp">Loading applications...</h3>;
  }

  if (error) {
    return <h3 className="no-opp">{error}</h3>;
  }

  return (
    <div className="ApplicationPage">
      <div className="application-vol">
        <h3>Applications</h3>
        {applications.map((application) => (
          <div className="application-holder" key={application.id}>
            <div className="names">
              <h4 className="title">
                Opportunity Title: {application.opportunity_title}
              </h4>
              <p className="org_name">
                Application Date: {application.application_date}
              </p>
            </div>
            <div
              className={
                application.status === "pending"
                  ? "pending"
                  : application.status === "accepted"
                  ? "accepted"
                  : "cancelled"
              }
            >
              {application.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationHistoryPage;
