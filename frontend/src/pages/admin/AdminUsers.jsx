import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/users.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
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

        const res = await axios.get("http://localhost:8000/api/all-memberships", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched memberships:", res.data);

        // Combine volunteers and organisations into one list
        const volunteerUsers = (res.data.volunteers || []).map((vol) => ({
          name: vol.name || "Unnamed Volunteer",
          email: vol.email,
          role: "Volunteer",
          status: vol.status || "Active",
          verified: vol.verified ? "Yes" : "No",
          lastLogin: vol.last_login || "—",
          signUpDate: vol.created_at
            ? new Date(vol.created_at).toLocaleDateString()
            : "—",
          totalHours: vol.total_hours || 0,
        }));

        const orgUsers = (res.data.organisations || []).map((org) => ({
          name: org.name || "Unnamed Organisation",
          email: org.email,
          role: "Organisation",
          status: org.status || "Active",
          verified: org.verified ? "Yes" : "No",
          lastLogin: org.last_login || "—",
          signUpDate: org.created_at
            ? new Date(org.created_at).toLocaleDateString()
            : "—",
          totalHours: org.total_hours || 0,
        }));

        setUsers([...volunteerUsers, ...orgUsers]);
      } catch (err) {
        console.error("Error fetching users:", err);

        if (err.response) {
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          setError("No response from server. Check your backend or CORS settings.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <h3 className="no-opp">Loading users...</h3>;
  if (error) return <h3 className="no-opp">{error}</h3>;

  return (
    <div className="UsersPage">
      <h2 className="page-title">User Management</h2>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Last Login</th>
              <th>Sign Up Date</th>
              <th>Total Hours</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{user.verified}</td>
                  <td>{user.lastLogin}</td>
                  <td>{user.signUpDate}</td>
                  <td className="text-center">{user.totalHours}</td>
                  <td className="text-center">
                    <button className="action-btn">⋮</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-opp">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
