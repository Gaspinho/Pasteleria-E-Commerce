/**
 * Slice de Redux para gestión de roles y permisos
 */
import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_ROLES } from '../constants/permissions';

const initialState = {
  roles: Object.values(DEFAULT_ROLES),
  userRole: null,
  userPermissions: [],
  loading: false,
  error: null
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    addRole: (state, action) => {
      state.roles.push(action.payload);
    },
    updateRole: (state, action) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    deleteRole: (state, action) => {
      state.roles = state.roles.filter(role => role.id !== action.payload);
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setRoles,
  addRole,
  updateRole,
  deleteRole,
  setUserRole,
  setUserPermissions,
  setLoading,
  setError,
  clearError
} = rolesSlice.actions;

export default rolesSlice.reducer;
