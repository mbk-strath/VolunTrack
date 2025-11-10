import { LayoutDashboard, Search, Folder, Clock, MessageSquare, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/organization/sidebarOrg.css";

const SidebarOrg = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "Opportunities", path: "/opportunities" },
    { icon: Folder, label: "Applications", path: "/applications" },
    { icon: Clock, label: "History", path: "/history" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-text">VT</span>
        </div>
        <h1 className="sidebar-title">VolunTrack</h1>
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