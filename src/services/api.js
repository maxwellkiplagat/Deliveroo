import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deliveroo-f2ec.onrender.com/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true,
});




  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/parcels') {
          const currentUserId = getCurrentUserId();
          const currentUser = getCurrentUser();
          
          if (currentUser?.role === 'admin') {
            // Admin sees all parcels
            resolve({ data: [...mockParcels] });
          } else {
            // Regular users see only their parcels
            const userParcels = mockParcels.filter(p => p.userId === currentUserId);
            resolve({ data: userParcels });
          }
        } else if (url === '/notifications') {
          const currentUserId = getCurrentUserId();
          const userNotifications = mockNotifications.filter(n => n.userId === currentUserId);
          resolve({ data: userNotifications });
        } else if (url === '/saved-addresses') {
          const currentUserId = getCurrentUserId();
          const userAddresses = mockSavedAddresses.filter(a => a.userId === currentUserId);
          resolve({ data: userAddresses });
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
            mockSavedAddresses.splice(addressIndex, 1);
          }
          resolve({ data: { success: true } });
        }
      }, 300);
    });
  }
};

// Helper functions to get current user info
function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Extract user ID from mock token format: mock-token-{userId}-{timestamp}
  const parts = token.split('-');
  return parts.length >= 3 ? parseInt(parts[2]) : null;
}

function getCurrentUser() {
  const userId = getCurrentUserId();
  return userId ? registeredUsers.find(u => u.id === userId) : null;
}

// Mock notifications data

export default api;
