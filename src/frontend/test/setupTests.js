// import '@testing-library/jest-dom';
// import { cleanup } from '@testing-library/react';
// import { beforeEach, vi } from 'vitest';

// beforeEach(() => {
//   cleanup();
// });

// // Mock matchMedia
// if (!window.matchMedia) {
//   Object.defineProperty(window, 'matchMedia', {
//     writable: true,
//     value: vi.fn().mockImplementation(query => ({
//       matches: false,
//       media: query,
//       onchange: null,
//       addListener: vi.fn(), // old
//       removeListener: vi.fn(), // old
//       addEventListener: vi.fn(), // new
//       removeEventListener: vi.fn(),
//       dispatchEvent: vi.fn(),
//     })),
//   });
// }

// // Mock ResizeObserver
// if (!window.ResizeObserver) {
//   window.ResizeObserver = vi.fn().mockImplementation(() => ({
//     observe: vi.fn(),
//     unobserve: vi.fn(),
//     disconnect: vi.fn(),
//   }));
// }
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  cleanup();
});

// Mock matchMedia
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // old
      removeListener: vi.fn(), // old
      addEventListener: vi.fn(), // new
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock ResizeObserver
if (!window.ResizeObserver) {
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}