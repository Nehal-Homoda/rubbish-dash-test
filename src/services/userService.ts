import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { User, Users } from "@/types/auth.interface";
import { ResponseData } from "@/types/shared";
import { AppUser } from "@/types/user.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getUserService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/users${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "district");
        }
        const data = (await response.json()) as ResponseData<AppUser[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getDeletedUserService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/users/trashed${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "user");
        }
        const data = (await response.json()) as ResponseData<AppUser[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getUserByIdService = async (id: number | string) => {
    try {
        const response = await apiCall.get(`/admins/users/${id}`, {
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "district");
        }
        const data = (await response.json()) as ResponseData<AppUser>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getUserSubscriptionByIdService = async (
    id: number | string,
    query?: string
) => {
    try {
        const response = await apiCall.get(
            `/admins/users/${id}/subscriptions${decodeURIComponent(
                query || ""
            )}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "user subscription");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addUserService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/users`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add user");
        }
        const data = (await response.json()) as Users;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteUserService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/users", id, {
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "delete district");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateUserService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/users", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update user");
        }
        const data = (await response.json()) as ResponseData<User>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const userListByPageService = async (pageNumber: number) => {
    try {
        const response = await apiCall.get(`/admins/users?page=${pageNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "user list");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
