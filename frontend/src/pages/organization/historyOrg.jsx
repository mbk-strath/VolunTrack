import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Cancel,
  PauseCircle,
} from "@mui/icons-material";
import "../../styles/organization/historyOrg.css";

const events = [
  {
    id: 1,
    title: "Community Clean Up Drive",
    date: "Posted at 12/10/2025",
    status: "Ongoing",
    color: "primary",
    icon: <AccessTime />,
  },
  {
    id: 2,
    title: "Tree Planting Event",
    date: "Posted at 12/10/2025",
    status: "Suspended",
    color: "warning",
    icon: <PauseCircle />,
  },
  {
    id: 3,
    title: "Youth Empowerment Workshop",
    date: "Posted at 12/10/2025",
    status: "Completed",
    color: "success",
    icon: <CheckCircle />,
  },
  {
    id: 4,
    title: "Health Awareness Campaign",
    date: "Posted at 12/10/2025",
    status: "Deleted",
    color: "error",
    icon: <Cancel />,
  },
];

const HistoryOrg = () => {
  return (
    <Box className="history-container">
      <Card className="history-card">
        <CardContent>
          <Typography variant="h5" className="history-title">
            Organisation Events
          </Typography>

          <Box className="history-list">
            {events.map((event) => (
              <Box key={event.id} className="history-item">
                <Box className="history-left">
                  <Avatar className="history-avatar" color={event.color}>
                    {event.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" className="event-title">
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="event-date"
                    >
                      {event.date}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={event.status}
                  color={event.color}
                  variant={event.color === "default" ? "outlined" : "filled"}
                  className="status-chip"
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistoryOrg;
