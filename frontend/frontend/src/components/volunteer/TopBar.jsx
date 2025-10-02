import React from "react";
import Search from "./Search";
import UserProfile from "../../components/main/UserProfile";
import { FaCalendarCheck } from "react-icons/fa";
function TopBar() {
  return (
    <div className="Topbar">
      <Search
        onSearch={(q) => console.log("Search:", q)}
        onFilter={() => console.log("Open filter options")}
      />

      <div className="topRight">
        <FaCalendarCheck />
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
