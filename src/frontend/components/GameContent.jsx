"use client";
import { Tabs } from "antd";
import React from "react";

import MarketDataContent from "./MarketDataContent";

function GameContetnt({ leaderboardData, activeTab }) {
  const items = [
    {
      key: "1",
      label: "About Boomtown",
      children: (
        <React.Fragment>
          <p>
            The year is 2018, and The Food Truck Challenge is about to begin!
            You have long dreamed of starting your own business—a food truck
            serving frozen treats seemed like the perfect mix of growth
            potential, personal flexibility, and fun.
          </p>
          <p>
            The Food Truck Challenge is a great opportunity for exposure and
            potential prize money. In this challenge, you will compete against
            other food truck teams across the country for the highest cumulative
            sales over five weeks. You have chosen Boomtown, a small city with a
            diverse urban landscape, to kick off your frozen treat venture.
            Throughout the challenge, you'll be learning a lot about Boomtown
            and the frozen treat market. Put all these pieces together carefully
            to craft the best menu and location combination for your venture.
          </p>
          <p>
            <strong>Remember</strong>, you only have five weeks to beat the
            competition. Good luck!
          </p>
          <img
            style={{ width: "100%" }}
            src="/Carnegie-Town-Main-Illustration.jpg"
          />
        </React.Fragment>
      ),
    },
    {
      key: "2",
      label: "Market Data",
      children: <MarketDataContent />,
    },
    {
      key: "3",
      label: "Leaderboard",
      children: (
        <ul>
          {leaderboardData.map((entry, index) => (
            <li key={entry._id}>
              #{index + 1} - {entry.user?.username ?? "Anonymous"}: $
              {entry.score}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Tabs activeKey={activeTab} defaultActiveKey="1" items={items} />
    </React.Fragment>
  );
}

export default GameContetnt;
