import React from "react";
import "../../styles/volunteer/HistoryVol.css";

// Sample volunteer history data
const volunteerHistory = [
  {
    id: 1,
    date: "2025-10-10",
    taskName: "Community Cleanup",
    organization: "Helping Hands",
    hours: 4,
    status: "Completed",
    notes: "Collected 20kg of trash from the park.",
  },
  {
    id: 2,
    date: "2025-10-12",
    taskName: "Food Drive",
    organization: "Food for All",
    hours: 3,
    status: "Completed",
    notes: "Distributed meals to 50 families.",
  },
  {
    id: 3,
    date: "2025-10-15",
    taskName: "Tree Planting",
    organization: "Green Earth",
    hours: 5,
    status: "Pending",
    notes: "Scheduled for next Saturday.",
  },
];

function HistoryPage() {
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

  return (
    <div className="history-container">
      <h2>Volunteer History</h2>
      {volunteerHistory.map((activity) => (
        <div key={activity.id} className="history-card">
          <div className="history-date">{activity.date}</div>
          <h3 className="history-task">{activity.taskName}</h3>
          <p>
            <strong>Organization:</strong> {activity.organization}
          </p>
          <p>
            <strong>Hours:</strong> {activity.hours}
          </p>
          <span className={`history-status ${getStatusClass(activity.status)}`}>
            {activity.status}
          </span>
          {activity.notes && (
            <p className="history-notes">
              <strong>Notes:</strong> {activity.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;
