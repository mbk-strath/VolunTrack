import { useState, useEffect } from "react";
import { Moon, Sun, Bell } from "lucide-react";
import { IconButton, Button } from "@mui/material";
import CreateOpportunityDialog from "./createopportunityform.jsx"
import "../../styles/organization/topbarOrg.css";

const TopBarOrg = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="topbar-container">
      <div className="topbar-left">
        <Button 
          className="topbar-create-btn"
          variant="contained"
          onClick={() => setShowCreateDialog(true)}
        >
          Create New Opportunity
        </Button>
      </div>
      
      <div className="topbar-right">
        <IconButton
          onClick={toggleTheme}
          className="topbar-icon-btn"
        >
          {darkMode ? (
            <Sun className="topbar-icon" />
          ) : (
            <Moon className="topbar-icon" />
          )}
        </IconButton>
        <IconButton className="topbar-icon-btn">
          <Bell className="topbar-icon" />
        </IconButton>
        <div className="topbar-avatar">
          VO
        </div>
      </div>
      
      <CreateOpportunityDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </header>
  );
};

export default TopBarOrg;