// Mock geocoding utility for address to coordinates conversion
// In production, this would use Google Geocoding API or similar service

const mockCoordinates = {
  // New York area coordinates for common addresses
  'new york': { lat: 40.7128, lng: -74.0060 },
  'manhattan': { lat: 40.7831, lng: -73.9712 },
  'brooklyn': { lat: 40.6782, lng: -73.9442 },
  'queens': { lat: 40.7282, lng: -73.7949 },
  'bronx': { lat: 40.8448, lng: -73.8648 },
  'staten island': { lat: 40.5795, lng: -74.1502 },
  'wall street': { lat: 40.7074, lng: -74.0113 },
  'broadway': { lat: 40.7505, lng: -73.9877 },
  'fifth avenue': { lat: 40.7614, lng: -73.9776 },
  'park avenue': { lat: 40.7505, lng: -73.9934 },
  'times square': { lat: 40.7580, lng: -73.9855 },
  'central park': { lat: 40.7829, lng: -73.9654 },
};

export const geocodeAddress = async (address) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!address || address.length < 5) {
    return null;
  }
  
  const addressLower = address.toLowerCase();
  
  // Check for known locations
  for (const [key, coords] of Object.entries(mockCoordinates)) {
    if (addressLower.includes(key)) {
      // Add some randomness to make each address unique
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.01,
        lng: coords.lng + (Math.random() - 0.5) * 0.01
      };
    }
  }
  
  // Default to NYC area with random offset for unknown addresses
  return {
    lat: 40.7128 + (Math.random() - 0.5) * 0.1,
    lng: -74.0060 + (Math.random() - 0.5) * 0.1
  };
};

export const reverseGeocode = async (lat, lng) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock reverse geocoding - return a formatted address
  const streetNumbers = [123, 456, 789, 321, 654, 987];
  const streetNames = ['Main St', 'Broadway', 'Park Ave', 'Wall St', 'Fifth Ave', 'Madison Ave'];
  const neighborhoods = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx'];
  
  const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
  const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
  
  return `${streetNumber} ${streetName}, ${neighborhood}, NY`;
};

// Utility to calculate distance between two coordinates
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

// Utility to format coordinates for display
export const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};