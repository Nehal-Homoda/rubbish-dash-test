import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import type { Region } from "@/types/regions.interface";

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
