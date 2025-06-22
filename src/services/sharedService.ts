import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { User } from "@/types/auth.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const userListByPageService = async (pageNumber: number) => {
  try {
    const response = await apiCall.get(`/admins/users?page=${pageNumber}`, {
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
export const filterUserBySearchService = async (
  pageNumber: number,
  searchValue
) => {
  try {
    const response = await apiCall.get(
      `/admins/users?page=${pageNumber}&search=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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
export const filterUserByStateService = async (
  pageNumber: number,
  is_active: number
) => {
  try {
    const response = await apiCall.get(
      `/admins/users?page=${pageNumber}&is_active=${is_active}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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
export const filterUserBySubscriptionService = async (
  pageNumber: number,
  is_subscribed: number
) => {
  try {
    const response = await apiCall.get(
      `/admins/users?page=${pageNumber}&is_subscription=${is_subscribed}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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
export const activateUserService = async (id: number, is_active: number) => {
  try {
    const response = await apiCall.put(
      "/admins/users", id,
      {
        body:JSON.stringify({ is_active }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "update user");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
