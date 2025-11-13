import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa6";
import axios from "axios";

function CheckSystem({ participation }) {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState("Not checked in");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async () => {
    const token = localStorage.getItem("token");
    const now = new Date().toISOString().slice(0, 19);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/add-participation",
        {
          volunteer_id: participation.volunteer_id,
          opportunity_id: participation.opportunity_id,
          check_in: now,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCheckInTime(now);
      setStatus("Checked in");
      setMessage(res.data.message || "Checked in successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!checkInTime) {
      setMessage("You must check in first!");
      return;
    }

    const token = localStorage.getItem("token");
    const now = new Date().toISOString().slice(0, 19);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/add-participation",
        {
          volunteer_id: participation.volunteer_id,
          opportunity_id: participation.opportunity_id,
          check_in: checkInTime, // previously checked in
          check_out: now,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCheckOutTime(now);
      setStatus("Checked out");
      setMessage(res.data.message || "Checked out successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkSystem">
      <h2 className="logtime">
        <FaClock className="icon" /> Logtime
      </h2>
      <div className="main">
        <div className="cont">
          <div className="time">
            <p className="title">Official Check-In Time:</p>
            <p className="exact">
              <span>08:00 AM</span>
            </p>
          </div>
          <div className="time">
            <p className="title">Current Time:</p>
            <p className="exact">
              <span>{time.toLocaleTimeString()}</span>
            </p>
          </div>
          {checkInTime && (
            <div className="time">
              <p className="title">Your Check-In Time:</p>
              <p className="exact">
                <span>{new Date(checkInTime).toLocaleTimeString()}</span>
              </p>
            </div>
          )}
        </div>

        <div className="cont">
          <div className="time">
            <p className="title">Official Check-Out Time:</p>
            <p className="exact">
              <span>17:00 PM</span>
            </p>
          </div>
          <div className="time">
            <p className="title">Status:</p>
            <p className="exact">{status}</p>
          </div>
          {checkOutTime && (
            <div className="time">
              <p className="title">Your Check-Out Time:</p>
              <p className="exact">
                <span>{new Date(checkOutTime).toLocaleTimeString()}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="buttons">
        <button
          className="check-in"
          onClick={handleCheckIn}
          disabled={loading || status !== "Not checked in"}
        >
          {loading && status === "Not checked in"
            ? "Checking in..."
            : "Check In"}
        </button>
        <button
          className="check-out"
          onClick={handleCheckOut}
          disabled={loading || status !== "Checked in"}
        >
          {loading && status === "Checked in" ? "Checking out..." : "Check Out"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default CheckSystem;
