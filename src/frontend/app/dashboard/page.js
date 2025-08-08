// /src/frontend/app/dashboard/page.js
"use client";
import { Tabs } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSimulations } from "../../store/slices/simulationSlice";
import { useAuthGuard } from "../../hooks/useAuth";
import SimulationList from "../../components/SimulationList";
import KeyRedeem from "../../components/KeyRedeem";

const { TabPane } = Tabs;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useAuthGuard();
  const simulations = useSelector((state) => state.simulations.data);
  const userData = useSelector(state => state.user);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      dispatch(fetchSimulations());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  if (!isAuthenticated || isLoading) {
    return null;
  }

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