import React, { useState, useEffect } from "react";
import axios from "axios";
import OpportunityFormOverlay from "./OpportunityFormOverlay";
import "../../styles/organization/opportunitiesOrg.css";

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all opportunities using Axios
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/all-opportunities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedData = response.data.map((op) => ({
          id: op.id,
          organizationName: op.organisation_id,
          opportunityTitle: op.title,
          description: op.description,
          skills: op.required_skills,
          volunteers: op.num_volunteers_needed,
          startDate: op.start_date,
          endDate: op.end_date,
          workingHours: op.schedule,
          location: op.location,
          benefits: op.benefits,
          deadline: op.application_deadline,
          cvRequired: false, // default, update if API provides
        }));

        setOpportunities(formattedData);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch opportunities"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/opportunities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunities((prev) => prev.filter((op) => op.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete opportunity");
    }
  };

  return (
    <div className="manage-opportunities">
      <h1>Manage Opportunities</h1>

      {loading && <p>Loading opportunities...</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && opportunities.length === 0 && (
        <p className="no-op">No opportunities have been created yet.</p>
      )}

      {!loading && !error && opportunities.length > 0 && (
        <div className="opportunities-list">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="opportunity-card">
              <div className="opportunity-details">
                <p>
                  <strong>Opportunity Title:</strong>{" "}
                  {opportunity.opportunityTitle}
                </p>
                <p>
                  <strong>Number of Volunteers:</strong>{" "}
                  {opportunity.volunteers}
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
      )}

      {editingOpportunity && (
        <OpportunityFormOverlay
          prefillData={editingOpportunity}
          onClose={handleCloseForm}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default ManageOpportunities;
