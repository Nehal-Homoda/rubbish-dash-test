import { AuthResponse, User } from "@/types/auth.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface InitialState {
  user: null | User;
  token: null | string;
  isLoggedIn: boolean;
  isEnter: boolean;
  title: null | string;
  count: string | number
}

const initialState: InitialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isEnter: false,
  title: "  صباح الخير 👋",
  count: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.data.admin || null;
      state.token = action.payload.data.token || null;
      state.isLoggedIn = true;
      Cookies.set("user", JSON.stringify(state.user));
      Cookies.set("token", JSON.stringify(state.token));
    },
    logout: (state) => {
      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("title");
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    enter: (state) => {
      try {
        const storedUser = Cookies.get("user");
        const storedToken = Cookies.get("token");
        if (storedUser && storedToken) {
          state.user = JSON.parse(storedUser);
          state.token = storedToken;
          state.isLoggedIn = true;
        } else {
          throw new Error("logout");
        }
        const storedTitle = Cookies.get("title");
        if (storedTitle) {
          state.title = JSON.parse(storedTitle);
        } else {
          state.title = "  صباح الخير 👋";
        }
        state.isEnter = true;
      } catch (error: any) {
        state.user = null;
        state.token = null;
        Cookies.remove("user");
        Cookies.remove("token");
        state.isLoggedIn = false;
        console.log("Enter error ", error.message);
        state.isEnter = true;
      }
    },
    changeTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      Cookies.set("title", JSON.stringify(state.title));
    },
    changeCount: (state, action: PayloadAction<string>) => {
      state.count = action.payload
    }
  },
});

export const { login, logout, enter, changeTitle, changeCount } = authSlice.actions;
export default authSlice.reducer;
