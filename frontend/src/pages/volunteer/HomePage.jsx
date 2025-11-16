import React, { useState, useEffect } from "react";
import "../../styles/volunteer/homeVol.css";
import { Ri24HoursFill } from "react-icons/ri";
import { FaLightbulb } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import CheckSystem from "../../components/volunteer/CheckSystem";
import VolunteerHoursChart from "../../components/volunteer/VolunteerHoursChart";
import axios from "axios";

function HomePage() {
  const [user, setUser] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);

  // This state will hold the COMBINED data (app + opportunity details)
  const [acceptedApplications, setAcceptedApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchData = async () => {
      try {
        // --- START OF CHANGES ---

        // 1. Fetch both /my-applications AND /all-opportunities at the same time
        const [resApps, resOps] = await Promise.all([
          axios.get("http://localhost:8000/api/my-applications", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/all-opportunities", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const applications = resApps.data?.applications || [];
        const allOpportunities = resOps.data || []; // Your API response structure

        setTotalApplications(applications.length);

        // 2. Filter for accepted applications
        const accepted = applications.filter(
          (a) => a.status?.toLowerCase() === "accepted"
        );

        // 3. Combine the 'app' data with the 'opportunity' data
        const combinedData = accepted
          .map((app) => {
            // Find the full opportunity details for this application
            const opportunity = allOpportunities.find(
              (op) => op.id === app.opportunity_id
            );

            // 4. Create a new object with all the data CheckSystem needs
            if (opportunity) {
              return {
                ...app, // This has check_in, check_out, volunteer_id, etc.

                // This is the NEW data that fixes "Invalid Date"
                opportunity_title: opportunity.title,
                opportunity_start_date: opportunity.start_date,
                opportunity_start_time: opportunity.start_time,
                opportunity_end_date: opportunity.end_date,
                opportunity_end_time: opportunity.end_time,
              };
            }
            // Log an error if the opportunity isn't found
            console.error(
              `Opportunity not found for application ID: ${app.id}`
            );
            return null;
          })
          .filter(Boolean); // filter(Boolean) removes any nulls

        // 5. Set the state with the new, complete data
        setAcceptedApplications(combinedData);

        // --- END OF CHANGES ---

        // Compute total hours and completed sessions
        setCompletedSessions(combinedData.length); // Use combinedData here
        setTotalHours(combinedData.reduce((sum, a) => sum + (a.hours || 0), 0)); // Use combinedData here
      } catch (err) {
        console.error("Failed to fetch data:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <h3 className="no-opp">Loading dashboard...</h3>;

  // The rest of your file is unchanged.
  return (
    <div className="homeVolPage">
      <h2 className="username">Welcome {user ? user.name : "Volunteer"}</h2>

      <div className="header">
        <div className="hours">
          <Ri24HoursFill className="icon" />
          <span className="holder">
            <h4>Total Hours</h4>
            <p>{totalHours}</p>
          </span>
        </div>
        <div className="applications">
          <FaLightbulb className="icon" />
          <span className="holder">
            <h4>Total Applications</h4>
            <p>{totalApplications}</p>
          </span>
        </div>
        <div className="sessions">
          <SiTicktick className="icon" />
          <span className="holder">
            <h4>Completed Sessions</h4>
            <p>{completedSessions}</p>
          </span>
        </div>
      </div>

      <div className="section2">
        {acceptedApplications.length === 0 ? (
          <p className="no-acc">
            Log System unavailable! No accepted applications yet.
          </p>
        ) : (
          // This 'app' object now contains all the date/time data
          // and the "Invalid Date" error will be gone.
          acceptedApplications.map((app) => (
            <CheckSystem key={app.id} participation={app} />
          ))
        )}

        <VolunteerHoursChart participations={acceptedApplications} />
      </div>
    </div>
  );
}

export default HomePage;
