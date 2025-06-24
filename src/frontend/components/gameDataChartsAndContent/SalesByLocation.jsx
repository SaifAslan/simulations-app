import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { location: "University", sales: 140 },
  { location: "Train Station", sales: 90 },
  { location: "Downtown", sales: 100 },
  { location: "City Market", sales: 110 },
  { location: "Beach", sales: 120 },
  { location: "Arts District", sales: 95 },
];

const SalesByLocation = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={salesData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="location" type="category" />
        <Tooltip />
        <Bar dataKey="sales" fill="#003366" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesByLocation;
