import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { District } from "@/types/district.interface";
import { Region } from "@/types/regions.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getDistrictService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/districts${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            },
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "district");
        }
        const data = (await response.json()) as ResponseData<District[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addDistrictService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/districts`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add district");
        }
        const data = (await response.json()) as ResponseData<District>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteDistrictService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/districts", id, {
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
export const showDistrictService = async (id: number) => {
    try {
        const response = await apiCall.get(`/admins/districts/${id}`);
        if (!response.ok) {
            await responseErrorServiceHandler(response, "show district");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateDistrictService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/districts", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update district");
        }
        const data = (await response.json()) as ResponseData<District>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
