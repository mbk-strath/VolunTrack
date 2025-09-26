import React from "react";
import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import "../../styles/main/landing.css";

function LandingPage() {
  return (
    <div className="landingPage">
      <img src={Logo} alt="logo" className="logo" />
      <h1>VolunTrack</h1>
      <p className="tagline">"Your Journey to Giving Back Starts Here."</p>

      <p className="hero">
        With VolunTrack, you can easily find volunteer events, record your
        hours, and showcase your contributions to the community all in one
        place.
      </p>
      <div className="cta">
        <Link to="/signup" className="signup">
          Join us today
        </Link>
        <Link to="/login" className="login">
          Login
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
