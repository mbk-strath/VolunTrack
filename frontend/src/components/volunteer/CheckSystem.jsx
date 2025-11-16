import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa6";
import axios from "axios";

function CheckSystem({ participation }) {
  // 1. This is your "current time". It has today's date and the time.
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

  // --- START: MODIFIED DATE LOGIC ---

  // 1. Try to create the date objects from the prop data
  const startTimeObject = new Date(
    `${participation.opportunity_start_date}T${participation.opportunity_start_time}`
  );
  const endTimeObject = new Date(
    `${participation.opportunity_end_date}T${participation.opportunity_end_time}`
  );

  // 2. NEW: Check if the dates are valid
  //    (This is the main fix for "Invalid Date")
  const isStartTimeValid = !isNaN(startTimeObject);
  const isEndTimeValid = !isNaN(endTimeObject);

  // 3. NEW: Check-in is only allowed if the start time is valid AND we are past it
  const isCheckInAllowed = isStartTimeValid && time >= startTimeObject;

  // 4. NEW: Format the times safely, providing a fallback "N/A"
  const officialCheckInTime = isStartTimeValid
    ? startTimeObject.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A"; // <-- This prevents "Invalid Date"

  const officialCheckOutTime = isEndTimeValid
    ? endTimeObject.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A"; // <-- This prevents "Invalid Date"

  // --- END: MODIFIED DATE LOGIC ---

  useEffect(() => {
    // This updates your "current time" every second
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async () => {
    if (checkInTime) return;

    // This stops the function if it's not time yet
    if (!isCheckInAllowed) {
      setMessage("It's not time to check in yet.");
      return;
    }

    // ... your check-in API call ...
    // (Remember to add your actual axios.post logic here)
    const now = new Date().toISOString().slice(0, 19);
    setLoading(true);
    // --- Example: ---
    // try {
    //   await axios.post("http://localhost:8000/api/check-in",
    //     { participation_id: participation.id },
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   setCheckInTime(now);
    //   setStatus("Checked in");
    //   setMessage("");
    // } catch (err) {
    //   console.error("Check-in failed:", err);
    //   setMessage("Failed to check in. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
    // --- For now, using your original logic: ---
    setCheckInTime(now);
    setStatus("Checked in");
    setLoading(false);
  };

  const handleCheckOut = async () => {
    if (!checkInTime || checkOutTime) return;

    // ... your check-out API call ...
    // (Remember to add your actual axios.post logic here)
    const now = new Date().toISOString().slice(0, 19);
    setLoading(true);
    // --- Example: ---
    // try {
    //   await axios.post("http://localhost:8000/api/check-out",
    //     { participation_id: participation.id },
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   setCheckOutTime(now);
    //   setStatus("Checked out");
    //   setMessage("");
    // } catch (err) {
    //   console.error("Check-out failed:", err);
    //   setMessage("Failed to check out. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
    // --- For now, using your original logic: ---
    setCheckOutTime(now);
    setStatus("Checked out");
    setLoading(false);
  };

  return (
    <div className="checkSystem">
      {/* This title now comes from the 'participation' prop */}
      <h3>{participation.opportunity_title}</h3>
      <h2 className="logtime">
        <FaClock className="icon" /> Logtime
      </h2>

      <div className="main">
        <div className="cont">
          <div className="time">
            <p className="title">Official Check-In:</p>
            {/* This will now show "N/A" instead of "Invalid Date" */}
            <p className="exact">{officialCheckInTime}</p>
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
            {/* This will now show "N/A" instead of "Invalid Date" */}
            <p className="exact">{officialCheckOutTime}</p>
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
          // This 'disabled' logic is now safe because 'isCheckInAllowed' is safe
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

      {/* NEW: This message is now safe and won't show a broken date */}
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
