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
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSimulations.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default simulationSlice.reducer;