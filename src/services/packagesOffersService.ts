import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { PackageOffer } from "@/types/packagesOffer.interface";




export const getPackagesService = async (query?: string) => {
    try {
        const response = await apiCall.get(`/admins/packages${query ?? ''}`, {
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "packages");
        }
        const data = (await response.json()) as ResponseData<PackageOffer[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};