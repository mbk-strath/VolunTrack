import React, { useEffect, useState } from "react";
import axios from "axios";
import OpportunityCard from "../../components/volunteer/OpportunityCard";
import "../../styles/volunteer/OpportunityVol.css";
import Facebook from "../../assets/facebook.jpg"; // fallback image

function ViewOpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Overlay state
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [overlayError, setOverlayError] = useState("");
  const [overlayMessage, setOverlayMessage] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/all-opportunities",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOpportunities(res.data);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setError("Failed to load opportunities. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const handleViewMore = async (id) => {
    setOverlayLoading(true);
    setOverlayError("");
    setOverlayMessage("");
    setApplied(false);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/get-opportunity/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedOpportunity(res.data);
    } catch (err) {
      console.error("Error fetching opportunity details:", err);
      setOverlayError("Failed to load opportunity details.");
    } finally {
      setOverlayLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedOpportunity) return;

    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0]; // current date

      const res = await axios.post(
        "http://localhost:8000/api/apply",
        {
          opportunity_id: selectedOpportunity.id,
          application_date: today,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOverlayMessage(
        res.data.message || "Application submitted successfully!"
      );
      setApplied(true); // disable Apply button after success
    } catch (err) {
      console.error("Application error:", err);
      setOverlayMessage(
        err.response?.data?.message || "Failed to submit application."
      );
    }
  };

  const closeOverlay = () => setSelectedOpportunity(null);

  if (loading) return <h3 className="no-opp">Loading opportunities...</h3>;
  if (error) return <h3 className="no-opp">{error}</h3>;
  if (!opportunities || opportunities.length === 0)
    return <h3 className="no-opp">No Available Opportunities</h3>;

  return (
    <div className="ViewOpportunityPage">
      {opportunities.map((opp) => (
        <OpportunityCard
          key={opp.id}
          title={opp.title}
          name={opp.location || "Unnamed Organization"}
          img={Facebook}
          startdate={opp.start_date}
          enddate={opp.end_date}
          onViewMore={() => handleViewMore(opp.id)}
        />
      ))}

      {/* Overlay */}
      {selectedOpportunity && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={closeOverlay}>
              &times;
            </button>

            {overlayLoading ? (
              <p>Loading details...</p>
            ) : overlayError ? (
              <p>{overlayError}</p>
            ) : (
              <>
                <h2>{selectedOpportunity.title}</h2>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedOpportunity.description}
                </p>
                <p>
                  <strong>Required Skills:</strong>{" "}
                  {selectedOpportunity.required_skills}
                </p>
                <p>
                  <strong>Volunteers Needed:</strong>{" "}
                  {selectedOpportunity.num_volunteers_needed}
                </p>
                <p>
                  <strong>Start Date:</strong> {selectedOpportunity.start_date}{" "}
                  | <strong>End Date:</strong> {selectedOpportunity.end_date}
                </p>
                <p>
                  <strong>Schedule:</strong> {selectedOpportunity.schedule}
                </p>
                <p>
                  <strong>Location:</strong> {selectedOpportunity.location}
                </p>
                <p>
                  <strong>Benefits:</strong> {selectedOpportunity.benefits}
                </p>
                <p>
                  <strong>Application Deadline:</strong>{" "}
                  {selectedOpportunity.application_deadline}
                </p>

                {/* Apply Button */}
                <button
                  className="apply-btn"
                  onClick={handleApply}
                  disabled={applied}
                >
                  {applied ? "Applied" : "Apply"}
                </button>

                {/* Inline Message */}
                {overlayMessage && (
                  <p className="overlay-message">{overlayMessage}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewOpportunityPage;
