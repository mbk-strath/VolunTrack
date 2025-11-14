import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa6";
import axios from "axios";

function CheckSystem({ participation }) {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState(
    participation.check_in
      ? participation.check_out
        ? "Checked out"
        : "Checked in"
      : "Not checked in"
  );
  const [checkInTime, setCheckInTime] = useState(
    participation.check_in || null
  );
  const [checkOutTime, setCheckOutTime] = useState(
    participation.check_out || null
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async () => {
    if (checkInTime) return;

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
        { headers: { Authorization: `Bearer ${token}` } }
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
    if (!checkInTime || checkOutTime) {
      setMessage(
        !checkInTime ? "You must check in first!" : "Already checked out!"
      );
      return;
    }

    const now = new Date().toISOString().slice(0, 19);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/add-participation",
        {
          volunteer_id: participation.volunteer_id,
          opportunity_id: participation.opportunity_id,
          check_in: checkInTime,
          check_out: now,
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
      <h3>{participation.opportunity_title}</h3>
      <h2 className="logtime">
        <FaClock className="icon" /> Logtime
      </h2>

      <div className="main">
        <div className="cont">
          <div className="time">
            <p className="title">Official Check-In:</p>
            <p className="exact">08:00 AM</p>
          </div>
          <div className="time">
            <p className="title">Current Time:</p>
            <p className="exact">{time.toLocaleTimeString()}</p>
          </div>
          {checkInTime && (
            <div className="time">
              <p className="title">Your Check-In:</p>
              <p className="exact">
                {new Date(checkInTime).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        <div className="cont">
          <div className="time">
            <p className="title">Official Check-Out:</p>
            <p className="exact">17:00 PM</p>
          </div>
          <div className="time">
            <p className="title">Status:</p>
            <p className="exact">{status}</p>
          </div>
          {checkOutTime && (
            <div className="time">
              <p className="title">Your Check-Out:</p>
              <p className="exact">
                {new Date(checkOutTime).toLocaleTimeString()}
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
