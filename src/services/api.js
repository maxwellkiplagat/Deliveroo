import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Mock data for demonstration
let mockParcels = [
  {
    id: 1,
    trackingNumber: 'DEL001',
    senderName: 'John Doe',
    receiverName: 'Jane Smith',
    pickupAddress: '123 Main St, New York, NY',
    destinationAddress: '456 Oak Ave, Brooklyn, NY',
    weight: 2.5,
    price: 15.99,
    status: 'pending',
    createdAt: '2025-01-27T10:00:00Z',
    userId: 1,
    courierAssigned: null,
    deliveryDeadline: '2025-01-29T18:00:00Z',
    canUpdate: true,
    currentLocation: { lat: 40.7128, lng: -74.0060 },
    pickupCoords: { lat: 40.7128, lng: -74.0060 },
    destinationCoords: { lat: 40.6782, lng: -73.9442 },
    timeline: [
      { status: 'pending', timestamp: '2025-01-27T10:00:00Z', location: 'New York, NY' }
    ]
  },
  {
    id: 2,
    trackingNumber: 'DEL002',
    senderName: 'Alice Johnson',
    receiverName: 'Bob Wilson',
    pickupAddress: '789 Broadway, New York, NY',
    destinationAddress: '321 Pine St, Queens, NY',
    weight: 1.2,
    price: 12.50,
    status: 'in_transit',
    createdAt: '2025-01-26T14:30:00Z',
    userId: 1,
    courierAssigned: { id: 1, name: 'Mike Johnson', phone: '+1234567890' },
    deliveryDeadline: '2025-01-28T16:00:00Z',
    canUpdate: false,
    currentLocation: { lat: 40.7282, lng: -73.7949 },
    pickupCoords: { lat: 40.7505, lng: -73.9877 },
    destinationCoords: { lat: 40.7282, lng: -73.7949 },
    timeline: [
      { status: 'pending', timestamp: '2025-01-26T14:30:00Z', location: 'New York, NY' },
      { status: 'picked_up', timestamp: '2025-01-26T15:00:00Z', location: 'New York, NY' },
      { status: 'in_transit', timestamp: '2025-01-26T15:30:00Z', location: 'En route to Queens' }
    ]
  }
];

// Mock saved addresses
let mockSavedAddresses = [
  {
    id: 1,
    userId: 1,
    addressName: 'Home',
    address: '123 Main Street, New York, NY 10001',
    latitude: 40.7505,
    longitude: -73.9877
  },
  {
    id: 2,
    userId: 1,
    addressName: 'Office',
    address: '456 Broadway, New York, NY 10013',
    latitude: 40.7209,
    longitude: -74.0007
  }
];

// Mock couriers
let mockCouriers = [
  {
    id: 1,
    name: 'Mike Johnson',
    phone: '+1234567890',
    vehicleType: 'Motorcycle',
    status: 'available',
    currentLocation: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    phone: '+1987654321',
    vehicleType: 'Van',
    status: 'busy',
    currentLocation: { lat: 40.6782, lng: -73.9442 }
  }
];

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', phone: '+1234567890' },
  { id: 2, name: 'Admin User', email: 'admin@deliveroo.com', role: 'admin', phone: '+1987654321' }
];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API responses
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API implementation
const mockApi = {
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/auth/login') {
          const { email, password } = data;
          if (email === 'john@example.com' && password === 'password') {
            resolve({
              data: {
                user: mockUsers[0],
                token: 'mock-token-123'
              }
            });
          } else if (email === 'admin@deliveroo.com' && password === 'admin') {
            resolve({
              data: {
                user: mockUsers[1],
                token: 'mock-admin-token-456'
              }
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        } else if (url === '/auth/register') {
          const newUser = {
            id: Date.now(),
            ...data,
            role: 'user'
          };
          resolve({
            data: {
              user: newUser,
              token: 'mock-token-new'
            }
          });
        } else if (url === '/parcels') {
          // Check if parcel can be updated (within 24 hours and not delivered/cancelled)
          const canUpdate = data.status === 'pending' || data.status === 'picked_up';
          
          // Calculate price based on weight if not provided
          if (!data.price && data.weight) {
            const tiers = [
              { min: 0, max: 1, rate: 12 },
              { min: 1, max: 5, rate: 10 },
              { min: 5, max: 20, rate: 8 },
              { min: 20, max: Infinity, rate: 6 },
            ];
            const tier = tiers.find(t => data.weight > t.min && data.weight <= t.max);
            const basePrice = data.weight * tier.rate;
            const fees = 3 + 1.5 + 2.5 + 1; // base + insurance + handling + fuel
            data.price = Math.round((basePrice + fees) * 100) / 100;
          }
          
          const newParcel = {
            id: Date.now(),
            trackingNumber: `DEL${Date.now().toString().slice(-6)}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: 1,
            courierAssigned: null,
            deliveryDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            canUpdate: canUpdate,
            timeline: [
              { status: 'pending', timestamp: new Date().toISOString(), location: data.pickupAddress }
            ],
            ...data
          };
          mockParcels = [...mockParcels, newParcel];
          resolve({ data: newParcel });
        } else if (url === '/saved-addresses') {
          const newAddress = {
            id: Date.now(),
            userId: 1,
            ...data
          };
          mockSavedAddresses = [...mockSavedAddresses, newAddress];
          resolve({ data: newAddress });
        } else if (url === '/couriers') {
          const newCourier = {
            id: Date.now(),
            status: 'available',
            currentLocation: { lat: 40.7128, lng: -74.0060 },
            ...data
          };
          mockCouriers = [...mockCouriers, newCourier];
          resolve({ data: newCourier });
        }
      }, 500);
    });
  },

  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/parcels') {
          resolve({ data: [...mockParcels] });
        } else if (url === '/saved-addresses') {
          resolve({ data: [...mockSavedAddresses] });
        } else if (url === '/couriers') {
          resolve({ data: [...mockCouriers] });
        } else if (url === '/admin/parcels') {
          // Admin sees all parcels
          resolve({ data: [...mockParcels] });
        } else if (url.startsWith('/parcels/')) {
          const id = parseInt(url.split('/').pop());
          const parcel = mockParcels.find(p => p.id === id);
          resolve({ data: parcel });
        }
      }, 300);
    });
  },

  put: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/parcels/')) {
          const id = parseInt(url.split('/').pop());
          const parcelIndex = mockParcels.findIndex(p => p.id === id);
          if (parcelIndex !== -1) {
            const parcel = mockParcels[parcelIndex];
            // Check if parcel can still be updated
            const canUpdate = parcel.status !== 'delivered' && parcel.status !== 'cancelled';
            if (!canUpdate && !data.adminUpdate) {
              resolve({ data: { error: 'Cannot update delivered or cancelled parcels' } });
              return;
            }
            mockParcels[parcelIndex] = { ...mockParcels[parcelIndex], ...data };
            resolve({ data: mockParcels[parcelIndex] });
          }
        } else if (url.startsWith('/saved-addresses/')) {
          const id = parseInt(url.split('/').pop());
          const addressIndex = mockSavedAddresses.findIndex(a => a.id === id);
          if (addressIndex !== -1) {
            mockSavedAddresses[addressIndex] = { ...mockSavedAddresses[addressIndex], ...data };
            resolve({ data: mockSavedAddresses[addressIndex] });
          }
        } else if (url.startsWith('/couriers/')) {
          const id = parseInt(url.split('/').pop());
          const courierIndex = mockCouriers.findIndex(c => c.id === id);
          if (courierIndex !== -1) {
            mockCouriers[courierIndex] = { ...mockCouriers[courierIndex], ...data };
            resolve({ data: mockCouriers[courierIndex] });
          }
        }
      }, 300);
    });
  },

  delete: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/parcels/')) {
          const id = parseInt(url.split('/').pop());
          const parcelIndex = mockParcels.findIndex(p => p.id === id);
          if (parcelIndex !== -1) {
            const parcel = mockParcels[parcelIndex];
            // Only allow cancellation if not delivered
            if (parcel.status === 'delivered') {
              resolve({ data: { error: 'Cannot cancel delivered parcels' } });
              return;
            }
            // Update status to cancelled instead of removing
            mockParcels[parcelIndex] = { ...parcel, status: 'cancelled' };
          }
          resolve({ data: { success: true } });
        } else if (url.startsWith('/saved-addresses/')) {
          const id = parseInt(url.split('/').pop());
          const addressIndex = mockSavedAddresses.findIndex(a => a.id === id);
          if (addressIndex !== -1) {
            mockParcels.splice(parcelIndex, 1);
          }
          resolve({ data: { success: true } });
        }
      }, 300);
    });
  }
};

export default mockApi;