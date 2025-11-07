import React, { useState, useEffect } from "react";
import "../../styles/organization/opportunityFormOverlay.css";

const OpportunityFormOverlay = ({ onClose, prefillData = null }) => {
  const [formData, setFormData] = useState({
    organizationName: "",
    opportunityTitle: "",
    volunteers: "",
    workingHours: "",
    startDate: "",
    endDate: "",
    location: "",
    skills: "",
    benefits: "",
    description: "",
    deadline: "",
    cvRequired: false,
  });

  // Populate form when editing existing data
  useEffect(() => {
    if (prefillData) {
      setFormData({
        ...formData,
        ...prefillData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation example
    if (!formData.opportunityTitle || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }

    // Detect mode
    if (prefillData) {
      console.log("Editing opportunity:", formData);
      // Example: update API call
      // fetch(`/api/opportunities/${prefillData.id}`, { method: "PUT", body: JSON.stringify(formData) })
    } else {
      console.log("Creating new opportunity:", formData);
      // Example: create API call
      // fetch("/api/opportunities", { method: "POST", body: JSON.stringify(formData) })
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <form onSubmit={handleSubmit} className="opportunity-form">
          <div className="form-header">
            <label className="checkbox">
              <input
                type="checkbox"
                name="cvRequired"
                checked={formData.cvRequired}
                onChange={handleChange}
              />
              CV Required
            </label>
          </div>

          <div className="form-grid">
            <fieldset className="field">
              <legend>Opportunity Title</legend>
              <input
                type="text"
                name="opportunityTitle"
                value={formData.opportunityTitle}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="field">
              <legend>Number of Volunteers</legend>
              <input
                type="number"
                name="volunteers"
                value={formData.volunteers}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="field">
              <legend>Working Hours</legend>
              <input
                type="text"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="field">
              <legend>Start Date</legend>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="field">
              <legend>End Date</legend>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="field">
              <legend>Location</legend>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="field wide">
              <legend>Skills Required</legend>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="field wide">
              <legend>Benefits</legend>
              <input
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
              />
            </fieldset>
          </div>

          <fieldset className="field full">
            <legend>Description</legend>
            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </fieldset>

          <div className="footer">
            <fieldset className="field">
              <legend>Application Deadline</legend>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </fieldset>

            <button type="submit" className="submit-btn">
              {prefillData ? "Update Opportunity" : "Create New Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityFormOverlay;
