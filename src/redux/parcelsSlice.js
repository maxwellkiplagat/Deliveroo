import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import axios from 'axios'; 

// Fetch parcels for the logged-in user
export const fetchParcels = createAsyncThunk(
  'parcels/fetchParcels',
  async () => {
    const response = await api.get('/parcels');
    return response.data;
  }
);

// Fetch ALL parcels (admin-only)
export const fetchAllParcelsForAdmin = createAsyncThunk(
  'parcels/fetchAllParcelsForAdmin',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.user?.token;

      const response = await api.get('/admin/parcels',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Admin fetch error:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch parcels (admin)'
      );
    }
  }
);


// Create parcel
export const createParcel = createAsyncThunk(
  'parcels/createParcel',
  async (parcelData, { rejectWithValue }) => {
    try {
      const response = await api.post('/parcels', parcelData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create parcel');
    }
  }
);

export const updateParcel = createAsyncThunk(
  'parcels/updateParcel',
  async ({ id, updates }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.user?.token;
      
      // Prepare the payload the backend expects
      const backendPayload = {
        status: updates.status,
        location: updates.location || 'Status updated by admin' // Provide default location
      };

      console.log(" PUT /parcels/:id/status | ID:", id, "Payload:", backendPayload);

      const response = await api.put( 
        `/admin/parcels/${id}/status`, 
        backendPayload
      );

      return response.data;
    } catch (error) {
      console.error('Update parcel failed:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update parcel'
      );
    }
  }
);


// Cancel parcel
export const cancelParcel = createAsyncThunk(
  'parcels/cancelParcel',
  async (id) => {
    const response = await api.put(`/parcels/${id}/cancel`);
    return response.data;
  }
);

// Initial state
const initialState = {
  parcels: [],
  currentParcel: null,
  loading: false,
  error: null,
};

const parcelsSlice = createSlice({
  name: 'parcels',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentParcel: (state, action) => {
      state.currentParcel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // User's own parcels
      .addCase(fetchParcels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParcels.fulfilled, (state, action) => {
        state.loading = false;
        // state.parcels = action.payload;
        state.parcels = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Admin: all parcels
      .addCase(fetchAllParcelsForAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllParcelsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // state.parcels = action.payload;
        state.parcels = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllParcelsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create parcel
      .addCase(createParcel.fulfilled, (state, action) => {
        state.parcels.push(action.payload);
      })

      // Update parcel
      .addCase(updateParcel.fulfilled, (state, action) => {
        const index = state.parcels.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.parcels[index] = action.payload;
        }
      })

      // Cancel parcel
      .addCase(cancelParcel.fulfilled, (state, action) => {
        state.parcels = state.parcels.filter(p => p.id !== action.payload.id);
      });
  },
});

export const { clearError, setCurrentParcel } = parcelsSlice.actions;
export default parcelsSlice.reducer;
