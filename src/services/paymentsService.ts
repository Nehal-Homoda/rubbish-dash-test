import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Payment } from "@/types/payments.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getPaymentsService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/payments${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "payments");
        }
        const data = (await response.json()) as ResponseData<Payment[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getPaymentByIdService = async (id: number) => {
    try {
        const response = await apiCall.get(`/admins/payments/${id}`, {
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "payments");
        }
        const data = (await response.json()) as ResponseData<Payment>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const addPaymentService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/payments`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add payment");
        }
        const data = (await response.json()) as ResponseData<Payment>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deletePaymentService = async (id: number) => {
    try {
        const response = await apiCall.delete("/admins/payments", id, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "delete payment");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updatePaymentService = async (id: number, body: string) => {
    try {
        const response = await apiCall.put("/admins/payments", id, {
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update payment");
        }
        const data = (await response.json()) as ResponseData<Payment>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
