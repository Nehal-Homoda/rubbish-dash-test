import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Area } from "@/types/area.interface";

// let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getAreaService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/areas${decodeURIComponent(query || "")}`,
            {
                headers: {},
            },
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "district");
        }
        const data = (await response.json()) as ResponseData<Area[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addAreaService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/areas`, {
            body: form,
            headers: {},
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add area");
        }
        const data = (await response.json()) as ResponseData<Area>;
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteAreaService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/areas", id, {
            headers: {},
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
export const updateAreaService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/areas", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update area");
        }
        const data = (await response.json()) as ResponseData<Area>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
