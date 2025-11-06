import React from "react";
import { Card, CardContent, CardActions, Typography, Button, Grid } from "@mui/material";
import { toast } from "sonner";
import "../../styles/organization/opportunitiesOrg.css";

const opportunities = [
  {
    id: 1,
    title: "Frontend Developer",
    volunteers: 2,
    hours: "8:00 AM - 3:00 PM",
    startDate: "12/06/2026",
    endDate: "12/06/2026",
    location: "Remote",
    deadline: "12/06/2026",
    benefits: "None",
    skills: "React, TypeScript",
    description:
      "We are looking for a frontend developer to help build our new volunteer platform.",
  },
  {
    id: 2,
    title: "Backend Developer",
    volunteers: 3,
    hours: "9:00 AM - 5:00 PM",
    startDate: "15/06/2026",
    endDate: "20/06/2026",
    location: "Office",
    deadline: "14/06/2026",
    benefits: "Free lunch",
    skills: "Node.js, Express",
    description:
      "We are looking for a backend developer to help build our new volunteer platform.",
  },
];

const OpportunitiesOrg = () => {
  const handleApply = (id) => {
    toast.success(`Application submitted for opportunity ${id}`);
  };

  return (
    <div className="opportunities-container">
      <Grid container spacing={3}>
        {opportunities.map((opportunity) => (
          <Grid item xs={12} md={6} key={opportunity.id}>
            <Card className="opportunity-card">
              <CardContent>
                <Typography variant="h6" className="opportunity-title">
                  {opportunity.title}
                </Typography>

                <div className="opportunity-info">
                  <Typography variant="body2">
                    <strong>Volunteers Needed:</strong> {opportunity.volunteers}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Hours:</strong> {opportunity.hours}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Start Date:</strong> {opportunity.startDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End Date:</strong> {opportunity.endDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {opportunity.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Deadline:</strong> {opportunity.deadline}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Benefits:</strong> {opportunity.benefits}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Skills:</strong> {opportunity.skills}
                  </Typography>
                  <Typography variant="body2" className="opportunity-description">
                    {opportunity.description}
                  </Typography>
                </div>
              </CardContent>

              <CardActions className="opportunity-actions">
                <Button
                  variant="contained"
                  className="apply-btn"
                  onClick={() => handleApply(opportunity.id)}
                >
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default OpportunitiesOrg;
