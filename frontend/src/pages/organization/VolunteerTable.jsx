import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Button } from "@mui/material";
import VolunteerHistoryDialog from "../../components/organization/volunteerhistoryreport";
import "../../styles/organization/volunteerOrg.css";

const VolunteerTable = () => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/all-participations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParticipations(response.data.participations || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load participations");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipations();
  }, []);

  const handleViewMore = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDialogOpen(true);
  };

  if (loading) return <p>Loading participations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Card className="dashboard-table-card">
        <CardContent>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr className="dashboard-table-header-row">
                  <th>Volunteer</th>
                  <th>Opportunity</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participations.map((p) => (
                  <tr key={p.id}>
                    <td>{p.volunteer_name}</td>
                    <td>{p.opportunity_title}</td>
                    <td>{new Date(p.check_in).toLocaleString()}</td>
                    <td>{new Date(p.check_out).toLocaleString()}</td>
                    <td>{p.total_hours}</td>
                    <td>
                      <Button
                        variant="contained"
                        onClick={() => handleViewMore(p)}
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

      {selectedVolunteer && (
        <VolunteerHistoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          volunteerName={selectedVolunteer.volunteer_name}
          history={[
            {
              date: new Date(selectedVolunteer.check_in).toLocaleDateString(),
              opportunity: selectedVolunteer.opportunity_title,
              checkIn: new Date(
                selectedVolunteer.check_in
              ).toLocaleTimeString(),
              checkOut: new Date(
                selectedVolunteer.check_out
              ).toLocaleTimeString(),
              totalHours: selectedVolunteer.total_hours,
              status: "Completed",
              statusColor: "green",
            },
          ]}
        />
      )}
    </>
  );
};

export default VolunteerTable;
