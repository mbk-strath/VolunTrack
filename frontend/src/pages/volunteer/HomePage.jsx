import React from "react";
import { useState, useEffect } from "react";
import "../../styles/volunteer/HomeVol.css";
import { Ri24HoursFill } from "react-icons/ri";
import { FaLightbulb } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import CheckSystem from "../../components/volunteer/CheckSystem";
import VolunteerHoursChart from "../../components/volunteer/VolunteerHoursChart";

function HomePage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <div className="homeVolPage">
      <h2 className="username">Welcome {user ? user.name : "Volunteer"}</h2>
      <div className="header">
        <div className="hours">
          <Ri24HoursFill className="icon" />
          <span className="holder">
            <h4>Total Hours</h4>
            <p>42</p>
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
