import Cookies from "js-cookie";

export const APP_API_HEADERS = (): HeadersInit => {
  const rawToken = Cookies.get("token");
  const token = rawToken?.replace(/^"|"$/g, "");
  console.log("TOKEN INSIDE HEADER:", token);
  return {
    Accept: "application/json",
    // "Client-Type": "web",
    // 'Content-Type': "multipart/form-data",
    // "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const apiCall = {
  get: async (endpoint: string, init?: RequestInit) => {
    return fetch(BASE_URL + decodeURIComponent(endpoint), {
      method: "GET",
      body: init?.body,
    //   credentials: "include",
      ...init,
      headers: {
        ...APP_API_HEADERS(),
        ...init?.headers,
      },
    });
  },
  post: async (endpoint: string, init?: RequestInit) => {
    return fetch(BASE_URL + decodeURIComponent(endpoint), {
      method: "POST",
      body: init?.body,
    //   credentials: "include",
      ...init,
      headers: {
        ...APP_API_HEADERS(),
        ...init?.headers,
      },
    });
  },
  put: async (endpoint: string, id?: number | string, init?: RequestInit) => {
    const hasId = id != undefined ? true : false;
    const url = `${BASE_URL}${decodeURIComponent(endpoint)}${
      hasId ? "/" + id : ""
    }`;
    return fetch(url, {
      method: "PUT",
      body: init?.body,
    //   credentials: "include",
      ...init,
      headers: {
        ...APP_API_HEADERS(),
        ...init?.headers,
      },
    });
  },
  delete: async (endpoint: string, id: number, init?: RequestInit) => {
    const url = `${BASE_URL}${decodeURIComponent(endpoint)}/${id}`;
    return fetch(url, {
      method: "DELETE",
      body: init?.body,
    //   credentials: "include",
      ...init,
      headers: {
        ...APP_API_HEADERS(),
        ...init?.headers,
      },
    });
  },
};
