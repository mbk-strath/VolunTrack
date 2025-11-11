import React from "react";
import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa6";
function CheckSystem() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="checkSystem">
      <h2 className="logtime">
        <FaClock className="icon" />
        Logtime
      </h2>
      <div className="main">
        <div className="cont">
          <div className="time">
            <p className="title">Official Check-In Time: </p>
            <p className="exact">
              <span>8:00 </span>AM
            </p>
          </div>
          <div className="time">
            <p className="title">Current Time: </p>
            <p className="exact">
              <span>{time.toLocaleTimeString()} </span>
            </p>
          </div>
        </div>
        <div className="cont">
          <div className="time">
            <p className="title">Official Check-Out Time: </p>
            <p className="exact">
              <span>17:00 </span>PM
            </p>
          </div>
          <div className="time">
            <p className="title">Status: </p>
            <p className="exact">
              <p>Not checked in</p>
            </p>
          </div>
        </div>
      </div>
      <div className="buttons">
        <button className="check-in">Check In</button>
        <button className="check-out">Check Out</button>
      </div>
    </div>
  );
}

export default CheckSystem;
