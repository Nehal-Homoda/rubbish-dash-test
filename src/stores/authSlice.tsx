import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  loading: boolean;
  userData: null;
  userToken: null | string;
  error: null | string;
}

const initialState: InitialState = {
  loading: false,
  userData: null,
  userToken: localStorage.getItem("userToken") || null,
  error: null,
};



export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      state.userData = action.payload.user || null;
      state.userToken = action.payload.token || null;
      state.error = action.payload.error || null;
    },
    login: (state, action) => {
      state.userData = action.payload.user || null;
      state.userToken = action.payload.token || null;
      state.error = action.payload.error || null;
    },
    // Logout reducer
    logout: (state) => {
      state.userData = null;
      state.userToken = null;
      state.error = null;
      localStorage.removeItem("userToken");
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;
