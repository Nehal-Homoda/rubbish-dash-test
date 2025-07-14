"use client";

import {
  addTicketMessageService,
  getTicketByIdService,
  getTicketsService,
  showTicketMessagesService,
} from "@/services/ticketsServices";
import { AdminTicket, Message, Ticket } from "@/types/tickets.interface";
import { getQueryParam } from "@/utils/shared";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const id = () => {
    return getQueryParam("id") || "";
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminTicket, setAdminTicket] = useState<AdminTicket | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [adminMessage, setAdminMessage] = useState<string>("");
  const router=useRouter()

  const fetchTicketById = () => {
    getTicketByIdService(id()).then((response) => {
      setAdminTicket(response.data);
      showTicketMessagesService(Number(id())).then((response) => {
        console.log(response);

        setMessages(response.data.messages);
      });
    });
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMsg = () => {
    if (!adminTicket) return;
    const body = JSON.stringify({
      content: inputMessage,
    });
    addTicketMessageService(adminTicket.id, body).then((response) => {
      console.log(response);
      setIsSent(true);
      setAdminMessage(inputMessage);
      setInputMessage("");
    });
  };

  useEffect(() => {
    fetchTicketById();
  }, []);

  useEffect(() => {
    if (!adminTicket) return;
    const messageInterval = setInterval(() => {
      showTicketMessagesService(adminTicket.id).then((response) => {
        console.log("new new ");
        setMessages(response.data.messages);
      });
    }, 3000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [adminTicket]);
  return (
    <div className="h-screen overflow-hidden flex flex-col shadow-2xl rounded-2xl px-3">
      <div className="flex-none px-4 py-10 bg-white  ">
            <div className="text-right ">
              <span className="font-bold">
                {adminTicket && adminTicket.created_by.name}
              </span>
            </div>
            <div className="flex justify-between items-center gap-1">
              <div className="bg-gray-100 w-full h-0.5 mt-3"></div>
              <span className="">اليوم</span>
              <div className="bg-gray-100 w-full h-0.5 mt-3"></div>
              <div></div>
            </div>
          </div>

          <div className="flex-1  flex flex-col overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`max-w-[40%]  w-full mb-4  px-3 py-4 rounded-lg ${
                  item.sender.type.includes("Admin")
                    ? "bg-[#009414]  text-white self-start text-start"
                    : "self-end text-end text-[#38433bf6] bg-[#ADAAAA1F] "
                }`}
              >
                {item.content}
              </div>
            ))}
          </div>

           {/* Input and Buttons */}
      <div className="flex-none bg-white border-t p-4">
        <div className="flex flex-col gap-4">
          <input
            value={inputMessage}
            onChange={handleChangeValue}
            className="w-full border rounded px-4 py-2 text-sm"
            type="text"
            placeholder="اكتب رسالتك هنا"
          />

          <div className="flex items-center justify-center gap-4">
            <button
              type="submit"
              className="base-btn min-w-[200px]"
              onClick={handleSendMsg}
            >
              ارسال
            </button>
            <button onClick={()=>router.push('/support')} type="button" className="btn-secondary px-10">
              عودة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
