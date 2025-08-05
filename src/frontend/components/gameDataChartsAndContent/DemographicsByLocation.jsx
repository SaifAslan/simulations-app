import React from "react";
import { Card } from "antd";

const demographics = [
  { location: "Beach", description: "Mostly young families with children, and students" },
  { location: "Arts District", description: "Children, young couples, and older couples" },
  { location: "Train Station", description: "Working commuters" },
  { location: "University", description: "Students" },
  { location: "Downtown", description: "Working professionals" },
  { location: "City Market", description: "Young couples and older couples" },
];

const DemographicsByLocation = () => {
  return (
    <Card >
      <ul>
        {demographics.map((item, index) => (
          <li key={index}>
            <strong>{item.location}:</strong> {item.description}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default DemographicsByLocation;
