import React from "react";
import { GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton({ role }) {
  const handleLoginSuccess = async (response) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/google/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: response.credential,
          role: role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", role);
        alert("Google Login successful!");

        if (role === "volunteer") {
          window.location.href = "/volunteer/dashboard";
        } else if (role === "organization") {
          window.location.href = "/organization/dashboard";
        } else if (role === "admin") {
          window.location.href = "/admin/dashboard";
        }
      } else {
        alert("Google Login failed: " + (data.message || ""));
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => alert("Google login failed")}
        className="googleBtn"
      />
    </div>
  );
}

export default GoogleLoginButton;
