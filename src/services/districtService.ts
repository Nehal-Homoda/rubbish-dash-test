import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { District } from "@/types/district.interface";
import { Region } from "@/types/regions.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getRegionsService = async (query?: string) => {
  try {
    const response = await apiCall.get(`/admins/districts${query ?? ""}`);
    if (!response.ok) {
      await responseErrorServiceHandler(response, "districts");
    }
    const data = (await response.json()) as ResponseData<Region[]>;
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getDistrictService = async () => {
    try {
        const response = await apiCall.get(`/admins/districts`, {
          headers: {
            // "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "district");
        }
        const data = (await response.json()) as ResponseData<District[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const districtListByPageService = async (pageNumber: number) => {
  try {
    const response = await apiCall.get(`/admins/districts?page=${pageNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "district list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const filterDistrictBySearchService = async (
  pageNumber: number,
  searchValue
) => {
  try {
    const response = await apiCall.get(
      `/admins/districts?page=${pageNumber}&search=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "district list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};



export const filterDistrictByStateService = async (
  pageNumber: number,
  is_active: number
) => {
  try {
    const response = await apiCall.get(
      `/admins/districts?page=${pageNumber}&is_active=${is_active}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "district list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};








export const activateDistrictService = async (id: number, is_active: number) => {
  try {
    const response = await apiCall.put(
      "/admins/districts", id,
      {
        body:JSON.stringify({ is_active}),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "update district");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const addDistrictService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/districts`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add district");
        }
        const data = (await response.json()) ;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const deleteDistrictService = async (id: number) => {
  try {
    const response = await apiCall.delete(
      "/admins/districts", id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "delete district");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const updateDistrictService = async (id: number,item) => {
  try {
    const response = await apiCall.put(
      "/admins/districts", id,
      {
        body:JSON.stringify(item),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "update district");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};