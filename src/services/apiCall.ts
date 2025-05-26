const BASE_URL = "";

const headers = (): HeadersInit => {
  const token = localStorage ? localStorage.getItem("token") : null;
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const apiCall = {
  get: (path: string) => {
    return fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        ...headers(),
      },
    });
  },

  post: (endpoint: string, init?: RequestInit) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...headers(),
        ...init?.headers,
      },
      body: init?.body,
    });
  },
};
