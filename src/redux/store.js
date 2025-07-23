import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import parcelsSlice from './parcelsSlice';
import notificationSlice from './notificationSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    parcels: parcelsSlice,
    notifications: notificationSlice,
  },
});