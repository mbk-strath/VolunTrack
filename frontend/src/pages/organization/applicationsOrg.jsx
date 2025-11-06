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
    <div className="applications-container p-8 flex-1">
      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="application-card bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Left side info */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{app.position}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">Name:</span>{" "}
                    {app.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Email:</span>{" "}
                    {app.email}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Phone:</span>{" "}
                    {app.phone}
                  </p>
                </div>
                <button className="btn-outline mt-4">Download CV</button>
              </div>

              {/* Right side buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="btn-success">Contact</button>
                <button className="btn-primary">Approve</button>
                <button className="btn-danger">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsOrg;
