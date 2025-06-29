import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Setting } from "@/types/setting.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getSettingService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/settings${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "setting");
        }
        const data = (await response.json()) as ResponseData<Setting>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateSettingService = async (body: string) => {
    try {
        const response = await apiCall.put("/admins/settings", undefined, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update setting");
        }
        const data = (await response.json()) as ResponseData<Setting>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

