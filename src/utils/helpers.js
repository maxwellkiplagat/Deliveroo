import { format, formatDistanceToNow, isValid } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isValid(dateObj) ? format(dateObj, formatString) : '';
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : '';
};

export const generateTrackingNumber = () => {
  const prefix = 'DEL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};
export const calculatePrice = (weight) => {
  const tiers = [
    { min: 0, max: 1, rate: 12 },
    { min: 1, max: 5, rate: 10 },
    { min: 5, max: 20, rate: 8 },
    { min: 20, max: Infinity, rate: 6 },
  ];
  
  const tier = tiers.find(t => weight > t.min && weight <= t.max);
  const basePrice = weight * tier.rate;
  const fees = 3 + 1.5 + 2.5 + 1; // base + insurance + handling + fuel
  return Math.round((basePrice + fees) * 100) / 100;
};

export const getStatusProgress = (status) => {
  const statusMap = {
    pending: 25,
    picked_up: 50,
    in_transit: 75,
    delivered: 100,
    cancelled: 0,
  };
  return statusMap[status] || 0;
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
