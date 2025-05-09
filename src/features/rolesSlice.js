// src/features/rolesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust API URL

// Fetch roles for a specific group
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (groupId) => {
  const response = await axios.get(`${API_URL}/groups/${groupId}/roles`);
  return response.data;
});

// Create a new role for a specific group
export const createRole = createAsyncThunk('roles/createRole', async ({ groupId, roleName }) => {
  const response = await axios.post(`${API_URL}/groups/${groupId}/roles`, { name: roleName });
  return response.data;
});

// Edit a role
export const editRole = createAsyncThunk('roles/editRole', async ({ groupId, roleId, newName }) => {
  const response = await axios.put(`${API_URL}/groups/${groupId}/roles/${roleId}`, { name: newName });
  return response.data;
});

// Delete a role
export const deleteRole = createAsyncThunk('roles/deleteRole', async ({ groupId, roleId }) => {
  await axios.delete(`${API_URL}/groups/${groupId}/roles/${roleId}`);
  return roleId; // We return the roleId to remove it from the state
});

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload); // Add the new role to the roles list
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(editRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.loading = false;
        // Update the edited role in the state
        const index = state.roles.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(editRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted role from the state
        state.roles = state.roles.filter(role => role.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default rolesSlice.reducer;
