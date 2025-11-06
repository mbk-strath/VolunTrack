import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/events.css";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token"); // assumes token is saved after login
        const response = await axios.get("http://localhost:5000/api/all-opportunities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="EventsPage">
      <h2>Ongoing Events</h2>

      {/*Event Card 1 */}
      <div className="event-card">
        <div className="event-info">
          <h3>
            <strong>Food Donation Campaign</strong>
          </h3>
          <p className="detail">Organization: Hope Foundation</p>
          <p className="detail">Start Date: 12/10/2025</p>
          <p className="detail">End Date: 25/12/2025</p>
          <p className="detail">
            Description: Donate food to many parts of the country
          </p>
          <p className="status-line">
            Status: <span className="status">Approved</span>
          </p>
        </div>
        <div className="btns">
          <button className="btn-approve">Approve</button>
          <button className="btn-suspend">Suspend</button>
          <button className="btn-delete">Delete</button>
          <button className="btn-reports">View Reports</button>
        </div>
      {events.length > 0 ? (
        events.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-info">
              <h3>
                <strong>{event.title}</strong>
              </h3>
              <p className="detail">Organization ID: {event.organisation_id}</p>
              <p className="detail">Start Date: {event.start_date}</p>
              <p className="detail">End Date: {event.end_date}</p>
              <p className="detail">Description: {event.description}</p>
              <p className="detail">Required Skills: {event.required_skills}</p>
              <p className="detail">Volunteers Needed: {event.num_volunteers_needed}</p>
              <p className="detail">Schedule: {event.schedule}</p>
              <p className="detail">Location: {event.location}</p>
              <p className="detail">Benefits: {event.benefits}</p>
              <p className="detail">
                Application Deadline: {event.application_deadline}
              </p>
              <p className="status-line">
                Status: <span className="status">Approved</span>
              </p>
            </div>
            <div className="btns">
              <button className="btn-approve">Approve</button>
              <button className="btn-suspend">Suspend</button>
              <button className="btn-delete">Delete</button>
              <button className="btn-reports">View Reports</button>
            </div>
          </div>
        ))
      ) : (
        <p>No events available.</p>
      )}

      </div>

    </div>
  );
};

export default AdminEvents;
