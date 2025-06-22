import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Payment } from "@/types/payment.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";



export const getPaymentService = async () => {
    try {
        const response = await apiCall.get(`/admins/payment_methods`, {
          headers: {
            // "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "Payment");
        }
        const data = (await response.json()) as ResponseData<Payment[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const paymentListByPageService = async (pageNumber: number) => {
  try {
    const response = await apiCall.get(`/admins/payment_methods?page=${pageNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Payment list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const filterPaymentBySearchService = async (
  pageNumber: number,
  searchValue
) => {
  try {
    const response = await apiCall.get(
      `/admins/payment_methods?page=${pageNumber}&search=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Payment list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};



export const filterPaymentByStateService = async (
  pageNumber: number,
  is_active: number
) => {
  try {
    const response = await apiCall.get(
      `/admins/payment_methods?page=${pageNumber}&is_active=${is_active}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Payment list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};








export const activatePaymentService = async (id: number, is_active: number) => {
  try {
    const response = await apiCall.put(
      "/admins/payment_methods", id,
      {
        body:JSON.stringify({ is_active}),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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
        const response = await apiCall.post(`/admins/payment_methods`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add Payment");
        }
        const data = (await response.json()) ;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const deletePaymentService = async (id: number) => {
  try {
    const response = await apiCall.delete(
      "/admins/payment_methods", id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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
export const updatePaymentService = async (id: number,item) => {
  try {
    const response = await apiCall.put(
      "/admins/payment_methods", id,
      {
        body:JSON.stringify(item),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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