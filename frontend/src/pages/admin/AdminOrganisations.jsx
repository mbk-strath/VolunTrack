import React from "react";
import "../../styles/admin/org.css";

const AdminOrganisations = () => {
  return (
    <div className="admin-dashboard">
      
      
        <div className="header">
          <h1>Welcome user</h1>
          <div className="right">
            <span role="img" aria-label="sun">☀</span>
            <span role="img" aria-label="bell">🔔</span>
            <div className="circle">VO</div>
          </div>
        </div>

        <h1>Organisation Verification</h1>

        {/* Organisation Card 1 */}
        <div className="org-card">
          <div className="org-info">
            <strong>Hope4All</strong><br />
            Status: <span className="status">Pending</span>
          </div>
          <div className="btns">
            <button className="btn-approve">Approve</button>
            <button className="btn-reject">Reject</button>
            <button className="btn-view">View Documents</button>
          </div>
        </div>

        {/* Organisation Card 2 */}
        <div className="org-card">
          <div className="org-info">
            <strong>Hope4All</strong><br />
            Status: <span className="status">Pending</span>
          </div>
          <div className="btns">
            <button className="btn-approve">Approve</button>
            <button className="btn-reject">Reject</button>
            <button className="btn-view">View Documents</button>
          </div>
        </div>
    
    </div>
  );
};

export default AdminOrganisations;