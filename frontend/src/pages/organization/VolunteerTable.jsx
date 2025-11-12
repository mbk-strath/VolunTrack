import React, { useState } from "react";
import { Card, CardContent, Button } from "@mui/material";
import VolunteerHistoryDialog from "../../components/organization/volunteerhistoryreport";
import "../../styles/organization/volunteerOrg.css";

const volunteerData = [
  {
    id: 1,
    name: "Linda Opolo",
    email: "opololinda@gmail.com",
    phone: "0712345678",
    status: "Active",
    opportunity: "frontend developer",
    dateJoined: "02/10/2025",
    totalHours: 12,
    history: [
      {
        date: "01/11/2025",
        opportunity: "frontend developer",
        checkIn: "09:00",
        checkOut: "12:00",
        totalHours: 3,
        status: "Completed",
        statusColor: "green",
      },
      // Add more history items here
    ],
  },
  // other volunteers...
];

const VolunteerTable = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewMore = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="dashboard-table-card">
        <CardContent>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr className="dashboard-table-header-row">
                  <th>Volunteer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Opportunity</th>
                  <th>Date Joined</th>
                  <th>Total Hours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteerData.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.phone}</td>
                    <td>{volunteer.status}</td>
                    <td>{volunteer.opportunity}</td>
                    <td>{volunteer.dateJoined}</td>
                    <td>{volunteer.totalHours}</td>
                    <td>
                      <Button
                        variant="contained"
                        onClick={() => handleViewMore(volunteer)}
                      >
                        View More
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      {selectedVolunteer && (
        <VolunteerHistoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          volunteerName={selectedVolunteer.name}
          history={selectedVolunteer.history}
        />
      )}
    </>
  );
};

export default VolunteerTable;
