import React from "react";
import OpportunityCard from "../../components/volunteer/OpportunityCard";
import "../../styles/volunteer/OpportunityVol.css";
import Facebook from "../../assets/facebook.jpg";

function ViewOpportunityPage() {
  const data = [
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
    {
      name: "Facebook",
      image: Facebook,
      title: "Frontend Developer",
      startdate: "10/12/2025",
      enddate: "ongoing",
    },
  ];

  if (!data || data.length === 0) {
    return <h3 className="no-opp">No Available Opportunities</h3>;
  }

  return (
    <div className="ViewOpportunityPage">
      {data.map((opportunity, index) => (
        <OpportunityCard
          key={index}
          title={opportunity.title}
          name={opportunity.name}
          img={opportunity.image}
          startdate={opportunity.startdate}
          enddate={opportunity.enddate}
        />
      ))}
    </div>
  );
}

export default ViewOpportunityPage;
