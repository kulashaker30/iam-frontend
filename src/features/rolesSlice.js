import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../utils/getToken';

const token = getToken();

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: { Authorization: `Bearer ${token}` },
});


export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const res = await api.get("/roles");
  return res.data;
});

export const createRole = createAsyncThunk("roles/createRole", async (name) => {
  const res = await api.post("/roles", { name });
  return res.data;
});

export const assignGroupsToRole = createAsyncThunk(
  "roles/assignGroupsToRole",
  async ({ roleId, groupIds }) => {
    const res = await api.put(`/roles/${roleId}/groups`, { groupIds });
    return res.data;
  }
);

export const editRole = createAsyncThunk("roles/editRole", async ({ roleId, data }) => {
  const response = await api.put(`/roles/${roleId}`, data);
  return response.data;
});

export const deleteRole = createAsyncThunk("roles/deleteRole", async (roleId) => {
  await api.delete(`/roles/${roleId}`);
  return roleId;
});

const rolesSlice = createSlice({
  name: 'roles',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(assignGroupsToRole.fulfilled, (state, action) => {
        const index = state.items.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index].groupIds = action.payload.groupIds;
        }
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.items = state.items.filter(role => role.id !== action.payload);
      })
      .addCase(editRole.fulfilled, (state, action) => {
        const index = state.items.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default rolesSlice.reducer;
