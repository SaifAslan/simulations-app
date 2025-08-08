// /src/frontend/app/simulations/food-business-sim/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Spin, Alert } from "antd";
import { useAuthGuard } from "../../../hooks/useAuth";
import Game from "../../../components/Game";

const { Title } = Typography;

const FoodBusinessSimPage = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const { data: simulations } = useSelector((state) => state.simulations);

  useEffect(() => {
    // Check if user has access to this simulation
    const checkAccess = () => {
      if (!isAuthenticated || authLoading) {
        return;
      }

      if (!simulations || simulations.length === 0) {
        setLoading(false);
        return;
      }

      const hasSimulation = simulations.some(simulation => {
        const route = simulation.simulation?.route || simulation.route;
        return route === '/food-business-sim';
      });

      setHasAccess(hasSimulation);
      setLoading(false);
    };

    if (isAuthenticated && !authLoading) {
      checkAccess();
    }
  }, [simulations, isAuthenticated, authLoading]);

  if (!isAuthenticated || authLoading) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        marginTop: '64px'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div style={{ marginTop: '64px', padding: '24px' }}>
        <Alert
          message="Access Denied"
          description="You don't have access to this simulation. Please contact your instructor."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <Game initialDays={35} />
    </div>
  );
};

export default FoodBusinessSimPage;