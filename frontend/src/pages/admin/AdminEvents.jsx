import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/events.css";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authorization token found.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:8000/api/all-opportunities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched events:", response.data);
        const data = response.data || [];

        if (data.length === 0) {
          setError("No events available.");
        } else {
          setEvents(data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);

        if (err.response) {
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          setError(
            "No response from server. Check your backend or CORS settings."
          );
        } else {
          setError(`Error: ${err.message}`);
        }

        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h3 className="loading-text">Loading events...</h3>
      </div>
    );

  if (error) return <h3 className="no-events">{error}</h3>;

  return (
    <div className="EventsPage">
      <h2 className="page-title">Ongoing Events</h2>

      {events.map((event) => (
        <div key={event.id} className="event-card">
          <div className="event-info">
            <strong>Title:</strong> {event.title} <br />
            <strong>Organization ID:</strong> {event.organisation_id} <br />
            <strong>Start Date:</strong>{" "}
            {event.start_date
              ? new Date(event.start_date).toLocaleDateString()
              : "—"}{" "}
            <br />
            <strong>End Date:</strong>{" "}
            {event.end_date
              ? new Date(event.end_date).toLocaleDateString()
              : "—"}{" "}
            <br />
            <strong>Description:</strong>{" "}
            {event.description || "No description"} <br />
            <strong>Required Skills:</strong> {event.required_skills || "N/A"}{" "}
            <br />
            <strong>Volunteers Needed:</strong>{" "}
            {event.num_volunteers_needed || "N/A"} <br />
            <strong>Schedule:</strong> {event.schedule || "N/A"} <br />
            <strong>Location:</strong> {event.location || "N/A"} <br />
            <strong>Benefits:</strong> {event.benefits || "N/A"} <br />
            <strong>Application Deadline:</strong>{" "}
            {event.application_deadline
              ? new Date(event.application_deadline).toLocaleDateString()
              : "—"}{" "}
            <br />
            <strong>Status:</strong>{" "}
            <span
              className={`status ${event.status?.toLowerCase() || "pending"}`}
            >
              {event.status || "Pending"}
            </span>
          </div>

          <div className="btns">
            <button className="btn-approve">Approve</button>
            <button className="btn-suspend">Suspend</button>
            <button className="btn-delete">Delete</button>
            <button className="btn-reports">View Reports</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminEvents;
