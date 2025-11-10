import { Card, CardContent, Button } from '@mui/material';
import "../../styles/organization/applicationsOrg.css";

const applications = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "null",
    position: "Frontend Developer",
  },
  {
    id: 2,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "null",
    position: "Frontend Developer",
  },
];

const ApplicationsOrg = () => {
  return (
    <div className="applications-container">
      <div className="applications-list">
        {applications.map((app) => (
          <Card key={app.id} className="application-card">
            <CardContent>
              <div className="application-content">
                <div className="application-details">
                  <h3 className="application-position">{app.position}</h3>
                  <div className="application-info">
                    <p className="application-info-item">
                      <span className="application-label">Name:</span> {app.name}
                    </p>
                    <p className="application-info-item">
                      <span className="application-label">Email:</span> {app.email}
                    </p>
                    <p className="application-info-item">
                      <span className="application-label">Phone:</span> {app.phone}
                    </p>
                  </div>
                  <Button variant="outlined" className="application-cv-btn" size="small">
                    Download CV
                  </Button>
                </div>
                
                <div className="application-actions">
                  <Button className="btn-success" variant="contained">
                    Contact
                  </Button>
                  <Button variant="contained">
                    Approve
                  </Button>
                  <Button variant="contained" color="error">
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsOrg;