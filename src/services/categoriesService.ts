import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Category } from "@/types/categories.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getCategoriesService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/categories${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "categories");
        }
        const data = (await response.json()) as ResponseData<Category[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const addCategoryService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/categories`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add service");
        }
        const data = (await response.json()) as ResponseData<Category>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteCategoryService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/categories", id, {
            headers: {
                // Authorization: `Bearer ${token}`,
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
export const getCategoryByIdService = async (id: number) => {
    try {
        const response = await apiCall.get(`/admins/categories/${id}`, {
            headers: {
                // Authorization: `Bearer ${token}`,
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "get category id");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateCategoryService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/categories", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update user");
        }
        const data = (await response.json()) as ResponseData<Category>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
