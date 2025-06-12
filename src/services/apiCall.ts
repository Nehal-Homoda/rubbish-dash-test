import Cookies from "js-cookie";

export const APP_API_HEADERS = (): HeadersInit => {
  const token = Cookies.get("token") || process.env.NEXT_PUBLIC_TOKEN;
  console.log("token get ===> ", token);

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
      ...init,
      headers: {
        ...APP_API_HEADERS(),
        ...init?.headers,
      },
    });
  },
};
