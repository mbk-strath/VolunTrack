import React from "react";
import "../../styles/volunteer/ApplicationVol.css";

const data = [
  {
    Title: "Frontend Develepor",
    Organization_Name: "Lead Tech",
    Status: "pending",
  },
  {
    Title: "Frontend Develepor",
    Organization_Name: "Lead Tech",
    Status: "accepted",
  },
  {
    Title: "Frontend Develepor",
    Organization_Name: "Lead Tech",
    Status: "cancelled",
  },
];
function ApplicationHistoryPage() {
  return (
    <div className="ApplicationPage">
      <div className="application-card">
        <h2 className="heading">Application Status</h2>
        {data.map((application, index) => (
          <div className="application-holder" key={index}>
            <div className="names">
              <h4 className="title">{application.Title}</h4>
              <p className="org_name">{application.Organization_Name}</p>
            </div>
            <div
              className={
                application.Status === "pending"
                  ? "pending"
                  : application.Status === "accepted"
                  ? "accepted"
                  : "cancelled"
              }
            >
              {application.Status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationHistoryPage;
