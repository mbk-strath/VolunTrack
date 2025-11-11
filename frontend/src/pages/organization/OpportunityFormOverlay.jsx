import React, { useState, useEffect } from "react";
import axios from "axios";
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
    checkInTime: "", // ✅ new
    checkOutTime: "", // ✅ new
    cvRequired: false,
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        ...prefillData,
      }));
    }
  }, [prefillData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.opportunityTitle)
      newErrors.opportunityTitle = "Title is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.skills) newErrors.skills = "Skills are required";
    if (!formData.volunteers)
      newErrors.volunteers = "Number of volunteers is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.deadline)
      newErrors.deadline = "Application deadline is required";
    if (!formData.workingHours) newErrors.workingHours = "Schedule is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.checkInTime)
      newErrors.checkInTime = "Check-in time is required";
    if (!formData.checkOutTime)
      newErrors.checkOutTime = "Check-out time is required";

    // Date validations
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }
    if (
      formData.startDate &&
      formData.deadline &&
      new Date(formData.deadline) > new Date(formData.startDate)
    ) {
      newErrors.deadline = "Deadline must be before or equal to start date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ Prepare request body including check-in/out
    const body = {
      title: formData.opportunityTitle,
      description: formData.description,
      required_skills: formData.skills,
      num_volunteers_needed: parseInt(formData.volunteers),
      start_date: formData.startDate,
      end_date: formData.endDate,
      schedule: formData.workingHours,
      benefits: formData.benefits,
      application_deadline: formData.deadline,
      location: formData.location,
      check_in_time: formData.checkInTime,
      check_out_time: formData.checkOutTime,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/create-opportunity",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        onClose();
      } else {
        setErrors({
          form: response.data.message || "Failed to create opportunity",
        });
      }
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <form onSubmit={handleSubmit} className="opportunity-form">
          {errors.form && <div className="form-error">{errors.form}</div>}
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

          <div className="form-grid-overlay">
            <fieldset className="field">
              <legend>Opportunity Title</legend>
              <input
                type="text"
                name="opportunityTitle"
                value={formData.opportunityTitle}
                onChange={handleChange}
              />
              {errors.opportunityTitle && (
                <span className="field-error">{errors.opportunityTitle}</span>
              )}
            </fieldset>

            <fieldset className="field">
              <legend>Number of Volunteers</legend>
              <input
                type="number"
                name="volunteers"
                value={formData.volunteers}
                onChange={handleChange}
              />
              {errors.volunteers && (
                <span className="field-error">{errors.volunteers}</span>
              )}
            </fieldset>

            <fieldset className="field">
              <legend>Working Hours</legend>
              <input
                type="text"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
              />
              {errors.workingHours && (
                <span className="field-error">{errors.workingHours}</span>
              )}
            </fieldset>

            {/* ✅ New Check-In/Out Inputs */}
            <fieldset className="field">
              <legend>Check-In Time</legend>
              <input
                type="time"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleChange}
              />
              {errors.checkInTime && (
                <span className="field-error">{errors.checkInTime}</span>
              )}
            </fieldset>

            <fieldset className="field">
              <legend>Check-Out Time</legend>
              <input
                type="time"
                name="checkOutTime"
                value={formData.checkOutTime}
                onChange={handleChange}
              />
              {errors.checkOutTime && (
                <span className="field-error">{errors.checkOutTime}</span>
              )}
            </fieldset>

            <fieldset className="field">
              <legend>Start Date</legend>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              {errors.startDate && (
                <span className="field-error">{errors.startDate}</span>
              )}
            </fieldset>

            <fieldset className="field">
              <legend>End Date</legend>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && (
                <span className="field-error">{errors.endDate}</span>
              )}
            </fieldset>

            <fieldset className="field">
              <legend>Location</legend>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && (
                <span className="field-error">{errors.location}</span>
              )}
            </fieldset>

            <fieldset className="field wide">
              <legend>Skills Required</legend>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
              {errors.skills && (
                <span className="field-error">{errors.skills}</span>
              )}
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
            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
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
              {errors.deadline && (
                <span className="field-error">{errors.deadline}</span>
              )}
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
