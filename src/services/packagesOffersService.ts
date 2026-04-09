import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { PackageOffer } from "@/types/packagesOffer.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getPackagesService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/packages${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            },
        );
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
export const getPackageByIdService = async (id: number) => {
    try {
        const response = await apiCall.get(`/admins/packages/${id}`, {
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "packages");
        }
        const data = (await response.json()) as ResponseData<PackageOffer>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const addPackageService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/packages`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add package");
        }
        const data = (await response.json()) as ResponseData<PackageOffer>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deletePackageService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/packages", id, {
            headers: {
                // Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "delete package");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updatePackageService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/packages", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update package");
        }
        const data = (await response.json()) as ResponseData<PackageOffer>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
