import React, { useState, useEffect } from "react";
import axios from "axios";

function OtherDetailsPage() {
  // Volunteer fields only (no city, no profile_image)
  const volunteerFields = ["country", "location", "bio", "skills"];

  const [formDataState, setFormDataState] = useState(
    volunteerFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Prefill from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    setFormDataState((prev) => ({
      ...prev,
      ...volunteerFields.reduce(
        (acc, key) => ({ ...acc, [key]: storedUser[key] || "" }),
        {}
      ),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      const token = localStorage.getItem("token");

      const sendData = new FormData();

      // Add volunteer fields
      volunteerFields.forEach((key) => {
        if (formDataState[key] !== "") {
          sendData.append(key, formDataState[key]);
        }
      });

      const res = await axios.patch(
        `http://localhost:8000/api/update/${userId}/`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updated = res.data;

      // Save to local storage
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updated })
      );

      // Update UI
      setFormDataState((prev) => ({ ...prev, ...updated }));

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-card-other">
      <h2 className="prof-other-title">Volunteer Additional Information</h2>

      <form className="form-column" onSubmit={handleSubmit}>
        {volunteerFields.map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {field === "bio" ? (
              <textarea
                name={field}
                placeholder={`Enter your ${field}`}
                value={formDataState[field] || ""}
                onChange={handleChange}
              />
            ) : (
              <input
                name={field}
                placeholder={`Enter your ${field}`}
                value={formDataState[field] || ""}
                onChange={handleChange}
              />
            )}
          </label>
        ))}

        <button type="submit" className="save" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {message && <p className="update-message-other">{message}</p>}
    </div>
  );
}

export default OtherDetailsPage;
