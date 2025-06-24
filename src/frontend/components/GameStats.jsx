// ~root\src\components\GameStats.jsx
import React from 'react';

const GameStats = ({ daysLeft, totalRevenue }) => {
  return (
    <>
      <p>Days Left: {daysLeft}</p>
      <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
    </>
  );
};

export default GameStats;