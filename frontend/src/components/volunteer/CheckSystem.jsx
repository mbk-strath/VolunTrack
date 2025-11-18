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

  // Debug: log what we're receiving
  useEffect(() => {
    console.log("Participation data received:", participation);
  }, [participation]);

  // Helper function to format times consistently
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Helper to parse time strings robustly
  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    // Handle formats like "09:00", "09:00:00", "9:00"
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }
    return timeStr;
  };

  // --- FIXED DATE LOGIC ---

  // Get opportunity times - handle undefined/null gracefully
  const oppStartDate = participation?.opportunity_start_date || null;
  const oppStartTime =
    parseTimeString(participation?.opportunity_start_time) || null;
  const oppEndDate = participation?.opportunity_end_date || null;
  const oppEndTime =
    parseTimeString(participation?.opportunity_end_time) || null;

  console.log("Parsed opportunity times:", {
    oppStartDate,
    oppStartTime,
    oppEndDate,
    oppEndTime,
  });

  // 🔥 FIX: Add ":00" so we get HH:MM:SS (required for JS Date)
  // Handle date format - if it's ISO (YYYY-MM-DD), use it directly; if it's a date object, convert it
  const formatDateForParsing = (dateVal) => {
    if (!dateVal) return null;
    if (typeof dateVal === "string" && dateVal.includes("T")) {
      // Already ISO format, extract just the date part
      return dateVal.split("T")[0];
    }
    if (typeof dateVal === "string") {
      return dateVal; // Assume it's already YYYY-MM-DD
    }
    // If it's a Date object or other type, convert to string
    return new Date(dateVal).toISOString().split("T")[0];
  };

  const startDate = formatDateForParsing(oppStartDate);
  const endDate = formatDateForParsing(oppEndDate);

  console.log("Formatted dates:", {
    startDate,
    oppStartTime,
    endDate,
    oppEndTime,
    constructedStartUrl: `${startDate}T${oppStartTime}:00`,
    constructedEndUrl: `${endDate}T${oppEndTime}:00`,
  });

  const startTimeObject =
    startDate && oppStartTime
      ? new Date(`${startDate}T${oppStartTime}:00`)
      : new Date("Invalid");

  const endTimeObject =
    endDate && oppEndTime
      ? new Date(`${endDate}T${oppEndTime}:00`)
      : new Date("Invalid");

  console.log("Time objects:", {
    startTimeObject,
    endTimeObject,
    isStartTimeValid: !isNaN(startTimeObject),
    isEndTimeValid: !isNaN(endTimeObject),
  });

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
