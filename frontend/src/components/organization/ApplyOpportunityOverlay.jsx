import React, { useState } from "react";
import axios from "axios";
import "../../styles/organization/opportunityFormOverlay.css";

const ApplyOpportunityOverlay = ({ onClose, opportunity, onApplied }) => {
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (opportunity.cvRequired && !cvFile) {
      setMessage("Please attach your CV before submitting.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      formData.append("opportunity_id", opportunity.id);
      formData.append("volunteer_id", user.id);
      if (cvFile) formData.append("cv", cvFile);

      const res = await axios.post(
        "http://localhost:8000/api/apply",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const successMsg =
        res.data.message || "Application submitted successfully!";
      setMessage(successMsg);
      setCvFile(null);

      if (onApplied) {
        onApplied(successMsg);
      }

      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to apply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <form className="opportunity-form" onSubmit={handleSubmitApplication}>
          <h2>Apply: {opportunity.title}</h2>
          <p>
            <strong>Description:</strong> {opportunity.description}
          </p>
          <p>
            <strong>Location:</strong> {opportunity.location}
          </p>
          <p>
            <strong>Schedule:</strong> {opportunity.schedule}
          </p>

          {opportunity.cvRequired && (
            <fieldset className="field full">
              <legend>Attach Your CV</legend>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </fieldset>
          )}

          {message && <div className="form-error">{message}</div>}

          <button type="submit" className="submit-btn">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyOpportunityOverlay;
