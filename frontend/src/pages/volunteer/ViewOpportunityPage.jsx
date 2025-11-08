import React, { useEffect, useState } from "react";
import axios from "axios";
import OpportunityCard from "../../components/volunteer/OpportunityCard";
import "../../styles/volunteer/OpportunityVol.css";
import Facebook from "../../assets/facebook.jpg"; // fallback image

function ViewOpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem("token"); // get token from storage
        const res = await axios.get(
          "http://localhost:8000/api/all-opportunities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched opportunities:", res.data);
        setOpportunities(res.data);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        if (err.response?.status === 404 || !err.response?.data?.length) {
          setError("No Available Opportunities");
        } else {
          setError("Failed to load opportunities. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return <h3 className="no-opp">Loading opportunities...</h3>;
  }

  if (error) {
    return <h3 className="no-opp">{error}</h3>;
  }

  if (!opportunities || opportunities.length === 0) {
    return <h3 className="no-opp">No Available Opportunities</h3>;
  }

  return (
    <div className="ViewOpportunityPage">
      {opportunities.map((opp) => (
        <OpportunityCard
          key={opp.id}
          title={opp.title}
          name={opp.location || "Unnamed Organization"} // use location or fallback
          img={Facebook} // fallback image
          startdate={opp.start_date}
          enddate={opp.end_date}
        />
      ))}
    </div>
  );
}

export default ViewOpportunityPage;
