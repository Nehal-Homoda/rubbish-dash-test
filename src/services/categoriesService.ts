import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { Categories } from "@/types/categories.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";


export const getCategoriesService = async () => {
    try {
        const response = await apiCall.get(`/admins/categories`, {
          headers: {
            // "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
            await responseErrorServiceHandler(response, "categories");
        }
        const data = (await response.json()) as ResponseData<Categories[]>;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const categoryListByPageService = async (pageNumber: number) => {
  try {
    const response = await apiCall.get(`/admins/categories?page=${pageNumber}`, {
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

export const filterCategoryBySearchService = async (
  pageNumber: number,
  searchValue
) => {
  try {
    const response = await apiCall.get(
      `/admins/categories?page=${pageNumber}&search=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Category list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};



export const filterCategoryByStateService = async (
  pageNumber: number,
  is_active: number
) => {
  try {
    const response = await apiCall.get(
      `/admins/categories?page=${pageNumber}&is_active=${is_active}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "Category list");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};








export const activateCategoryService = async (id: number, is_active: number) => {
  try {
    const response = await apiCall.put(
      "/admins/categories", id,
      {
        body:JSON.stringify({ is_active}),
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
        const data = (await response.json()) ;
        console.log("response data =>>>>", data);
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const deleteCategoryService = async (id: number) => {
  try {
    const response = await apiCall.delete(
      "/admins/categories", id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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
export const updateCategoryService = async (id: number,item) => {
  try {
    const response = await apiCall.put(
      "/admins/categories", id,
      {
        body:JSON.stringify(item),
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