import React, { useEffect, useState } from "react";
import Search from "./Search";
import UserProfile from "../../components/main/UserProfile";
import { FaCalendarCheck } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function TopBar() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

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
      <Search
        onSearch={(q) => console.log("Search:", q)}
        onFilter={() => console.log("Open filter options")}
      />

      <div className="topRight">
        <FaCalendarCheck />

        {/* Dark mode toggle */}
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
    </div>
  );
}

export default TopBar;
