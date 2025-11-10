import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/volunteer/HistoryVol.css";

function HistoryPage() {
  const [participations, setParticipations] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authorization token found.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:8000/api/my-participations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched participations:", res.data);

        if (
          !res.data ||
          !res.data.participations ||
          res.data.participations.length === 0
        ) {
          setError("No participation records found.");
        } else {
          setParticipations(res.data.participations);
          setTotalHours(res.data.total_hours || 0);
        }
      } catch (err) {
        console.error("Error fetching participations:", err);

        if (err.response) {
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          setError(
            "No response from server. Check your backend or CORS settings."
          );
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParticipations();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "Pending":
        return "status-pending";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  if (loading)
    return <h3 className="no-opp">Loading participation history...</h3>;
  if (error) return <h3 className="no-opp">{error}</h3>;

  return (
    <div className="history-container">
      <h2>Volunteer History</h2>
      <p className="total-hours">
        <strong>Total Hours Volunteered:</strong> {totalHours}
      </p>

      {participations.map((activity) => (
        <div key={activity.id} className="history-card">
          <div className="history-date">
            {new Date(activity.check_in).toLocaleDateString()}
          </div>
          <h3 className="history-task">
            Opportunity ID: {activity.opportunity_id}
          </h3>
          <p>
            <strong>Check-in:</strong>{" "}
            {new Date(activity.check_in).toLocaleTimeString()}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {new Date(activity.check_out).toLocaleTimeString()}
          </p>
          <p>
            <strong>Total Hours:</strong> {activity.total_hours}
          </p>
          <span className={`history-status ${getStatusClass("Completed")}`}>
            Completed
          </span>
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;
