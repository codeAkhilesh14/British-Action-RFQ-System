import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setLoading, setError, setUserData, clearError, logout } =
  userSlice.actions;
export default userSlice.reducer;
