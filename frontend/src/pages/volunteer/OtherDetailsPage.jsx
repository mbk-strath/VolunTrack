import React, { useState, useEffect } from "react";
import axios from "axios";

function OtherDetailsPage() {
  const contactFields = ["country", "bio", "skills", "location"];

  const [contactData, setContactData] = useState(
    contactFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Prefill from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setContactData((prev) => ({
      ...prev,
      ...contactFields.reduce(
        (acc, key) => ({ ...acc, [key]: storedUser[key] || "" }),
        {}
      ),
    }));
  }, []);

  // Handle change
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form data using PATCH /update/{id}/
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      const token = localStorage.getItem("token");

      // Prepare multipart/form-data
      const formData = new FormData();
      contactFields.forEach((key) => {
        if (contactData[key]) formData.append(key, contactData[key]);
      });

      const res = await axios.patch(
        `http://localhost:8000/api/update/${userId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = res.data.user || res.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedUser })
      );
      setContactData((prev) => ({ ...prev, ...updatedUser }));
      setMessage(res.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error("Contact update error:", err);
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-card-other ">
      <h2 className="prof-other-title">Additional Information</h2>

      <form className="form-column" onSubmit={handleContactSubmit}>
        {contactFields.map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {field === "bio" ? (
              <textarea
                name={field}
                placeholder={`Enter your ${field}`}
                value={contactData[field] || ""}
                onChange={handleContactChange}
              />
            ) : (
              <input
                name={field}
                placeholder={`Enter your ${field}`}
                value={contactData[field] || ""}
                onChange={handleContactChange}
              />
            )}
          </label>
        ))}

        <button type="submit" className="save-other" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {message && <p className="update-message-other">{message}</p>}
    </div>
  );
}

export default OtherDetailsPage;
