import React from "react";
import "../../styles/admin/report.css";

const AdminReports = () => {

  const reports = [
    {
      reporter: "Linda Opollo",
      reason: "Spamming",
      evidence: "Shared unsolicited links in 3 events",
    },{
      reporter: "Linda Opollo",
      reason: "Spamming",
      evidence: "Shared unsolicited links in 3 events",
    }];

  return (
    <div className="ReportsPage">
        <h2>Flagged Reports</h2>

        {/* Report Card 1 */}
        <div className="rep-card">
          <div className="rep-info">
            <strong>Linda Opollo reported for Spamming</strong><br />
            Evidence: <span className="status">Shared unsolicitated links in 3 events </span>
          </div>
          <div className="btns">
            <button className="btn-review">Review</button>
            <button className="btn-suspend">Suspend</button>
            <button className="btn-ban">Ban</button>
          </div>
        </div>

        {/* Report Card 2 */}
        <div className="rep-card">
          <div className="rep-info">
            <strong>Linda Opollo reported for Spamming</strong><br />
            Evidence: <span className="status">Shared unsolicitated links in 3 events</span>
          </div>
          <div className="btns">
            <button className="btn-review">Review</button>
            <button className="btn-suspend">Suspend</button>
            <button className="btn-ban">Ban</button>
          </div>
        </div>
    
    </div>
  );
};

export default AdminReports;