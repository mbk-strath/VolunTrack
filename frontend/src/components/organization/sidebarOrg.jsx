import { LayoutDashboard, Search, Folder, Clock, MessageSquare, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/organization/sidebarOrg.css";
import Logo from "../../assets/logo.png";
import LogoDark from "../../assets/logo-dark.png";

const SidebarOrg = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if dark mode is active on mount
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
    
    // Listen for dark mode changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    
    return () => observer.disconnect();
  }, []);
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/organization" },
    { icon: Search, label: "Opportunities", path: "/dashboard/organization/opportunities" },
    { icon: Folder, label: "Applications", path: "/dashboard/organization/applications" },
    { icon: Clock, label: "History", path: "/dashboard/organization/history" },
    { icon: MessageSquare, label: "Messages", path: "/dashboard/organization/messages" },
    { icon: Settings, label: "Settings", path: "/dashboard/organization/settings" },
  ];

  return (
    <aside className="sidebar-container">
      <div>
        <div className="sidebar-logo">
          {darkMode ? (
            <img src={Logo} alt="VolunTrack Logo" className="sidebar-logo-image" />
          ) : (
            <img src={LogoDark} alt="VolunTrack Logo" className="sidebar-logo-image" />
          )}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-link ${isActive ? 'sidebar-nav-active' : ''}`}
            >
              <Icon className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarOrg;