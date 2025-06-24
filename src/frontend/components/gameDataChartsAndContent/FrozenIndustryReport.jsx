import React from "react";
import { Card, Table, Typography } from "antd";

const { Title, Paragraph } = Typography;

const dataSource = [
  {
    key: "1",
    category: "Industry",
    iceCream: "50%",
    frozenYogurt: "22%",
    other: "19%",
  },
  {
    key: "2",
    category: "Foodservice",
    iceCream: "45%",
    frozenYogurt: "32%",
    other: "23%",
  },
];

const columns = [
  {
    title: "",
    dataIndex: "category",
    key: "category",
    width: "25%",
  },
  {
    title: "Ice Cream",
    dataIndex: "iceCream",
    key: "iceCream",
    align: "center",
  },
  {
    title: "Frozen Yogurt",
    dataIndex: "frozenYogurt",
    key: "frozenYogurt",
    align: "center",
  },
  {
    title: "Other",
    dataIndex: "other",
    key: "other",
    align: "center",
  },
];

const FrozenIndustryReport = () => {
  return (
    <Card >
      {/* Industry Snapshot */}
      <Paragraph>1% Annualized Growth expected over the next 5 years</Paragraph>
      <Paragraph>$12B Frozen Treat Industry</Paragraph>
      <Paragraph>$3.2B from Foodservice Locations</Paragraph>

      {/* Industry Data Table */}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        style={{ marginTop: "20px" }}
      />
    </Card>
  );
};

export default FrozenIndustryReport;
