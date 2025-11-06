import React from "react";
import "../../styles/organization/applicationsOrg.css";

const applications = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "0722000000",
    position: "Frontend Developer",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@gmail.com",
    phone: "0711000000",
    position: "Backend Developer",
  },
];

const ApplicationsOrg = () => {
  return (
    <div className="applications-container">
      <div className="main-card">
        {applications.map((app) => (
          <div key={app.id} className="application-card">
            <div className="application-content">
              {/* Left side info */}
              <div className="application-info">
                <h3 className="application-position">{app.position}</h3>
                <div className="application-details">
                  <p>
                    <span className="label">Name:</span> {app.name}
                  </p>
                  <p>
                    <span className="label">Email:</span> {app.email}
                  </p>
                  <p>
                    <span className="label">Phone:</span> {app.phone}
                  </p>
                </div>
                <button className="btn-outline">Download CV</button>
              </div>

              {/* Right side buttons */}
              <div className="action-buttons">
                <button className="btn btn-success">Contact</button>
                <button className="btn btn-primary">Approve</button>
                <button className="btn btn-danger">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsOrg;
