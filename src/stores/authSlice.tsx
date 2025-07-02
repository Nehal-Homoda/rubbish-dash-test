import { AuthResponse, User } from "@/types/auth.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface InitialState {
    user: null | User;
    token: null | string;
    isLoggedIn: boolean;
    isEnter: boolean;
    title: null | string;
}

const initialState: InitialState = {
    user: null,
    token: null,
    isLoggedIn: false,
    isEnter: false,
    title: '  صباح الخير 👋'
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
            state.user = null;
            state.token = null;
            Cookies.remove("user");
            Cookies.remove("token");
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
                    throw new Error('logout')
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
            state.title = action.payload
        }
    },
});

export const { login, logout, enter,changeTitle } = authSlice.actions;
export default authSlice.reducer;
