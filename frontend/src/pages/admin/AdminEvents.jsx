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
      
      {loading?( 
        <p>Loading...</p>
      ): events.length === 0 ? (
        <p className="no-events">No events available.</p>
      ):(
        events.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-info">
              <h3>
                <strong>{event.title}</strong>
              </h3>
              <p className="detail">Organization ID: {event.organisation_id}</p>
              <p className="detail">Start Date: {new Date(event.start_date).toLocaleDateString()}</p>
              <p className="detail">End Date: {new Date(event.end_date).toLocaleDateString()}</p>
              <p className="detail">Description: {event.description}</p>
              <p className="detail">Required Skills: {event.required_skills}</p>
              <p className="detail">Volunteers Needed: {event.num_volunteers_needed}</p>
              <p className="detail">Schedule: {event.schedule}</p>
              <p className="detail">Location: {event.location}</p>
              <p className="detail">Benefits: {event.benefits}</p>
              <p className="detail">
                Application Deadline: {new Date(event.application_deadline).toLocaleDateString()}
              </p>
              <p className="status-line">
                Status: <span className="status">{event.status || "Pending"}</span>
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
      )}
      </div>
      ) ;
}; 
 

export default AdminEvents;
