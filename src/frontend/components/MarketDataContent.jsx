import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme } from "antd";
import SalesByLocation from "./gameDataChartsAndContent/SalesByLocation";
import DemographicsByLocation from "./gameDataChartsAndContent/DemographicsByLocation";
import LocalCompetition from "./gameDataChartsAndContent/LocalCompetition";
import FootTrafficBySubwayStop from "./gameDataChartsAndContent/FootTrafficBySubwayStop";
import CityDemographicMix from "./gameDataChartsAndContent/CityDemographicMix";
import FrozenIndustryReport from "./gameDataChartsAndContent/FrozenIndustryReport";


const getItems = (panelStyle) => [
  {
    key: "1",
    label: "CITY DEMOGRAPHIC MIX BY LOCATION (2017)",
    children: <CityDemographicMix />,
    style: panelStyle,
  },
  {
    key: "2",
    label: "Sales by Location (2016)",
    children: <SalesByLocation />,
    style: panelStyle,
  },
  {
    key: "3",
    label: "Demographics by Location (2016)",
    children: <DemographicsByLocation />,
    style: panelStyle,
  },
  {
    key: "4",
    label: "Local Competition (Current Year)",
    children: <LocalCompetition />,
    style: panelStyle,
  },
  {
    key: "5",
    label: "Foot Traffic by Subway Stop (2015)",
    children: <FootTrafficBySubwayStop />,
    style: panelStyle,
  }
  ,
  {
    key: "6",
    label: "Frozen Industry Report (2017)",
    children: <FrozenIndustryReport />,
    style: panelStyle,
  }
];
function MarketDataContent() {
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{
        background: token.colorBgContainer,
      }}
      items={getItems(panelStyle)}
    />
  );
}

export default MarketDataContent;
