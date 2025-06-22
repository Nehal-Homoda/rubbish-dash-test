import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { PackageOffer } from "@/types/packagesOffer.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getPackagesService = async () => {
    try {
        const response = await apiCall.get(`/admins/packages`, {
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

export const packageListByPageService = async (pageNumber: number) => {
    try {
        const response = await apiCall.get(
            `/admins/packages?page=${pageNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "package list");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const filterPackageBySearchService = async (
    pageNumber: number,
    searchValue
) => {
    try {
        const response = await apiCall.get(
            `/admins/packages?page=${pageNumber}&search=${searchValue}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "package list");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const filterPackageByStateService = async (
    pageNumber: number,
    is_active: number
) => {
    try {
        const response = await apiCall.get(
            `/admins/packages?page=${pageNumber}&is_active=${is_active}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "package list");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const activatePackageService = async (
    id: number,
    is_active: number
) => {
    try {
        const response = await apiCall.put("/admins/packages", id, {
            body: JSON.stringify({ is_active }),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update package");
        }
        const data = await response.json();
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
        const data = await response.json();
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
                Authorization: `Bearer ${token}`,
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
export const updatePackageService = async (id: number, item) => {
    try {
        const response = await apiCall.put("/admins/packages", id, {
            body: JSON.stringify(item),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update package");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

