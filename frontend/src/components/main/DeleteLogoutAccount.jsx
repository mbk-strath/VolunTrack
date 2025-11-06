import React from "react";
import "../../styles/volunteer/AccountPageVol.css";

function DeleteAccount() {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const id = storedUser?.id;
      const token = localStorage.getItem("token");

      if (!id || !token) {
        alert("User not found or not logged in.");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/delete/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Account deleted successfully.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/register";
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("An error occurred while deleting your account.");
    }
  };

  return (
    <div className="logs">
      <div className="delAcc">
        <h2>Delete Account</h2>
        <p>
          Deleting your account is permanent. Once deleted, you will no longer
          be able to access your account or your personal information. This
          action cannot be undone.
        </p>
        <button onClick={handleDelete}>Delete Account</button>
      </div>

      <div className="logAcc">
        <h2>Log Out</h2>
        <p>
          Logging out will end your session immediately. You will need to log in
          again to access your account. Make sure you have saved all your work.
          This action cannot be undone.
        </p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default DeleteAccount;
