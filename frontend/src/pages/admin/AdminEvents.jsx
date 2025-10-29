import React from "react";
import "../../styles/admin/events.css";

const AdminEvents = () => {
  return (
    <div className="EventsPage">
      
      
      

        <h2>Ongoing Events</h2>

        {/*Event Card 1 */}
        <div className="event-card">
          <div className="event-info">
            <strong>Hope4All</strong><br />
            Status: <span className="status">Pending</span>
          </div>
          <div className="btns">
            <button className="btn-approve">Approve</button>
            <button className="btn-reject">Reject</button>
            <button className="btn-view">View Documents</button>
          </div>
        </div>

        {/* Event Card 2 */}
        <div className="event-card">
          <div className="event-info">
            <strong>Hope4All</strong><br />
            Status: <span className="status">Pending</span>
          </div>
          <div className="btns">
            <button className="btn-approve">Approve</button>
            <button className="btn-reject">Reject</button>
            <button className="btn-view">View Documents</button>
          </div>
        </div>
    
    </div>
  );
};

export default AdminEvents;