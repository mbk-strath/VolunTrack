import { Card, CardContent, Chip } from "@mui/material";
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
    title: "Community Clean Up Drive",
    date: "Posted at 12/10/2025",
    status: "Suspended",
    color: "default",
  },
  {
    id: 3,
    title: "Community Clean Up Drive",
    date: "Posted at 12/10/2025",
    status: "Completed",
    color: "success",
  },
  {
    id: 4,
    title: "Community Clean Up Drive",
    date: "Posted at 12/10/2025",
    status: "Deleted",
    color: "error",
  },
];

const HistoryOrg = () => {
  return (
    <div className="history-container">
      <Card className="history-card">
        <CardContent>
          <h2 className="history-title">Organisation Events</h2>
          
          <div className="history-events-list">
            {events.map((event) => (
              <div
                key={event.id}
                className="history-event-item"
              >
                <div>
                  <h3 className="history-event-title">{event.title}</h3>
                  <p className="history-event-date">{event.date}</p>
                </div>
                <Chip label={event.status} color={event.color} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryOrg;