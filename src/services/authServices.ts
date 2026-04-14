import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { AuthResponse, LogoutResponse, User } from "@/types/auth.interface";

export const loginService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/auth/login`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "login");
        }
        const data = (await response.json()) as AuthResponse;
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const logoutService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/auth/login`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "logout");
        }
        const data = (await response.json()) as LogoutResponse;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const changePasswordService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/Data/ChangePassword`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "change password");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateProfileService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/Data/EditProfile`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update profile");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const registerService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/Data/Registration`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "register");
        }
        const data = (await response.json()) as User;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};



export const meService = async () => {
    try {
        const response = await apiCall.get(`/admins/auth/me`, {
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "me");
        }
        const data = (await response.json()) as AuthResponse;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};