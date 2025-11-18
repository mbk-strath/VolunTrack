import React, { useEffect, useState } from "react";
import axios from "axios";

const MyApplicantsTable = ({ opportunityId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/my-applicants/${opportunityId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.applications) {
          setApplications(response.data.applications);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [opportunityId, token]);

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>My Applicants</h2>
      {applications.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <table
          className="applicants-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: "8px" }}>Volunteer Name</th>
              <th style={{ padding: "8px" }}>Application Date</th>
              <th style={{ padding: "8px" }}>Status</th>
              <th style={{ padding: "8px" }}>CV</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{app.volunteer_name}</td>
                <td style={{ padding: "8px" }}>
                  {new Date(app.application_date).toLocaleDateString()}
                </td>
                <td style={{ padding: "8px", textTransform: "capitalize" }}>
                  {app.status}
                </td>
                <td style={{ padding: "8px" }}>
                  {app.CV_path ? (
                    <a
                      href={app.CV_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007BFF", textDecoration: "underline" }}
                    >
                      Download CV
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplicantsTable;
