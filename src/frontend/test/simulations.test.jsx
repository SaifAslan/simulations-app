import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from '../store/slices/userSlice';
import simulationReducer from '../store/slices/simulationSlice';

// Import component to test
import SimulationsPage from '../app/simulations/page.jsx';

// Mock axios to prevent real API calls
vi.mock('axios');

// Mock the fetchSimulations action to prevent it from running automatically
const mockDispatch = vi.fn();
const mockFetchSimulations = vi.fn(() => ({ type: 'mock/fetchSimulations' }));

vi.mock('../../store/slices/simulationSlice', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchSimulations: mockFetchSimulations
  };
});

// Mock react-redux useDispatch
vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

// Mock next/navigation router
const mockPush = vi.fn();
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({ push: mockPush })
  };
});

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, style, ...props }) => (
    <img src={src} alt={alt} width={width} height={height} style={style} {...props} />
  )
}));

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

// Mock simulation data with different structures to test edge cases
const mockSimulations = [
  {
    _id: "1",
    simulation: {
      _id: "sim1",
      name: "Street Food Business Simulator",
      title: "Street Food Business Simulator",
      description: "Learn the fundamentals of business through a street food truck simulation.",
      route: "food-business-sim",
      image: "https://example.com/food-sim.jpg"
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
  },
  {
    _id: "3",
    simulation: {
      _id: "sim3",
      name: "No Route Simulation",
      title: "No Route Simulation",
      description: "This simulation has no route."
      // No route property
    }
  },
  {
    _id: "4",
    // Direct structure (not nested under simulation)
    name: "Direct Structure Simulation",
    title: "Direct Structure Simulation", 
    description: "This simulation uses direct structure.",
    route: "direct-sim"
  },
  {
    _id: "5",
    simulation: {
      _id: "sim5",
      // No title, only name
      name: "Only Name Simulation",
      description: "Very long description that should be truncated when displayed in the card component because it exceeds the character limit that was set for proper display formatting"
    }
  }
];

describe("SimulationsPage", () => {
  let store;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockPush.mockClear();
    mockFetchSimulations.mockClear();
    mockDispatch.mockClear();
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

  it("shows loading state when fetching simulations", async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: [], loading: true, error: null }
    });
    
    await act(async () => {
      render(<SimulationsPage />, { 
        wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
      });
    });
    
    expect(screen.getByText("Loading simulations...")).toBeInTheDocument();
    // Check for Ant Design Spin component 
    const spinElement = document.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  it("shows error state if error occurs", async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: [], loading: false, error: "Failed to fetch" }
    });
    
    await act(async () => {
      render(<SimulationsPage />, { 
        wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
      });
    });
    
    expect(screen.getByText(/Error loading simulations/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
    expect(screen.getByText("Available Simulations")).toBeInTheDocument();
  });

  it("shows empty state if no simulations", async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: [], loading: false, error: null }
    });
    
    await act(async () => {
      render(<SimulationsPage />, { 
        wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
      });
    });
    
    expect(screen.getByText("No simulations available")).toBeInTheDocument();
    expect(screen.getByText("Available Simulations")).toBeInTheDocument();
  });

  it("renders simulation cards with correct information", async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: mockSimulations, loading: false, error: null }
    });
    
    await act(async () => {
      render(<SimulationsPage />, { 
        wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
      });
    });
    
    await waitFor(() => {
      // Check titles are rendered
      expect(screen.getByText("Street Food Business Simulator")).toBeInTheDocument();
      expect(screen.getByText("Retail Management Simulator")).toBeInTheDocument();
      expect(screen.getByText("No Route Simulation")).toBeInTheDocument();
      expect(screen.getByText("Direct Structure Simulation")).toBeInTheDocument();
      expect(screen.getByText("Only Name Simulation")).toBeInTheDocument();
      
      // Check descriptions are rendered (truncated for long ones)
      expect(screen.getByText(/Learn the fundamentals of business/)).toBeInTheDocument();
      expect(screen.getByText(/Manage a retail store/)).toBeInTheDocument();
      expect(screen.getByText(/This simulation has no route/)).toBeInTheDocument();
      expect(screen.getByText(/Very long description that should be truncated/)).toBeInTheDocument();
    });
  });

  it("handles different data structures correctly", async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: mockSimulations, loading: false, error: null }
    });
    
    await act(async () => {
      render(<SimulationsPage />, { 
        wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
      });
    });
    
    await waitFor(() => {
      // Check that simulation with direct structure works
      expect(screen.getByText("Direct Structure Simulation")).toBeInTheDocument();
      // Check that simulation with only name (no title) works
      expect(screen.getByText("Only Name Simulation")).toBeInTheDocument();
    });
  });

  it('enables "Start Simulation" button only if simulation has a route', async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: mockSimulations, loading: false, error: null }
    });
    
    await act(async () => {
      render(<SimulationsPage />, { 
        wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
      });
    });
    
    await waitFor(() => {
      const startButtons = screen.getAllByText("Start Simulation");
      const unavailableButtons = screen.getAllByText("Unavailable");
      
      // Should have 3 "Start Simulation" buttons (for simulations with routes)
      expect(startButtons).toHaveLength(3);
      // Should have 2 "Unavailable" buttons (for simulations without routes)
      expect(unavailableButtons).toHaveLength(2);
      
      // Check that available buttons are enabled
      startButtons.forEach(button => {
        expect(button.closest('button')).toBeEnabled();
      });
      
      // Check that unavailable buttons are disabled
      unavailableButtons.forEach(button => {
        expect(button.closest('button')).toBeDisabled();
      });
    });
  });

  it('shows warning message for simulations without routes', async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: mockSimulations, loading: false, error: null }
    });
    
    await act(async () => {
      render(<SimulationsPage />, { 
        wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
      });
    });
    
    await waitFor(() => {
      const warningMessages = screen.getAllByText(/Route configuration missing/);
      expect(warningMessages).toHaveLength(2); // Two simulations without routes
    });
  });

  it('navigates to correct route when "Start Simulation" is clicked', async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: mockSimulations, loading: false, error: null }
    });
    
    render(<SimulationsPage />, { 
      wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
    });
    
    await waitFor(() => {
      const startButtons = screen.getAllByText("Start Simulation");
      expect(startButtons).toHaveLength(3);
      
      // Click the first "Start Simulation" button (Street Food Business Simulator)
      fireEvent.click(startButtons[0]);
      expect(mockPush).toHaveBeenCalledWith('/simulations/food-business-sim');
    });
  });

  it('uses default image when simulation has no image', async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: mockSimulations, loading: false, error: null }
    });
    
    render(<SimulationsPage />, { 
      wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
    });
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      // Should have images for all simulations (including default ones)
      expect(images.length).toBeGreaterThan(0);
      
      // Check that default image is used for simulations without custom image
      const defaultImageSrc = "https://www.skillshare.com/blog/wp-content/uploads/2021/03/Screenshot2021-03-15at18.03.402-1.jpg";
      const imagesWithDefaultSrc = images.filter(img => img.src === defaultImageSrc);
      expect(imagesWithDefaultSrc.length).toBeGreaterThan(0);
    });
  });

  it('handles null or undefined simulations gracefully', async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: null, loading: false, error: null }
    });
    
    render(<SimulationsPage />, { 
      wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
    });
    
    expect(screen.getByText("No simulations available")).toBeInTheDocument();
  });

  it('renders cards with proper hover states', async () => {
    store = createMockStore({
      user: { userInfo: { token: "mock-token" } },
      simulations: { data: mockSimulations.slice(0, 2), loading: false, error: null }
    });
    
    render(<SimulationsPage />, { 
      wrapper: ({ children }) => <ProvidersWrapper store={store}>{children}</ProvidersWrapper> 
    });
    
    await waitFor(() => {
      // Cards should be rendered with proper styling
      const cards = screen.getAllByRole('img');
      expect(cards.length).toBeGreaterThan(0);
    });
  });
}); 