import React, { useState } from "react";
import OpportunityFormOverlay from "./OpportunityFormOverlay";
import "../../styles/organization/opportunitiesOrg.css";

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      organizationName: "TechForGood",
      opportunityTitle: "Frontend Developer",
      volunteers: 2,
      workingHours: "8:00 AM - 3:00 PM",
      startDate: "2026-06-12",
      endDate: "2026-06-12",
      location: "Remote",
      deadline: "2026-06-12",
      benefits: "None",
      skills: "React, Tailwind CSS",
      description:
        "Help us improve our frontend and enhance user experience with modern UI frameworks.",
      cvRequired: true,
    },
    {
      id: 2,
      organizationName: "CodeImpact",
      opportunityTitle: "Backend Developer",
      volunteers: 3,
      workingHours: "9:00 AM - 5:00 PM",
      startDate: "2026-07-20",
      endDate: "2026-07-30",
      location: "Nairobi",
      deadline: "2026-07-15",
      benefits: "Lunch provided",
      skills: "Laravel, MySQL",
      description:
        "Work with our backend team to build APIs and manage the database layer efficiently.",
      cvRequired: false,
    },
  ]);

  const [editingOpportunity, setEditingOpportunity] = useState(null);

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
  };

  const handleCloseForm = () => {
    setEditingOpportunity(null);
  };

  const handleUpdate = (updatedData) => {
    setOpportunities((prev) =>
      prev.map((op) =>
        op.id === updatedData.id ? { ...op, ...updatedData } : op
      )
    );
    setEditingOpportunity(null);
  };

  const handleDelete = (id) => {
    setOpportunities(opportunities.filter((op) => op.id !== id));
  };

  return (
    <div className="manage-opportunities">
      <h1>Manage Opportunities</h1>

      <div className="opportunities-list">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="opportunity-card">
            <div className="opportunity-details">
              <p>
                <strong>Opportunity Title:</strong>{" "}
                {opportunity.opportunityTitle}
              </p>
              <p>
                <strong>Number of Volunteers:</strong> {opportunity.volunteers}
              </p>
              <p>
                <strong>Working Hours:</strong> {opportunity.workingHours}
              </p>

              <p>
                <strong>Start Date:</strong> {opportunity.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {opportunity.endDate}
              </p>
              <p>
                <strong>Location:</strong> {opportunity.location}
              </p>

              <p>
                <strong>Application Deadline:</strong> {opportunity.deadline}
              </p>
              <p>
                <strong>Benefits:</strong> {opportunity.benefits}
              </p>
              <p>
                <strong>Skills:</strong> {opportunity.skills}
              </p>

              <div className="row description">
                <p>
                  <strong>Description:</strong> {opportunity.description}
                </p>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(opportunity)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(opportunity.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingOpportunity && (
        <OpportunityFormOverlay
          initialData={editingOpportunity}
          onClose={handleCloseForm}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default ManageOpportunities;
