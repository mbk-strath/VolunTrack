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
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const resHours = await axios.get(
          "http://localhost:8000/api/my-participations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (resHours.data?.total_hours !== undefined) {
          setTotalHours(resHours.data.total_hours);
        }

        const resApps = await axios.get(
          "http://localhost:8000/api/my-applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (resApps.data?.applications) {
          setTotalApplications(resApps.data.applications.length);
        }

        const resAll = await axios.get(
          "http://localhost:8000/api/all-participations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (resAll.data?.total_participations !== undefined) {
          setCompletedSessions(resAll.data.total_participations);
        }

        if (resAll.data?.participations) {
          setParticipations(resAll.data.participations);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        {participations
          .filter((p) => p.status?.trim().toLowerCase() === "approved")
          .map((p) => (
            <CheckSystem key={p.id} participation={p} />
          ))}

        <VolunteerHoursChart />
      </div>
    </div>
  );
}

export default HomePage;
