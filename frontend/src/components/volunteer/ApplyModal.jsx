import React, { useState } from "react";
import axios from "axios";
import "../../styles/volunteer/ApplyOpportunityOverlay.css";

const ApplyOpportunityOverlay = ({ opportunity, onClose, onApplied }) => {
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cvFile) {
      setError("Please upload your CV to apply.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("opportunity_id", opportunity.id);
      formData.append("CV", cvFile);

      // Required application date (today)
      const today = new Date().toISOString().split("T")[0];
      formData.append("application_date", today);

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

      const message = res.data.message || "Application submitted successfully!";
      setSuccessMsg(message);

      // Notify parent component
      onApplied(message, opportunity.id);
    } catch (err) {
      console.error("Error applying:", err);
      setError(
        err.response?.data?.message || "Failed to apply. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-overlay">
      <div className="apply-overlay-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>Apply for: {opportunity.title}</h2>
        <p>
          Please upload your CV (PDF, DOC, DOCX) to complete your application.
        </p>

        {error && <p className="error">{error}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyOpportunityOverlay;
