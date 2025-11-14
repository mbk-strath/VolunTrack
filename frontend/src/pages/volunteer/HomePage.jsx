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
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchData = async () => {
      try {
        // Fetch volunteer's applications
        const resApps = await axios.get(
          "http://localhost:8000/api/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const applications = resApps.data?.applications || [];
        setTotalApplications(applications.length);

        // Only accepted applications
        const accepted = applications.filter(
          (a) => a.status?.toLowerCase() === "accepted"
        );
        setAcceptedApplications(accepted);

        // Compute total hours and completed sessions if backend provides
        setCompletedSessions(accepted.length);
        setTotalHours(accepted.reduce((sum, a) => sum + (a.hours || 0), 0));
      } catch (err) {
        console.error("Failed to fetch applications:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <h3 className="no-opp">Loading dashboard...</h3>;

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
          <p className="no-opp">No accepted applications yet.</p>
        ) : (
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
