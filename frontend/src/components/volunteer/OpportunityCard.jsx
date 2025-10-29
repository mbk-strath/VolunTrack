import React from "react";

function OpportunityCard({ img, name, title, startdate, enddate }) {
  return (
    <div className="OpportunityCard">
      <div className="org-name">
        <div className="org-img-container">
          <img src={img} alt="Organization Logo" className="org-img" />
        </div>
        <p>{name}</p>
      </div>
      <div className="org-details">
        <div className="detail-Container">
          <h3>Title:</h3>
          <p>{title}</p>
        </div>
        <div className="detail-Container">
          <h3>Start Date:</h3>
          <p>{startdate}</p>
        </div>
        <div className="detail-Container">
          <h3>End Date:</h3>
          <p>{enddate}</p>
        </div>
      </div>
      <button className="view">View More</button>
    </div>
  );
}

export default OpportunityCard;
