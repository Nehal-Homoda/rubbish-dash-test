import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Collector } from "@/types/collectors.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getCollectorsService = async (query?: string) => {
  try {
    const response = await apiCall.get(`/admins/collectors${query ?? ""}`);
    if (!response.ok) {
      await responseErrorServiceHandler(response, "collectors");
    }
    const data = (await response.json()) as ResponseData<Collector[]>;
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCollectorService = async () => {
    try {
        const response = await apiCall.get(`/admins/collectors`, {
          headers: {
            // "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "Collector");
        }
        const data = (await response.json()) as ResponseData<Collector[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const collectorListByPageService = async (pageNumber: number) => {
  try {
    const response = await apiCall.get(`/admins/collectors?page=${pageNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Collector list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const filterCollectorBySearchService = async (
  pageNumber: number,
  searchValue
) => {
  try {
    const response = await apiCall.get(
      `/admins/collectors?page=${pageNumber}&search=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Collector list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};



export const filterCollectorByStateService = async (
  pageNumber: number,
  is_active: number
) => {
  try {
    const response = await apiCall.get(
      `/admins/collectors?page=${pageNumber}&is_active=${is_active}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Collector list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};








export const activateCollectorService = async (id: number, is_active: number) => {
  try {
    const response = await apiCall.put(
      "/admins/collectors", id,
      {
        body:JSON.stringify({ is_active}),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "update Collector");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const addCollectorService = async (form: FormData) => {
    try {
        const response = await apiCall.post(`/admins/collectors`, {
            body: form,
            headers: {
                // "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "add Collector");
        }
        const data = (await response.json()) ;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const deleteCollectorService = async (id: number) => {
  try {
    const response = await apiCall.delete(
      "/admins/collectors", id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "delete Collector");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const updateCollectorService = async (id: number,item) => {
  try {
    const response = await apiCall.put(
      "/admins/collectors", id,
      {
        body:JSON.stringify(item),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "update Collector");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};