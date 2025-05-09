// src/features/permissionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust API URL

// Fetch permissions for a specific role
export const fetchPermissions = createAsyncThunk('permissions/fetchPermissions', async (roleId) => {
  const response = await axios.get(`${API_URL}/roles/${roleId}/permissions`);
  return response.data;
});

// Create a new permission for a specific role
export const createPermission = createAsyncThunk('permissions/createPermission', async ({ roleId, permissionName }) => {
  const response = await axios.post(`${API_URL}/roles/${roleId}/permissions`, { name: permissionName });
  return response.data;
});

// Edit a permission
export const editPermission = createAsyncThunk('permissions/editPermission', async ({ roleId, permissionId, newName }) => {
  const response = await axios.put(`${API_URL}/roles/${roleId}/permissions/${permissionId}`, { name: newName });
  return response.data;
});

// Delete a permission
export const deletePermission = createAsyncThunk('permissions/deletePermission', async ({ roleId, permissionId }) => {
  await axios.delete(`${API_URL}/roles/${roleId}/permissions/${permissionId}`);
  return permissionId; // We return the permissionId to remove it from the state
});

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.push(action.payload); // Add the new permission to the state
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(editPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPermission.fulfilled, (state, action) => {
        state.loading = false;
        // Update the edited permission in the state
        const index = state.permissions.findIndex(permission => permission.id === action.payload.id);
        if (index !== -1) {
          state.permissions[index] = action.payload;
        }
      })
      .addCase(editPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted permission from the state
        state.permissions = state.permissions.filter(permission => permission.id !== action.payload);
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default permissionsSlice.reducer;
