import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    userData: null,
    userToken: null,
    isAuthenticated: false,
    error: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder)=>{},
});

export default authSlice.reducer;
