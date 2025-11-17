import React, { useState, useEffect } from "react";
import axios from "axios";

const OtherDetailsPage = () => {
  const volunteerFields = ["country", "location", "bio", "skills"];
  const [formData, setFormData] = useState(
    volunteerFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Prefill form with stored user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    if (storedUser.volunteer) {
      const prefill = volunteerFields.reduce(
        (acc, field) => ({
          ...acc,
          [field]: storedUser.volunteer[field] || "",
        }),
        {}
      );
      setFormData(prefill);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const userId = storedUser.id;
      const token = localStorage.getItem("token");

      const payload = new FormData();
      volunteerFields.forEach((key) => {
        if (formData[key] !== "") payload.append(key, formData[key]);
      });

      // --- CHANGE 1: Add this line ---
      payload.append("_method", "PUT");

      // --- CHANGE 2: Use axios.post instead of axios.put ---
      const res = await axios.post(
        `http://localhost:8000/api/update/${userId}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract updated volunteer from nested response
      const updatedVolunteer = res.data.volunteer || {};

      // Merge into localStorage
      const mergedUser = { ...storedUser, volunteer: { ...updatedVolunteer } };
      localStorage.setItem("user", JSON.stringify(mergedUser));

      setFormData((prev) => ({ ...prev, ...updatedVolunteer }));
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
                value={formData[field]}
                onChange={handleChange}
              />
            ) : (
              <input
                name={field}
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
              />
            )}
          </label>
        ))}

        <button type="submit" disabled={loading} className="save">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {message && <p className="update-message-other">{message}</p>}
    </div>
  );
};

export default OtherDetailsPage;
