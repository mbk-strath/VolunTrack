import React, { useState } from "react";
import "../../styles/organization/opportunityFormOverlay.css";

const OpportunityFormOverlay = ({ onClose }) => {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="overlay">
      <div className="form-container">
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
              Create New Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityFormOverlay;
