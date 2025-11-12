import React from "react";
import { useParams } from "react-router-dom";
import ApplicationsOrg from "./applicationsOrg";
function OpportunityApplicantsPage() {
  const { id } = useParams();

  return (
    <div className="applicants-page-container">
      <h2>Applicants for Opportunity</h2>

      <ApplicationsOrg opportunityId={id} />
    </div>
  );
}

export default OpportunityApplicantsPage;
