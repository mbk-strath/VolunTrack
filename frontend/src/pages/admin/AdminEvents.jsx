import React from "react";
import "../../styles/admin/events.css";

const AdminEvents = () => {
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
      </div>
    </div>
  );
};

export default AdminEvents;
