// redux/simulationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSimulations = createAsyncThunk(
  'simulations/fetchSimulations',
  async (_, { getState }) => {
    const state = getState();
    const token = state.user?.userInfo?.token; 

    const response = await axios.get('http://localhost:3030/user-simulations', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
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