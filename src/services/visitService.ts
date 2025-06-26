import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Visit } from "@/types/visits.interface";
import { Region } from "@/types/regions.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getVisitsService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/visits${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "district");
        }
        const data = (await response.json()) as ResponseData<Visit[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const addVisitsService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/visits`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add visits");
        }
        const data = (await response.json()) as ResponseData<Visit>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteVisitsService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/visits", id, {
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "delete visits");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateVisitsService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/visits", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update visits");
        }
        const data = (await response.json()) as ResponseData<Visit>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
