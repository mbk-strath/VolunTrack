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

  // Helper function to format times consistently
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // --- FIXED DATE LOGIC ---

  // 🔥 FIX: Add ":00" so we get HH:MM:SS (required for JS Date)
  const startTimeObject = new Date(
    `${participation.opportunity_start_date}T${participation.opportunity_start_time}:00`
  );

  const endTimeObject = new Date(
    `${participation.opportunity_end_date}T${participation.opportunity_end_time}:00`
  );

  const isStartTimeValid = !isNaN(startTimeObject);
  const isEndTimeValid = !isNaN(endTimeObject);

  const isCheckInAllowed = isStartTimeValid && time >= startTimeObject;

  const officialCheckInTime = isStartTimeValid
    ? startTimeObject.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const officialCheckOutTime = isEndTimeValid
    ? endTimeObject.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // ---------------------------------------------

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async () => {
    if (checkInTime) return;

    if (!isCheckInAllowed) {
      setMessage("It's not time to check in yet.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const now = new Date().toISOString().slice(0, 19);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/add-participation`,
        {
          volunteer_id: participation.volunteer_id,
          opportunity_id: participation.opportunity_id,
          check_in: now,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.participation) {
        setCheckInTime(response.data.participation.check_in);
        setStatus("Checked in");
        setMessage("✅ Checked in successfully!");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setMessage(
        `❌ Check-in failed: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!checkInTime || checkOutTime) return;

    setLoading(true);
    setMessage("");

    try {
      const now = new Date().toISOString().slice(0, 19);

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/update-participation/${
          participation.id
        }`,
        {
          check_out: now,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.participation) {
        setCheckOutTime(response.data.participation.check_out);
        setStatus("Checked out");
        setMessage("✅ Checked out successfully!");
      }
    } catch (error) {
      console.error("Check-out error:", error);
      setMessage(
        `❌ Check-out failed: ${error.response?.data?.message || error.message}`
      );
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
            <p className="exact">{officialCheckInTime}</p>
          </div>

          <div className="time">
            <p className="title">Current Time:</p>
            <p className="exact">{time.toLocaleTimeString()}</p>
          </div>

          {checkInTime && (
            <div className="time">
              <p className="title">Your Check-In:</p>
              <p className="exact">{formatTime(checkInTime)}</p>
            </div>
          )}
        </div>

        <div className="cont">
          <div className="time">
            <p className="title">Official Check-Out:</p>
            <p className="exact">{officialCheckOutTime}</p>
          </div>

          <div className="time">
            <p className="title">Status:</p>
            <p className="exact">{status}</p>
          </div>

          {checkOutTime && (
            <div className="time">
              <p className="title">Your Check-Out:</p>
              <p className="exact">{formatTime(checkOutTime)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="buttons">
        <button
          className="check-in"
          onClick={handleCheckIn}
          disabled={loading || status !== "Not checked in" || !isCheckInAllowed}
        >
          {loading && status === "Not checked in"
            ? "Checking in..."
            : "Check In"}
        </button>

        <button
          className="check-out"
          onClick={handleCheckOut}
          disabled={loading || status !== "Checked in" || !isCheckInAllowed}
        >
          {loading && status === "Checked in" ? "Checking out..." : "Check Out"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {!isCheckInAllowed && status === "Not checked in" && (
        <p className="message">
          {isStartTimeValid
            ? `Check-in will be available at ${officialCheckInTime}.`
            : "Check-in time is not set."}
        </p>
      )}
    </div>
  );
}

export default CheckSystem;
