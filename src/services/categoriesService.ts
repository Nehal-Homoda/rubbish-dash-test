import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { Categories } from "@/types/categories.interface";




export const getCategories = async (query?: string) => {
    try {
        const response = await apiCall.get(`/admins/categories${query ?? ""}`, {
          headers: {
            // "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "categories");
        }
        const data = (await response.json()) as ResponseData<Categories[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};