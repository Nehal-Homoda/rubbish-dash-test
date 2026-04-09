import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Banner } from "@/types/banners.interface";

let token = "5|t91YTe8w5By7Ujmme7Z6o1OHks0JTN71mDnw4MYb5b8aabee";

export const getBannersService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/banners${decodeURIComponent(query || "")}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // "Content-Type": "application/json",
                },
            },
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "banners");
        }
        const data = (await response.json()) as ResponseData<Banner[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const addBannerService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/banners`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add service");
        }
        const data = (await response.json()) as ResponseData<Banner>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteBannerService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/banners", id, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "delete user");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateBannerService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/banners", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update user");
        }
        const data = (await response.json()) as ResponseData<Banner>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
