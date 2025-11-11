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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch total hours
    const fetchTotalHours = async () => {
      try {
        const token = localStorage.getItem("token"); // make sure token is stored
        const res = await axios.get(
          "http://localhost:8000/api/my-participations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data && res.data.total_hours !== undefined) {
          setTotalHours(res.data.total_hours);
        }
      } catch (err) {
        console.error("Failed to fetch total hours:", err);
      }
    };

    fetchTotalHours();
  }, []);

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
            <p>3</p>
          </span>
        </div>
        <div className="sessions">
          <SiTicktick className="icon" />
          <span className="holder">
            <h4>Completed Sessions</h4>
            <p>2</p>
          </span>
        </div>
      </div>
      <div className="section2">
        <CheckSystem />
        <VolunteerHoursChart />
      </div>
    </div>
  );
}

export default HomePage;
