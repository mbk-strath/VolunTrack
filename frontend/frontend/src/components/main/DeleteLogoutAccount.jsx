import React from "react";
import "../../styles/volunteer/AccountPageVol.css";

function DeleteAccount() {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // your token storage
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Logged out
        localStorage.removeItem("token"); // clear token
        window.location.href = "/login"; // redirect to login page
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <div className="logs">
      <div className="delAcc">
        <h2>Delete Account</h2>
        <p>
          Deleting your account is a permanent action. Once deleted, you will no
          longer be able to access your account, and all of your personal
          information. This action cannot be undone.
        </p>
        <button>Delete Account</button>
      </div>

      <div className="logAcc">
        <h2>Log Out</h2>
        <p>
          Logging out will end your session immediately. You will need to log in
          again to access your account. Make sure you have saved all your work,
          as any unsaved changes will be lost. This action cannot be undone.
        </p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default DeleteAccount;
