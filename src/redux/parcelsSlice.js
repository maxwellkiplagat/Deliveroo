import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchParcels = createAsyncThunk(
  'parcels/fetchParcels',
  async () => {
    const response = await api.get('/parcels');
    return response.data;
  }
);

export const createParcel = createAsyncThunk(
  'parcels/createParcel',
  async (parcelData, { rejectWithValue }) => {
    try {
      const response = await api.post('/parcels', parcelData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create parcel');
    }
  }
);

export const updateParcel = createAsyncThunk(
  'parcels/updateParcel',
  async ({ id, updates }) => {
    const response = await api.put(`/parcels/${id}`, updates);
    return response.data;
  }
);

export const cancelParcel = createAsyncThunk(
  'parcels/cancelParcel',
  async (id) => {
    await api.delete(`/parcels/${id}`);
    return id;
  }
);

const parcelsSlice = createSlice({
  name: 'parcels',
  initialState: {
    parcels: [],
    currentParcel: null,
    loading: false,
    error: null,
  },
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
      .addCase(fetchParcels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = action.payload;
      })
      .addCase(fetchParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createParcel.fulfilled, (state, action) => {
        state.parcels.push(action.payload);
      })
      .addCase(updateParcel.fulfilled, (state, action) => {
        const index = state.parcels.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.parcels[index] = action.payload;
        }
      })
      .addCase(cancelParcel.fulfilled, (state, action) => {
        state.parcels = state.parcels.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentParcel } = parcelsSlice.actions;
export default parcelsSlice.reducer;