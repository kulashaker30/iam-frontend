import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from '../utils/getToken';

const token = getToken();

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchPermissions = createAsyncThunk("permissions/fetch", async () => {
  const res = await api.get("/permissions");
  return res.data;
});

export const createPermission = createAsyncThunk("permissions/create", async (permission) => {
  const res = await api.post("/permissions", permission);
  return res.data;
});

export const editPermission = createAsyncThunk("permissions/edit", async ({ id, name }) => {
  const res = await api.put(`/permissions/${id}`, { name });
  return res.data;
});

export const deletePermission = createAsyncThunk("permissions/delete", async (id) => {
  await api.delete(`/permissions/${id}`);
  return id;
});

export const assignRolesToPermission = createAsyncThunk("permissions/assignRoles", async ({ permissionId, roleIds }) => {
  const res = await api.put(`/permissions/${permissionId}/roles`, { roleIds });
  return res.data;
});

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editPermission.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(assignRolesToPermission.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default permissionsSlice.reducer;
