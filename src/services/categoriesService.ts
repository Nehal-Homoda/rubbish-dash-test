import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Categories } from "@/types/categories.interface";




export const getCategoriesService = async () => {
    try {
        const response = await apiCall.get(`/admins/categories`, {
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