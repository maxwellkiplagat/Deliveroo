export const PARCEL_STATUS = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  COURIER: 'courier',
};

export const PRICING_TIERS = [
  { min: 0, max: 1, rate: 10, label: 'Light Package' },
  { min: 1, max: 5, rate: 8, label: 'Medium Package' },
  { min: 5, max: 20, rate: 6, label: 'Heavy Package' },
  { min: 20, max: Infinity, rate: 4, label: 'Extra Heavy Package' },
];

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  PARCELS: {
    LIST: '/parcels',
    CREATE: '/parcels',
    DETAILS: (id) => `/parcels/${id}`,
    UPDATE: (id) => `/parcels/${id}`,
    DELETE: (id) => `/parcels/${id}`,
  },
  ADMIN: {
    PARCELS: '/admin/parcels',
    ANALYTICS: '/admin/analytics',
    UPDATE_STATUS: (id) => `/admin/parcels/${id}/status`,
    UPDATE_LOCATION: (id) => `/admin/parcels/${id}/location`,
  },
};

export const DEMO_CREDENTIALS = {
  USER: {
    email: 'john@example.com',
    password: 'password',
  },
  ADMIN: {
    email: 'admin@deliveroo.com',
    password: 'admin',
  },
};

export const GOOGLE_MAPS_CONFIG = {
  DEFAULT_CENTER: { lat: 40.7128, lng: -74.0060 }, // New York City
  DEFAULT_ZOOM: 12,
  MARKER_COLORS: {
    PICKUP: '#10b981', // emerald-600
    DESTINATION: '#ef4444', // red-500
    CURRENT: '#3b82f6', // blue-500
  },
};

export const TOAST_DURATION = 5000; // 5 seconds

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};