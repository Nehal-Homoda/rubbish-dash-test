import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { User } from "@/types/auth.interface";
import { ResponseData } from "@/types/shared";
import { ChartData, chartData, HomeCollector, HomePayment, Statistics } from "@/types/home.interface";
import { Collector } from "@/types/collectors.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const districtListService = async () => {
    try {
        const response = await apiCall.get(`/admins/districts`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "user list");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const paymentMethodListService = async () => {
    try {
        const response = await apiCall.get(`/admins/payment_methods`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "user list");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const subscriptionListService = async () => {
    try {
        const response = await apiCall.get(`admins/subscriptions`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "user list");
        }
        const data = await response.json();
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const statisticsHomeService = async () => {
    try {
        const response = await apiCall.get(`/admins/home/section-one`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "statistics");
        }
        const data = (await response.json()) as ResponseData<Statistics>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const collectorsHomeService = async () => {
    try {
        const response = await apiCall.get(`/admins/home/section-two`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "statistics");
        }
        const data = (await response.json()) as ResponseData<HomeCollector>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const paymentsHomeService = async () => {
    try {
        const response = await apiCall.get(`/admins/home/section-four`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "statistics");
        }
        const data = (await response.json()) as ResponseData<HomePayment>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const chartStatisticsHomeService = async () => {
    try {
        const response = await apiCall.get(`/admins/home/section-three`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "statistics");
        }
        const data = (await response.json()) as ResponseData<ChartData>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


