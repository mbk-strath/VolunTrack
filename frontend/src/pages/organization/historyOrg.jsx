import React from "react";
import "../../styles/organization/historyOrg.css";

const events = [
  {
    id: 1,
    title: "Community Clean Up Drive",
    date: "Posted at 12/10/2025",
    status: "Ongoing",
    color: "primary",
  },
  {
    id: 2,
    title: "Tree Planting Event",
    date: "Posted at 12/10/2025",
    status: "Suspended",
    color: "warning",
  },
  {
    id: 3,
    title: "Youth Empowerment Workshop",
    date: "Posted at 12/10/2025",
    status: "Completed",
    color: "success",
  },
  {
    id: 4,
    title: "Health Awareness Campaign",
    date: "Posted at 12/10/2025",
    status: "Deleted",
    color: "error",
  },
];

const HistoryOrg = () => {
  return (
    <div className="history-container-org">
      <div className="history-card-org">
        <h2 className="history-title">Organisation Events</h2>

        <div className="history-list">
          {events.map((event) => (
            <div key={event.id} className="history-item">
              <div className="history-left">
                <div>
                  <p className="event-title">{event.title}</p>
                  <p className="event-date">{event.date}</p>
                </div>
              </div>

              <span className={`status-chip ${event.color}`}>
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryOrg;
