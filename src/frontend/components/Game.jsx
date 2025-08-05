// src/frontend/components/Game.jsx
"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Row, Col, Card, Divider, Button } from "antd";
import combinations from "../data/combinations";
import researchResults from "../data/researchResults";
import scenarios from "../data/scenarios";
import GameContent from "./GameContent";
import GameStats from "./GameStats";
import MethodSelector from "./MethodSelector";
import ProductSelector from "./ProductSelector";
import LocationSelector from "./LocationSelector";

const { Content } = Layout;

const Game = ({ initialDays = 35, simulationId = "67720433a90800571dfe2243" }) => {
  const [daysLeft, setDaysLeft] = useState(initialDays);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [visitedLocations, setVisitedLocations] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  // Get token from Redux store
  const token = useSelector((state) => state.user?.userInfo?.token);

  // Check if game has ended and handle leaderboard
  useEffect(() => {
    if (daysLeft === 0 && !gameEnded) {
      handleGameEnd();
    }
  }, [daysLeft, gameEnded]);

  const handleGameEnd = async () => {
    setGameEnded(true);
    
    try {
      // Post the score
      await postScore(totalRevenue);
      
      // Fetch updated leaderboard
      const leaderboard = await fetchLeaderboard();
      setLeaderboardData(leaderboard);
      
      // Switch to leaderboard tab
      setActiveTab("3");
      
      alert(`Game Over! Your final score: $${totalRevenue}`);
    } catch (error) {
      console.error('Error handling game end:', error);
      alert('Game ended but there was an error updating the leaderboard.');
    }
  };

  const postScore = async (score) => {
    const response = await fetch('http://localhost:3030/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        simulationId: simulationId,
        score: score
      })
    });

    if (!response.ok) {
      throw new Error('Failed to post score');
    }

    return response.json();
  };

  const fetchLeaderboard = async () => {
    const response = await fetch(`http://localhost:3030/leaderboard?simulationId=${simulationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    return response.json();
  };

  // ... existing code ...
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setSelectedProduct(null);
    setSelectedLocation(null);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedLocation(null);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleSubmit = () => {
    if (!selectedMethod || !selectedProduct || !selectedLocation) {
      alert("Please select a method, product, and location.");
      return;
    }

    if (selectedMethod === "research") {
      handleResearch(selectedLocation, selectedProduct);
      return;
    }

    let daysToDeduct = selectedMethod === "pushcart" ? 1 : 7;

    let revenue =
      combinations[selectedLocation][selectedProduct][selectedMethod] *
      (selectedMethod === "pushcart" ? 1 : daysToDeduct);

    if (daysLeft < daysToDeduct) {
      alert("Not enough days left for this choice!");
      return;
    }

    setDaysLeft(daysLeft - daysToDeduct);
    setTotalRevenue((prevRevenue) => prevRevenue + revenue);

    const feedbackKey = `${selectedLocation}-${selectedProduct}`;
    const visitCount = visitedLocations[feedbackKey] || 0;
    const scenarioFeedback = scenarios[selectedLocation][selectedProduct];

    alert(
      `Scenario Feedback: ${
        visitCount === 0
          ? scenarioFeedback[0]
          : scenarioFeedback[1] ?? scenarioFeedback[0]
      }`
    );

    setVisitedLocations((prev) => ({
      ...prev,
      [feedbackKey]: (prev[feedbackKey] || 0) + 1,
    }));

    resetSelections();
  };

  const handleResearch = (location, product) => {
    if (daysLeft < 7) {
      alert("Not enough days left for research!");
      return;
    }

    setDaysLeft(daysLeft - 7);
    const researchResult = researchResults[location][product];
    alert(`Research Result: ${researchResult}`);
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedMethod(null);
    setSelectedProduct(null);
    setSelectedLocation(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Row gutter={[16, 16]}>
          <Col lg={12} sm={24}>
            <Card title="Future Content">
              <GameContent 
                activeTab={activeTab}
                leaderboardData={leaderboardData}
                setActiveTab={setActiveTab}
              />
            </Card>
          </Col>
          <Col lg={12} sm={24}>
            <Card title="Street Food Business Simulator">
              <GameStats daysLeft={daysLeft} totalRevenue={totalRevenue} />
              
              <Divider>Select Your Business Method</Divider>

              <MethodSelector
                selectedMethod={selectedMethod}
                onMethodSelect={handleMethodSelect}
                daysLeft={daysLeft}
              />

              <Divider>Select Your Product</Divider>

              <ProductSelector
                selectedProduct={selectedProduct}
                onProductSelect={handleProductSelect}
                disabled={!selectedMethod}
              />

              <Divider>Select Your Location</Divider>

              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
                disabled={!selectedProduct}
              />

              <Button
                style={{ marginTop: "1rem" }}
                type="primary"
                onClick={handleSubmit}
                disabled={
                  !selectedMethod || !selectedProduct || !selectedLocation || gameEnded
                }
              >
                Run!
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Game;