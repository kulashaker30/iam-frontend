// src/features/groupsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: { Authorization: `Bearer ${token}` },
});

// Fetch all groups
export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  const response = await api.get("/groups");
  return response.data;
});

// Create group
export const createGroup = createAsyncThunk("groups/createGroup", async (name) => {
  const response = await api.post("/groups", { name });
  return response.data;
});

// Delete group
export const deleteGroup = createAsyncThunk("groups/deleteGroup", async (id) => {
  await api.delete(`/groups/${id}`);
  return id;
});

// Assign users to a group
export const assignUsersToGroup = createAsyncThunk(
  "groups/assignUsersToGroup",
  async ({ groupId, userIds }) => {
    await api.post(`/groups/${groupId}/users`, { userIds });
    return { groupId, userIds };
  }
);

// Unassign user from group
export const unassignUserFromGroup = createAsyncThunk(
  "groups/unassignUserFromGroup",
  async ({ groupId, userId }) => {
    await api.delete(`/groups/${groupId}/users/${userId}`);
    return { groupId, userId };
  }
);

// Fetch users in a specific group
export const fetchGroupUsers = createAsyncThunk(
  "groups/fetchGroupUsers",
  async (groupId) => {
    const response = await api.get(`/groups/${groupId}/users`);
    return { groupId, users: response.data };
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    items: [],
    groupUsers: {}, // groupId -> [users]
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
        delete state.groupUsers[action.payload];
      })
      .addCase(assignUsersToGroup.fulfilled, (state, action) => {
        const { groupId, userIds } = action.payload;
        if (!state.groupUsers[groupId]) state.groupUsers[groupId] = [];
        userIds.forEach((id) => {
          if (!state.groupUsers[groupId].some((u) => u.id === id)) {
            state.groupUsers[groupId].push({ id }); // You can update with more user details if needed
          }
        });
      })
      .addCase(unassignUserFromGroup.fulfilled, (state, action) => {
        const { groupId, userId } = action.payload;
        state.groupUsers[groupId] = (state.groupUsers[groupId] || []).filter(
          (user) => user.id !== userId
        );
      })
      .addCase(fetchGroupUsers.fulfilled, (state, action) => {
        const { groupId, users } = action.payload;
        state.groupUsers[groupId] = users;
      });
  },
});

export default groupsSlice.reducer;
