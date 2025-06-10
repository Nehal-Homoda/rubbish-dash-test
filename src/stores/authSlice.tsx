import { AuthResponse, User } from "@/types/auth.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface InitialState {
    user: null | User;
    token: null | string;
    isLoggedIn: boolean;
}

const initialState: InitialState = {
    user: null,
    token: null,
    isLoggedIn: false,
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
                    state.token = JSON.parse(storedToken);
                    state.isLoggedIn = true;
                }
            } catch (error: any) {
                state.user = null;
                state.token = null;
                Cookies.remove("user");
                Cookies.remove("token");
                state.isLoggedIn = false;
                console.log("Enter error ", error.message);
            }
        },
    },
});

export const { login, logout, enter } = authSlice.actions;
export default authSlice.reducer;
