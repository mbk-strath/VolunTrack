import SidebarOrg from "./src/components/organization/sidebarOrg.jsx";
import TopBarOrg from "./src/components/organization/topBarOrg.jsx";
import "../../styles/layouts/dashboardLayoutOrganization.css";

const DashboardLayoutOrganization = ({ children }) => {
  return (
    <div className="layout-container">
      <SidebarOrg />
      <TopBarOrg />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayoutOrganization;