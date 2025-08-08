// redux/simulationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/consts';

export const fetchSimulations = createAsyncThunk(
  'simulations/fetchSimulations',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user?.userInfo?.token;
    if (!token) return rejectWithValue('Not authenticated');
    const res = await axios.get(`${API_BASE_URL}/user-simulations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
);

const simulationSlice = createSlice({
  name: 'simulations',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSimulations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimulations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSimulations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
    });
  },
});

export default simulationSlice.reducer;