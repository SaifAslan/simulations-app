// import { render, screen, fireEvent } from "@testing-library/react";
// import Game from "../components/Game";
// import { beforeEach, describe, expect, it, jest } from "@jest/globals";
// import { ReduxProvider } from "../store/provider";

// const ProvidersWrapper = ({ children }) => (
//   <ReduxProvider>{children}</ReduxProvider>
// );

// describe("Game Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     jest.spyOn(window, "alert").mockImplementation(() => {});
//   });

//   it("prevents submit without all selections", () => {
//     render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });

//     const runButton = screen.getByRole("button", { name: /run!/i });
//     expect(runButton).toBeDisabled();
//   });

//   it("disables truck and research buttons when not enough days left", () => {
//     render(<Game initialDays={6} />, { wrapper: ProvidersWrapper });

//     const pushcartButton = screen.getByRole("button", { name: /pushcart/i });
//     const truckButton = screen.getByRole("button", { name: /truck/i });
//     const researchButton = screen.getByRole("button", { name: /research/i });

//     expect(pushcartButton).not.toBeDisabled();
//     expect(truckButton).toBeDisabled();
//     expect(researchButton).toBeDisabled();
//   });

//   it("runs a valid business decision Pushcart", () => {
//     render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });
//     fireEvent.click(screen.getByRole("button", { name: /Pushcart/i }));
//     fireEvent.click(screen.getByRole("button", { name: /Ice Cream/i }));
//     fireEvent.click(screen.getByRole("button", { name: /Arts District/i }));
//     fireEvent.click(screen.getByRole("button", { name: /run!/i }));

//     expect(screen.getByText(/Days Left: 34/)).toBeInTheDocument();
//     expect(screen.getByText("Total Revenue: $504.00")).toBeInTheDocument();
//   });

//   it("runs a valid business decision Truck", () => {
//     render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });
//     fireEvent.click(screen.getByRole("button", { name: /Truck/i }));
//     fireEvent.click(screen.getByRole("button", { name: /Frozen Yogurt/i }));
//     fireEvent.click(screen.getByRole("button", { name: /Beach/i }));
//     fireEvent.click(screen.getByRole("button", { name: /run!/i }));

//     expect(screen.getByText(/Days Left: 28/)).toBeInTheDocument();
//     expect(screen.getByText("Total Revenue: $5152.00")).toBeInTheDocument();
//   });

//   it("runs a valid business decision Research", () => {
//     render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });
//     fireEvent.click(screen.getByRole("button", { name: /Research/i }));
//     fireEvent.click(screen.getByRole("button", { name: /Smoothies/i }));
//     fireEvent.click(screen.getByRole("button", { name: /City Market/i }));
//     fireEvent.click(screen.getByRole("button", { name: /run!/i }));

//     expect(screen.getByText(/Days Left: 28/)).toBeInTheDocument();
//     expect(screen.getByText("Total Revenue: $0.00")).toBeInTheDocument();
//   });
// });
import { render, screen, fireEvent } from "@testing-library/react";
import Game from "../components/Game";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReduxProvider } from "../store/provider";

const ProvidersWrapper = ({ children }) => (
  <ReduxProvider>{children}</ReduxProvider>
);

describe("Game Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("prevents submit without all selections", () => {
    render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });

    const runButton = screen.getByRole("button", { name: /run!/i });
    expect(runButton).toBeDisabled();
  });

  it("disables truck and research buttons when not enough days left", () => {
    render(<Game initialDays={6} />, { wrapper: ProvidersWrapper });

    const pushcartButton = screen.getByRole("button", { name: /pushcart/i });
    const truckButton = screen.getByRole("button", { name: /truck/i });
    const researchButton = screen.getByRole("button", { name: /research/i });

    expect(pushcartButton).not.toBeDisabled();
    expect(truckButton).toBeDisabled();
    expect(researchButton).toBeDisabled();
  });

  it("runs a valid business decision Pushcart", () => {
    render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });
    fireEvent.click(screen.getByRole("button", { name: /Pushcart/i }));
    fireEvent.click(screen.getByRole("button", { name: /Ice Cream/i }));
    fireEvent.click(screen.getByRole("button", { name: /Arts District/i }));
    fireEvent.click(screen.getByRole("button", { name: /run!/i }));

    expect(screen.getByText(/Days Left: 34/)).toBeInTheDocument();
    expect(screen.getByText("Total Revenue: $504.00")).toBeInTheDocument();
  });

  it("runs a valid business decision Truck", () => {
    render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });
    fireEvent.click(screen.getByRole("button", { name: /Truck/i }));
    fireEvent.click(screen.getByRole("button", { name: /Frozen Yogurt/i }));
    fireEvent.click(screen.getByRole("button", { name: /Beach/i }));
    fireEvent.click(screen.getByRole("button", { name: /run!/i }));

    expect(screen.getByText(/Days Left: 28/)).toBeInTheDocument();
    expect(screen.getByText("Total Revenue: $5152.00")).toBeInTheDocument();
  });

  it("runs a valid business decision Research", () => {
    render(<Game initialDays={35} />, { wrapper: ProvidersWrapper });
    fireEvent.click(screen.getByRole("button", { name: /Research/i }));
    fireEvent.click(screen.getByRole("button", { name: /Smoothies/i }));
    fireEvent.click(screen.getByRole("button", { name: /City Market/i }));
    fireEvent.click(screen.getByRole("button", { name: /run!/i }));

    expect(screen.getByText(/Days Left: 28/)).toBeInTheDocument();
    expect(screen.getByText("Total Revenue: $0.00")).toBeInTheDocument();
  });
});