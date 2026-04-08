import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Payment } from "@/types/payment.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getPaymentService = async (query?: string) => {
    try {
        const response = await apiCall.get(
            `/admins/payments${decodeURIComponent(query || "")}`,
            {
                headers: {
                    // "Content-Type": "application/json",
                },
            },
        );
        if (!response.ok) {
            await responseErrorServiceHandler(response, "packages");
        }
        const data = (await response.json()) as ResponseData<Payment[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const activatePaymentService = async (id: number, is_active: number) => {
    try {
        const response = await apiCall.put("/admins/payments", id, {
            body: JSON.stringify({ is_active }),
            // headers: {
            //     Authorization: `Bearer ${token}`,
            //     "Content-Type": "application/json",
            // },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update Payment");
        }
        const data = await response.json();
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
            await responseErrorServiceHandler(response, "add Payment");
        }
        const data = await response.json();
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
                // Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "delete Payment");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
//@ts-ignore
export const updatePaymentService = async (id: number, item) => {
    try {
        const response = await apiCall.put("/admins/payments", id, {
            body: JSON.stringify(item),
            headers: {
                // Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "update Payment");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
