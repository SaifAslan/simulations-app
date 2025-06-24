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
import { Card, Table } from "antd";

const footTrafficData = [
  { location: "University", footTraffic: 9247 },
  { location: "Train Station", footTraffic: 19432 },
  { location: "Downtown", footTraffic: 14170 },
  { location: "City Market", footTraffic: 8582 },
  { location: "Beach", footTraffic: 3120 },
  { location: "Arts District", footTraffic: 7091 },
];

const stationEntries = [
  { rank: 1, location: "Train Station", entries: 19432, color: "Yellow, Green" },
  { rank: 2, location: "Downtown", entries: 14170, color: "Blue, Yellow" },
  { rank: 3, location: "University", entries: 9247, color: "Blue" },
  { rank: 4, location: "City Market", entries: 8582, color: "Yellow" },
  { rank: 5, location: "Arts District", entries: 7091, color: "Yellow" },
  { rank: 6, location: "Beach", entries: 3120, color: "Blue" },
];

const columns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    sorter: (a, b) => a.rank - b.rank,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Entries",
    dataIndex: "entries",
    key: "entries",
    sorter: (a, b) => a.entries - b.entries,
  },
  {
    title: "Color",
    dataIndex: "color",
    key: "color",
  },
];

const FootTrafficBySubwayStop = () => {
  return (
    <Card title="Foot Traffic by Subway Stop (2015)">
      {/* Bar Chart Section */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={footTrafficData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="location" type="category" />
          <Tooltip />
          <Bar dataKey="footTraffic" fill="#0073e6" />
        </BarChart>
      </ResponsiveContainer>

      {/* Ranked Station Entries Section */}
      <h3 style={{ marginTop: "20px" }}>Ranked Station Entries (Typical Weekday FY2015)</h3>
      <Table 
        dataSource={stationEntries} 
        columns={columns} 
        pagination={false} 
        rowKey="rank" 
      />

      {/* Source Information */}
      <p style={{ marginTop: "10px", fontStyle: "italic", fontSize: "12px" }}>
        <strong>Source:</strong> Boomtown Department of Transportation (DOT), 
        Automated Fare Collection (AFC) FY2015
      </p>
    </Card>
  );
};

export default FootTrafficBySubwayStop;
