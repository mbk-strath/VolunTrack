import { Card, CardContent, Button } from "@mui/material";
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
    description: "We are looking for a frontend developer to help build our new volunteer platform.",
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
    description: "We are looking for a backend developer to help build our new volunteer platform.",
  },
];

const OpportunitiesOrg = () => {
  const handleApply = (opportunityId) => {
    toast.success(`Application submitted for opportunity ${opportunityId}`);
  };

  return (
    <div className="opportunities-container">
      <div className="opportunities-list">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="opportunity-card">
            <CardContent>
              <div className="opportunity-content">
                <div className="opportunity-details">
                  <h3 className="opportunity-title">{opportunity.title}</h3>
                  <div className="opportunity-info-list">
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Volunteers Needed:</span> {opportunity.volunteers}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Hours:</span> {opportunity.hours}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Start Date:</span> {opportunity.startDate}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">End Date:</span> {opportunity.endDate}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Location:</span> {opportunity.location}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Deadline:</span> {opportunity.deadline}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Benefits:</span> {opportunity.benefits}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Skills:</span> {opportunity.skills}
                    </p>
                    <p className="opportunity-info-item">
                      <span className="opportunity-info-label">Description:</span> {opportunity.description}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleApply(opportunity.id)}
                  variant="contained"
                  className="opportunity-apply-btn"
                >
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesOrg;