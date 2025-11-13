import React, { useEffect, useState } from "react";
import UserProfile from "../../components/main/UserProfile";
import { FaCalendarCheck } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";
import "../../styles/organization/topbarOrg.css";
import OpportunityFormOverlay from "../../pages/organization/OpportunityFormOverlay";

function TopBarOrg() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="Topbar">
      <div className="topLeft">
        <IoMenuSharp className="menu" />

        <button className="create" onClick={() => setShowCreate(true)}>
          Create Opportunity
        </button>
      </div>

      <div className="topRight">
        <FaCalendarCheck />

        <button
          className="dark-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? (
            <MdLightMode className="icon" />
          ) : (
            <MdDarkMode className="icon" />
          )}
        </button>

        <UserProfile
          name="Linda Opolo"
          avatar=""
          className="topAvatar"
          showName={false}
        />
      </div>

      {showCreate && (
        <OpportunityFormOverlay onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

export default TopBarOrg;
