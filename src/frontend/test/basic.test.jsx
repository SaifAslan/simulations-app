import { render, screen, waitFor } from "@testing-library/react";
import Game from "../components/Game";
import GameContent from "../components/GameContent";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ReduxProvider } from "../store/provider";
import axios from "axios";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from '../store/slices/userSlice'; // or wherever your user slice is

jest.mock("axios");


const mockStore = configureStore({
  reducer: {
    user: userReducer,
    // add other reducers if needed
  },
  preloadedState: {
    user: {
      userInfo: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUyZTc3MTE3ZDBlYmJkNzZkOTE2MDEiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzUwMzI5OTI1LCJleHAiOjE3ODE4ODc1MjV9.7x-C0A2mp4xXf6VNYsDd1SkVrGWVBN0IJRT6Cp5evcY",
        // add other fields if needed
      },
    },
  },
});

const ProvidersWrapper = ({ children }) => (
  <Provider store={mockStore}>{children}</Provider>
);

describe("Game Component", () => {
  const leaderboardData = [
    {
      _id: "1",
      user: { username: "Alice" },
      score: 100,
      simulationName: "Sim A",
    },
    {
      _id: "2",
      user: { username: "Bob" },
      score: 90,
      simulationName: "Sim B",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits score and fetches leaderboard when daysLeft is 0", async () => {
    axios.post.mockResolvedValue({ status: 201 });
    axios.get.mockResolvedValue({ data: leaderboardData });

    render(<Game initialDays={0} />, { wrapper: ProvidersWrapper });

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3030/leaderboard",
      expect.objectContaining({
        simulationId: "67720433a90800571dfe2243",
        score: 0,
      }),
      expect.any(Object)
    );

    await waitFor(() => {
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent(/1 - Alice: \$100/);
      expect(listItems[1]).toHaveTextContent(/2 - Bob: \$90/);
    });
  });

  it("renders leaderboard tab with correct data", () => {
    render(<GameContent leaderboardData={leaderboardData} activeTab="3" />, {
      wrapper: ProvidersWrapper,
    });

    expect(screen.getByText("Leaderboard")).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent(/1 - Alice: \$100/);
    expect(listItems[1]).toHaveTextContent(/2 - Bob: \$90/);
  });
});
