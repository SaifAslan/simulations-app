// src/frontend/app/simulations/page.js
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Typography, Spin, Button, Empty } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { fetchSimulations } from "../../store/slices/simulationSlice";
import Image from "next/image";

const { Title, Text } = Typography;

const SimulationsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: simulations, loading, error } = useSelector((state) => state.simulations);

  useEffect(() => {
    dispatch(fetchSimulations());
  }, [dispatch]);

  const handleSimulationClick = (simulation) => {
    // Handle missing route data gracefully
    const route = simulation.simulation?.route || simulation.route;
    if (route) {
      router.push(`/simulations/${route}`);
    } else {
      console.error("No route available for simulation:", simulation);
    }
  };

  const getSimulationTitle = (simulation) => {
    return simulation.simulation?.title || 
           simulation.simulation?.name || 
           simulation.title || 
           simulation.name || 
           "Untitled Simulation";
  };

  const getSimulationDescription = (simulation) => {
    const description = simulation.simulation?.description || simulation.description;
    if (!description) return "No description available";
    return description.length > 100 ? `${description.substring(0, 100)}...` : description;
  };

  const getSimulationImage = (simulation) => {
    return simulation.simulation?.image || 
           simulation.image || 
           "https://www.skillshare.com/blog/wp-content/uploads/2021/03/Screenshot2021-03-15at18.03.402-1.jpg";
  };

  const isSimulationAccessible = (simulation) => {
    const route = simulation.simulation?.route || simulation.route;
    return Boolean(route);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        marginTop: '64px',
        padding: '24px'
      }}>
        <Spin size="large" />
        <Text style={{ marginLeft: '16px', fontSize: '16px' }}>
          Loading simulations...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: '64px', padding: '24px' }}>
        <Title level={2}>Available Simulations</Title>
        <Card>
          <Text type="danger">Error loading simulations: {error}</Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '64px', padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Available Simulations
      </Title>
      
      {!simulations || simulations.length === 0 ? (
        <Empty
          description="No simulations available"
          style={{ marginTop: '48px' }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {simulations.map((simulation, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={simulation._id || index}>
              <Card
                hoverable={isSimulationAccessible(simulation)}
                cover={
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <Image
                      alt={getSimulationTitle(simulation)}
                      src={getSimulationImage(simulation)}
                      width={300}
                      height={200}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                }
                actions={[
                  <Button
                    key="play"
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleSimulationClick(simulation)}
                    disabled={!isSimulationAccessible(simulation)}
                    style={{ width: '90%' }}
                  >
                    {isSimulationAccessible(simulation) ? 'Start Simulation' : 'Unavailable'}
                  </Button>
                ]}
                style={{ 
                  opacity: isSimulationAccessible(simulation) ? 1 : 0.6,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Card.Meta
                  title={
                    <Text strong style={{ fontSize: '16px' }}>
                      {getSimulationTitle(simulation)}
                    </Text>
                  }
                  description={
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {getSimulationDescription(simulation)}
                    </Text>
                  }
                />
                {!isSimulationAccessible(simulation) && (
                  <Text type="warning" style={{ marginTop: '8px', fontSize: '12px' }}>
                    Route configuration missing
                  </Text>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SimulationsPage;