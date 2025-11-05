import React, { useEffect, useState} from "react";
import "../../styles/admin/org.css";
import axios from "axios";

const AdminOrganisations = () => {
  const [organisations, setOrganisations] = useState([]);
  useEffect(() => {
    // Fetch organisations pending verification from the backend
    const fetchOrganisations = async () => {
      try {
        const response = await axios.get("/api/admin/organisations/pending");
        setOrganisations(response.data);
      }catch (error) {
      console.error("Error fetching organisations:", error);
    }
  };

  fetchOrganisations();
}, []);
  return (
    <div className="OrganisationsPage">
        <h2>Organisation Verification</h2>

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