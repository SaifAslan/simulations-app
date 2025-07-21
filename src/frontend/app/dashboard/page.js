// components/Dashboard.js
"use client";
import { Tabs } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSimulations } from "../../store/slices/simulationSlice";
import axios from "axios";
import SimulationList from "../../components/SimulationList";
import KeyRedeem from "../../components/KeyRedeem";

const { TabPane } = Tabs;

const Dashboard = () => {
  const dispatch = useDispatch();
  const simulations = useSelector((state) => state.simulations.data);
  const userData = useSelector(state => state.user)
  useEffect(() => {
    dispatch(fetchSimulations());
  }, [dispatch]);

  return (
    <div style={{ marginTop: "64px", padding: "24px" }}>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Simulations" key="1">
        <KeyRedeem />
        <SimulationList simulations={simulations} />
      </TabPane>
      {/* Placeholder for Account tab */}
      <TabPane tab="Account" key="2">
        Account Management (Coming Soon)
      </TabPane>
    </Tabs>
    </div>
  );
};

export default Dashboard;
