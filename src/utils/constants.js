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



