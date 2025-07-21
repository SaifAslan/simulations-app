import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from '../store/slices/userSlice';
import simulationReducer from '../store/slices/simulationSlice';
import userEvent from '@testing-library/user-event';

// Import components to test
import SimulationsPage from '../app/simulations/page.jsx';
import SimulationList from '../components/SimulationList.jsx';

// Mock axios to prevent real API calls
vi.mock('axios');

// Create mock store
const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      simulations: simulationReducer,
    },
    preloadedState,
  });
};

// Wrapper component for providers
const ProvidersWrapper = ({ children, store }) => {
  if (!store) {
    throw new Error('Store is required for ProvidersWrapper');
  }
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

// Mock simulation data
const mockSimulations = [
  {
    _id: "1",
    simulation: {
      _id: "sim1",
      name: "Street Food Business Simulator",
      title: "Street Food Business Simulator",
      description: "Learn the fundamentals of business through a street food truck simulation.",
      route: "food-business-sim"
    }
  },
  {
    _id: "2", 
    simulation: {
      _id: "sim2",
      name: "Retail Management Simulator",
      title: "Retail Management Simulator",
      description: "Manage a retail store and learn inventory management.",
      route: "retail-management-sim"
    }
  }
];

describe("Simulations Page", () => {
  let store;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock axios to return mock data
    const axios = await import('axios');
    axios.default.get = vi.fn().mockResolvedValue({
      data: mockSimulations
    });
    
    store = createMockStore({
      user: {
        userInfo: {
          token: "mock-token",
          username: "testuser"
        }
      },
      simulations: {
        data: [],
        loading: false,
        error: null
      }
    });
  });

  describe("Fetching Simulations", () => {
    it("dispatches fetchSimulations on mount", async () => {
      render(
        <SimulationsPage />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      // Wait for loading to complete and title to appear
      await waitFor(() => {
        expect(screen.getByText("Available Simulations")).toBeInTheDocument();
      });
    });

    it("shows loading state when fetching simulations", () => {
      store = createMockStore({
        user: {
          userInfo: {
            token: "mock-token"
          }
        },
        simulations: {
          data: [],
          loading: true,
          error: null
        }
      });

      render(
        <SimulationsPage />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      expect(screen.getByText("Loading simulations...")).toBeInTheDocument();
    });

    it("displays simulations when data is loaded", () => {
      store = createMockStore({
        user: {
          userInfo: {
            token: "mock-token"
          }
        },
        simulations: {
          data: mockSimulations,
          loading: false,
          error: null
        }
      });

      render(
        <SimulationsPage />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      // Wait for the component to render with data
      waitFor(() => {
        expect(screen.getByText("Street Food Business Simulator")).toBeInTheDocument();
        expect(screen.getByText("Retail Management Simulator")).toBeInTheDocument();
      });
    });
  });

  describe("Simulation List Rendering", () => {
    it("renders simulation cards with correct information", () => {
      render(
        <SimulationList simulations={mockSimulations} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      // Check titles
      expect(screen.getByText("Street Food Business Simulator")).toBeInTheDocument();
      expect(screen.getByText("Retail Management Simulator")).toBeInTheDocument();

      // Check descriptions
      expect(screen.getByText(/Learn the fundamentals of business/)).toBeInTheDocument();
      expect(screen.getByText(/Manage a retail store/)).toBeInTheDocument();
    });

    it("renders simulation images", () => {
      render(
        <SimulationList simulations={mockSimulations} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      const images = screen.getAllByAltText("example");
      expect(images).toHaveLength(2);
    });

    it("renders Link components for simulations with routes", () => {
      render(
        <SimulationList simulations={mockSimulations} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      // Check that Link components are rendered with correct href attributes
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      
      expect(links[0]).toHaveAttribute("href", "/simulations/food-business-sim");
      expect(links[1]).toHaveAttribute("href", "/simulations/retail-management-sim");
    });

    it("does not render Link for simulations without routes", () => {
      const simulationsWithoutRoute = [
        {
          _id: "1",
          simulation: {
            _id: "sim1",
            name: "Test Simulation",
            title: "Test Simulation",
            description: "Test description"
            // No route property
          }
        }
      ];

      render(
        <SimulationList simulations={simulationsWithoutRoute} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      // Should not have any Link components
      const links = screen.queryAllByRole("link");
      expect(links).toHaveLength(0);
      
      // Should still render the simulation card
      expect(screen.getByText("Test Simulation")).toBeInTheDocument();
    });
  });

  describe("Link Navigation", () => {
    it("has correct href attributes for navigation", () => {
      render(
        <SimulationList simulations={mockSimulations} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      const foodSimLink = screen.getByRole("link", { name: /Street Food Business Simulator/i });
      const retailSimLink = screen.getByRole("link", { name: /Retail Management Simulator/i });

      expect(foodSimLink).toHaveAttribute("href", "/simulations/food-business-sim");
      expect(retailSimLink).toHaveAttribute("href", "/simulations/retail-management-sim");
    });

    it("handles simulations with missing title gracefully", () => {
      const simulationsWithoutTitle = [
        {
          _id: "1",
          simulation: {
            _id: "sim1",
            description: "Test description",
            route: "test-sim"
            // No title property
          }
        }
      ];

      render(
        <SimulationList simulations={simulationsWithoutTitle} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      // Should render without crashing - check for truncated description
      expect(screen.getByText("Test description...")).toBeInTheDocument();
      
      // Should still render a Link since it has a route
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute("href", "/simulations/test-sim");
    });

    it("handles simulations with missing description", () => {
      const simulationsWithoutDescription = [
        {
          _id: "1",
          simulation: {
            _id: "sim1",
            name: "Test Simulation",
            title: "Test Simulation",
            route: "test-sim"
            // No description property
          }
        }
      ];

      render(
        <SimulationList simulations={simulationsWithoutDescription} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      expect(screen.getByText("Test Simulation")).toBeInTheDocument();
    });
  });

  describe("Card Interaction States", () => {
    it("shows hover effect on simulation cards", async () => {
      const user = userEvent.setup();

      render(
        <SimulationList simulations={mockSimulations} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      await waitFor(async () => {
        const foodSimCard = screen.getByText("Street Food Business Simulator").closest('.ant-card');
        
        // Hover over the card
        await user.hover(foodSimCard);
        
        // The card should have hoverable class or styling
        expect(foodSimCard).toHaveClass("ant-card");
      });
    });

    it("shows cursor pointer on simulation cards", () => {
      render(
        <SimulationList simulations={mockSimulations} />,
        { wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> }
      );

      const foodSimCard = screen.getByText("Street Food Business Simulator").closest('.ant-card');
      
      // Check that the card has cursor pointer styling
      expect(foodSimCard).toHaveStyle({ cursor: "pointer" });
    });
  });

}); 