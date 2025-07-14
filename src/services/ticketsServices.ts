import { responseErrorServiceHandler } from "@/utils/shared";
import { apiCall } from "./apiCall";
import { ResponseData } from "@/types/shared";
import { AdminTicket, Ticket } from "@/types/tickets.interface";

let token = "Bearer 160|9eiDkr7DC2EryTIiZbQbO5CoJoxE7X88IPHqcNGs7f3d3254";

export const getTicketsService = async (query?: string) => {
  try {
    const response = await apiCall.get(
      `/admins/tickets${decodeURIComponent(query || "")}`,
      {
        headers: {
          // "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      await responseErrorServiceHandler(response, "tickets");
    }
    const data = (await response.json()) as ResponseData<Ticket[]>;
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTicketByIdService = async (id: number | string) => {
  try {
    const response = await apiCall.get(`/admins/tickets/${id}`, {
      headers: {
        // "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "ticket");
    }
    const data = (await response.json()) ;
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addTicketService = async (form: FormData) => {
  try {
    const response = await apiCall.post(`/admins/tickets`, {
      body: form,
      headers: {
        // "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "add service");
    }
    const data = (await response.json()) as ResponseData<Ticket>;
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const deleteTicketService = async (id: number) => {
  try {
    const response = await apiCall.delete("/admins/tickets", id, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
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
export const updateTicketService = async (id: number, body: string) => {
  try {
    const response = await apiCall.post(`/admins/tickets/${id}/update-status`, {
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "update user");
    }
    const data = (await response.json()) as ResponseData<Ticket>;
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const addTicketMessageService = async (id: number, body: string) => {
  try {
    const response = await apiCall.post(`/admins/tickets/${id}/add-message`, {
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "update user");
    }
    const data = (await response.json()) as ResponseData<AdminTicket>;
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const showTicketMessagesService = async (id: number) => {
  try {
    const response = await apiCall.get(`/admins/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      await responseErrorServiceHandler(response, "show messages");
    }
    const data = await response.json();
    console.log("response data =>>>>", data);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
