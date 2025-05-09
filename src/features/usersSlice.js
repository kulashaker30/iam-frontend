// src/features/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Thunks

export const fetchGroupUsers = createAsyncThunk('users/fetchGroupUsers', async (groupId) => {
  const response = await axios.get(`${API_URL}/groups/${groupId}/users`);
  return response.data;
});

export const createGroupUser = createAsyncThunk('users/createGroupUser', async ({ groupId, user }) => {
  const response = await axios.post(`${API_URL}/groups/${groupId}/users`, user);
  return response.data;
});

export const editGroupUser = createAsyncThunk('users/editGroupUser', async ({ groupId, userId, user }) => {
  const response = await axios.put(`${API_URL}/groups/${groupId}/users/${userId}`, user);
  return response.data;
});

export const deleteGroupUser = createAsyncThunk('users/deleteGroupUser', async ({ groupId, userId }) => {
  await axios.delete(`${API_URL}/groups/${groupId}/users/${userId}`);
  return userId;
});

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(createGroupUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(editGroupUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteGroupUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addMatcher(action => action.type.startsWith('users/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(action => action.type.startsWith('users/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default usersSlice.reducer;
