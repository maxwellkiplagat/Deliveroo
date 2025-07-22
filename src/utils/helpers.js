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

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const sortParcels = (parcels, sortBy) => {
  const sorted = [...parcels];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
    case 'price':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
};

export const filterParcels = (parcels, filters) => {
  return parcels.filter(parcel => {
    const matchesSearch = !filters.search || 
      parcel.trackingNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      parcel.senderName.toLowerCase().includes(filters.search.toLowerCase()) ||
      parcel.receiverName.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || filters.status === 'all' || parcel.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });
};

export const exportToPDF = (data, filename = 'export.pdf') => {
  // Mock PDF export - in real app, use jsPDF or similar
  console.log('Exporting to PDF:', data);
  
  // Create a simple text file for demo
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace('.pdf', '.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};