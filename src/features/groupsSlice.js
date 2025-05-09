import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
  const response = await axios.get(`${API_URL}/groups`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
});

export const createGroup = createAsyncThunk('groups/createGroup', async (name) => {
  const response = await axios.post(`${API_URL}/groups`, { name }, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
});

export const deleteGroup = createAsyncThunk('groups/deleteGroup', async (id) => {
  await axios.delete(`${API_URL}/groups/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return id;
});

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.items = state.items.filter(g => g.id !== action.payload);
      });
  },
});

export default groupsSlice.reducer;
