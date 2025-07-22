import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification); // Add to beginning
      
      // Auto-remove after 5 seconds for toast notifications
      if (action.payload.autoRemove !== false) {
        setTimeout(() => {
          state.notifications = state.notifications.filter(n => n.id !== notification.id);
        }, 5000);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
  },
});

export const { 
  addNotification, 
  removeNotification, 
  markAsRead, 
  markAllAsRead, 
  setNotifications 
} = notificationSlice.actions;
export default notificationSlice.reducer;