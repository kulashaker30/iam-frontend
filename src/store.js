// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/usersSlice'
import groupsReducer from './features/groupsSlice';
import authReducer from './features/authSlice';
import rolesReducer from './features/rolesSlice'
import permissionsReducer from './features/permissionsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupsReducer,
    auth: authReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
  },
});
