import React from "react";
import { Card } from "antd";

const competition = [
  { location: "Downtown", stores: "1 smoothie store, 1 frozen yogurt store" },
  { location: "City Market", stores: "1 ice cream store, 1 smoothie stand" },
  { location: "Train Station", stores: "1 frozen yogurt store" },
  {
    location: "Arts District",
    stores: "1 frozen yogurt store, 1 ice cream stand",
  },
  { location: "University", stores: "None" },
  { location: "Beach", stores: "1 frozen yogurt stand, 1 ice cream store" },
];

const LocalCompetition = () => {
  return (
    <Card>
      <p>
        This is the first year Boomtown has issued food truck licenses, and you
        have one of only five offered! The other four licenses have been awarded
        to trucks serving savory foods (falafel, tacos, burgers, and Indian
        dosas). There are only a handful of frozen treat establishments, and
        they are spread out around the city:
      </p>
      <ul>
        {competition.map((item, index) => (
          <li key={index}>
            <strong>{item.location}:</strong> {item.stores}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default LocalCompetition;
