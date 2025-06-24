// test/setup.js
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  cleanup();
});

// Mock matchMedia
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // old
      removeListener: jest.fn(), // old
      addEventListener: jest.fn(), // new
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock ResizeObserver
if (!window.ResizeObserver) {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};
