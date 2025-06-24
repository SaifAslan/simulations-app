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
import { Card, Table, Typography } from "antd";

const { Title, Paragraph } = Typography;

const CityDemographicMix = () => {
  // Ensure the demographic data is always an array
  const demographicData = [
    {
      key: "1",
      location: "University",
      children: 6,
      youngAdults: 62,
      adults: 19,
      seniors: 13,
    },
    {
      key: "2",
      location: "Train Station",
      children: 12,
      youngAdults: 41,
      adults: 30,
      seniors: 17,
    },
    {
      key: "3",
      location: "Downtown",
      children: 6,
      youngAdults: 35,
      adults: 43,
      seniors: 16,
    },
    {
      key: "4",
      location: "City Market",
      children: 9,
      youngAdults: 28,
      adults: 26,
      seniors: 37,
    },
    {
      key: "5",
      location: "Beach",
      children: 33,
      youngAdults: 26,
      adults: 18,
      seniors: 23,
    },
    {
      key: "6",
      location: "Arts District",
      children: 30,
      youngAdults: 17,
      adults: 21,
      seniors: 32,
    },
  ];
  const columns = [
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Children (%)", dataIndex: "children", key: "children" },
    { title: "Young Adults (%)", dataIndex: "youngAdults", key: "youngAdults" },
    { title: "Adults (%)", dataIndex: "adults", key: "adults" },
    { title: "Seniors (%)", dataIndex: "seniors", key: "seniors" },
  ];
  return (
    <Card>
      {/* Bar Chart Section */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={demographicData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="location" type="category" />
          <Tooltip />
          <Bar dataKey="children" stackId="a" fill="#ff9999" />
          <Bar dataKey="youngAdults" stackId="a" fill="#9999ff" />
          <Bar dataKey="adults" stackId="a" fill="#99cc99" />
          <Bar dataKey="seniors" stackId="a" fill="#cc9966" />
        </BarChart>
      </ResponsiveContainer>

      {/* Demographic Mix Table */}
      {/* <Title level={3} style={{ marginTop: "20px" }}>
        Demographic Mix per Area (AGE)
      </Title>
      <Table dataSource={demographicData} columns={columns} /> */}

      {/* Summary Notes Section */}
      <Title level={4} style={{ marginTop: "20px" }}>
        Summary Notes
      </Title>
      <Paragraph>
        - <strong>Children</strong> found mostly at the beach or arts district.{" "}
        <br />- <strong>Young adults</strong> found mostly at the university,
        train, or downtown. <br />- <strong>Adults</strong> found mostly
        downtown or train. <br />- <strong>Older adults</strong> found mostly at
        arts district or market.
      </Paragraph>
    </Card>
  );
};

export default CityDemographicMix;
