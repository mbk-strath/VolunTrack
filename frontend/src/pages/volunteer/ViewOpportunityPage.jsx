import React, { useEffect, useState } from "react";
import axios from "axios";
import OpportunityCard from "../../components/volunteer/OpportunityCard";
import ApplyOpportunityOverlay from "../../components/organization/ApplyOpportunityOverlay";
import "../../styles/volunteer/OpportunityVol.css";
import Facebook from "../../assets/facebook.jpg";

function ViewOpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [overlayError, setOverlayError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  const [overlayMessage, setOverlayMessage] = useState("");

  // Fetch all opportunities
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

  // Fetch opportunities the volunteer has already applied to
  useEffect(() => {
    const fetchAppliedOpportunities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/my-applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Safely handle API response
        const applicationsArray = Array.isArray(res.data)
          ? res.data
          : res.data.applications || [];

        const appliedIds = applicationsArray.map((app) => app.opportunity_id);
        setAppliedOpportunities(appliedIds);
      } catch (err) {
        console.error("Failed to fetch applied opportunities:", err);
      }
    };

    fetchAppliedOpportunities();
  }, []);

  // Load opportunity details
  const handleViewMore = async (id) => {
    setOverlayLoading(true);
    setOverlayError("");
    setSelectedOpportunity(null);
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

  const closeOverlay = () => {
    setSelectedOpportunity(null);
    setShowApplyModal(false);
    setOverlayMessage("");
  };

  const openApplyModal = () => {
    if (!selectedOpportunity) return;
    setShowApplyModal(true);
  };

  const handleNonCVApply = async () => {
    if (!selectedOpportunity) return;
    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const res = await axios.post(
        "http://localhost:8000/api/apply",
        { opportunity_id: selectedOpportunity.id, application_date: today },
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
      setAppliedOpportunities((prev) => [...prev, selectedOpportunity.id]);
    } catch (err) {
      setOverlayMessage(err.response?.data?.message || "Failed to apply.");
    }
  };

  if (loading) return <h3 className="no-opp">Loading opportunities...</h3>;
  if (error) return <h3 className="no-opp">{error}</h3>;
  if (!opportunities.length)
    return <h3 className="no-opp">No Available Opportunities</h3>;

  return (
    <div className="ViewOpportunityPage">
      {/* Opportunity Cards */}
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

      {/* Opportunity Overlay */}
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
                {appliedOpportunities.includes(selectedOpportunity.id) ? (
                  <button className="apply-btn" disabled>
                    Already Applied
                  </button>
                ) : selectedOpportunity.cvRequired ? (
                  <button className="apply-btn" onClick={openApplyModal}>
                    Apply
                  </button>
                ) : (
                  <button className="apply-btn" onClick={handleNonCVApply}>
                    Apply
                  </button>
                )}

                {/* Pop-up message */}
                {overlayMessage && (
                  <div className="overlay-popup-message">
                    {overlayMessage}
                    <button
                      className="close-popup"
                      onClick={() => setOverlayMessage("")}
                    >
                      ×
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* CV Upload Modal */}
      {showApplyModal && selectedOpportunity && (
        <ApplyOpportunityOverlay
          onClose={() => setShowApplyModal(false)}
          opportunity={selectedOpportunity}
          onApplied={(msg) => {
            setOverlayMessage(msg);
            setAppliedOpportunities((prev) => [
              ...prev,
              selectedOpportunity.id,
            ]);
          }}
        />
      )}
    </div>
  );
}

export default ViewOpportunityPage;
