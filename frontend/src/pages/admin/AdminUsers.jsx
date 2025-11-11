import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/users.css";

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState("volunteers");
  const [volunteers, setVolunteers] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authorization token found.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        const res = await axios.get(
          "http://localhost:8000/api/all-memberships",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched memberships:", res.data);

        setVolunteers(res.data.volunteers || []);
        setOrganisations(res.data.organisations || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response) setError(`Server Error: ${err.response.status}`);
        else if (err.request)
          setError(
            "No response from server. Check your backend or CORS settings."
          );
        else setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h3 className="loading-text">Loading users...</h3>
      </div>
    );

  if (error) return <h3 className="no-opp">{error}</h3>;

  return (
    <div className="UsersPage">
      <h2 className="page-title">User Management</h2>

      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === "volunteers" ? "active" : ""}`}
          onClick={() => setActiveTab("volunteers")}
        >
          Volunteers
        </button>
        <button
          className={`tab-btn ${activeTab === "organisations" ? "active" : ""}`}
          onClick={() => setActiveTab("organisations")}
        >
          Organisations
        </button>
      </div>

      {activeTab === "volunteers" && (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Bio</th>
                <th>Skills</th>
                <th>Location</th>
                <th>Profile Image</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length > 0 ? (
                volunteers.map((vol) => (
                  <tr key={vol.user_id}>
                    <td>{vol.user_id}</td>
                    <td>{vol.name || "—"}</td>
                    <td>{vol.email || "—"}</td>
                    <td>{vol.gender || "—"}</td>
                    <td>{vol.phone || "—"}</td>
                    <td>{vol.country || "—"}</td>
                    <td>{vol.bio || "—"}</td>
                    <td>{vol.skills || "—"}</td>
                    <td>{vol.location || "—"}</td>
                    <td>
                      {vol.profile_image ? (
                        <img
                          src={vol.profile_image}
                          alt="Profile"
                          className="profile-img"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{vol.role || "Volunteer"}</td>
                    <td>{vol.is_verified ? "Yes" : "No"}</td>
                    <td>{vol.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      {vol.created_at
                        ? new Date(vol.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="no-opp">
                    No volunteers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "organisations" && (
        <div className="table-container org">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Org Name</th>
                <th>Org Type</th>
                <th>Reg Number</th>
                <th>Country</th>
                <th>City</th>
                <th>Street Address</th>
                <th>Website</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {organisations.length > 0 ? (
                organisations.map((org) => (
                  <tr key={org.user_id}>
                    <td>{org.user_id}</td>
                    <td>{org.name || "—"}</td>
                    <td>{org.email || "—"}</td>
                    <td>{org.gender || "—"}</td>
                    <td>{org.phone || "—"}</td>
                    <td>{org.org_name || "—"}</td>
                    <td>{org.org_type || "—"}</td>
                    <td>{org.registration_number || "—"}</td>
                    <td>{org.country || "—"}</td>
                    <td>{org.city || "—"}</td>
                    <td>{org.street_address || "—"}</td>
                    <td>{org.website || "—"}</td>
                    <td>{org.role || "Organisation"}</td>
                    <td>{org.is_verified ? "Yes" : "No"}</td>
                    <td>{org.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      {org.created_at
                        ? new Date(org.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="no-opp">
                    No organisations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
