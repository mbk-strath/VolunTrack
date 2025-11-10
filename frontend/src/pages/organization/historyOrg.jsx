import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/organization/historyOrg.css";

const HistoryOrg = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/all-opportunities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched opportunities:", res.data);
        setOpportunities(res.data);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setError("Failed to fetch opportunities. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) return <p className="no-opp">Loading opportunities...</p>;
  if (error) return <p className="no-opp">{error}</p>;
  if (!opportunities || opportunities.length === 0)
    return <p className="no-opp">No opportunities have been created yet.</p>;

  return (
    <div className="history-container-org">
      <div className="history-card-org">
        <h2 className="history-title">Organisation Opportunities</h2>

        <div className="history-list">
          {opportunities.map((opp) => (
            <div key={opp.id} className="history-item">
              <div className="history-left">
                <div>
                  <p className="event-title">{opp.title}</p>
                  <p className="event-date">
                    Posted at {new Date(opp.created_at).toLocaleDateString()}
                  </p>
                  <p className="event-status">
                    Status:{" "}
                    {new Date(opp.end_date) < new Date()
                      ? "Completed"
                      : "Ongoing"}
                  </p>
                  <p className="event-description">{opp.description}</p>
                  <p className="event-skills">
                    Required Skills: {opp.required_skills}
                  </p>
                  <p className="event-volunteers">
                    Volunteers Needed: {opp.num_volunteers_needed}
                  </p>
                  <p className="event-location">Location: {opp.location}</p>
                  <p className="event-schedule">Schedule: {opp.schedule}</p>
                  <p className="event-benefits">Benefits: {opp.benefits}</p>
                  <p className="event-deadline">
                    Application Deadline:{" "}
                    {new Date(opp.application_deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryOrg;
