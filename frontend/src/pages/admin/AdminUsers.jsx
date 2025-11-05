import React from "react";
import "../../styles/admin/users.css";

const AdminUsers = () => {
  const users = [
    {
      name: "Linda Opolo",
      email: "opololinda@gmail.com",
      role: "Volunteer",
      status: "Active",
      verified: "true",
      lastLogin: "20/10/2025",
      signUpDate: "02/10/2025",
      totalHours: 12,
    },
       {
      name: "Linda Opolo",
      email: "opololinda@gmail.com",
      role: "Volunteer",
      status: "Active",
      verified: "true",
      lastLogin: "20/10/2025",
      signUpDate: "02/10/2025",
      totalHours: 12,
    },   {
      name: "Linda Opolo",
      email: "opololinda@gmail.com",
      role: "Volunteer",
      status: "Active",
      verified: "true",
      lastLogin: "20/10/2025",
      signUpDate: "02/10/2025",
      totalHours: 12,
    },   {
      name: "Linda Opolo",
      email: "opololinda@gmail.com",
      role: "Volunteer",
      status: "Active",
      verified: "true",
      lastLogin: "20/10/2025",
      signUpDate: "02/10/2025",
      totalHours: 12,
    },   {
      name: "Linda Opolo",
      email: "opololinda@gmail.com",
      role: "Volunteer",
      status: "Active",
      verified: "true",
      lastLogin: "20/10/2025",
      signUpDate: "02/10/2025",
      totalHours: 12,
    },   {
      name: "Linda Opolo",
      email: "opololinda@gmail.com",
      role: "Volunteer",
      status: "Active",
      verified: "true",
      lastLogin: "20/10/2025",
      signUpDate: "02/10/2025",
      totalHours: 12,
    },
  ];

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
            {users.map((user, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
