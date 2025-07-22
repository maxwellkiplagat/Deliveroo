import '@testing-library/jest-dom';

// Mock Google Maps
global.google = {
  maps: {
    Map: jest.fn(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
    })),
    Marker: jest.fn(() => ({
      setMap: jest.fn(),
    })),
    DirectionsService: jest.fn(() => ({
      route: jest.fn(),
    })),
    DirectionsRenderer: jest.fn(() => ({
      setMap: jest.fn(),
      setDirections: jest.fn(),
    })),
    Size: jest.fn(),
    Point: jest.fn(),
    TravelMode: {
      DRIVING: 'DRIVING',
    },
  },
};

// Mock Intersection Observer
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});