"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { AdminTicket, Message, Ticket } from "@/types/tickets.interface";
import editImg from "@/assets/images/icons/edit.png";
import {
  addTicketMessageService,
  deleteTicketService,
  getTicketsService,
  showTicketMessagesService,
  updateTicketService,
} from "@/services/ticketsServices";
import { useRouter } from "next/navigation";


type FormDataType = {
  title_ar: string;
  content: string;
};
export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Ticket[]>([]);
  const router = useRouter();
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " الاسم", name: "created_by" },
    { text: "الموضوع", name: "subject" },
    { text: "النوع", name: "type" },
    { text: "الحالة", name: "status" },
    { text: "تاريخ الانشاء", name: "created_at" },
    { text: "الاجراءات", name: "procedures" },
  ];
  const statusList = [
    { is_active: "open", name: "مفتوحة" },
    { is_active: "closed", name: "مغلقة" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<Ticket | null>(null);
  const [adminTicket, setAdminTicket] = useState<AdminTicket | null>(null);


  const [formData, setFormData] = useState<FormDataType>({
    title_ar: "",
    content: "",
  });

  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    title_ar: "",
    content: "",
  });
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminMessage, setAdminMessage] = useState<string>("");



  //  ################ FILTERATION  QUERY #################
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const itemType = (item: Ticket) => {
    if (item.created_by.type.includes("Collector")) return "جامع قمامة";
    if (item.created_by.type.includes("User")) return "مستخدم";

    return "-";
  };



  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
    fetchDataList({ status: value, pageNum: 1 });
  };
  const fetchDataList = ({
    search = searchTerm,
    status = statusFilter,
    pageNum = page
  }: { search?: string; status?: string | undefined; pageNum?: number } = {}) => {
    const isActive = status != undefined ? "&status=" + status : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}`;

    getTicketsService(query)
      .then((response) => {
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => { });
  };
  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    fetchDataList({ search: val, pageNum: 1 });

  };

  const updateDataItemActive = (value: any, index: number) => {
    const service = dataList.find((item, i) => {
      return index == i;
    });

    if (!service) return;

    const body = JSON.stringify({
      status: value,
    });

    updateTicketService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].status = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => { });
  };

  const deleteSubmit = (item: Ticket, selectedIndex: number) => {
    deleteTicketService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => { });
  };

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...statusList]}
          itemName="name"
          itemValue="is_active"
          // onSelected={(value) => {
          //   fetchDataList({ status: value });
          // }}
          onSelected={handleStatusFilter}
        >
          الحالة
        </UIPrimaryDropdown>
      </>
    );
  };

  useEffect(() => {
    fetchDataList();
  }, [page]); 



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
    <>
      <div className="py-20">
        <BaseDataTable
          items={dataList}
          headItems={headerArr}
          onPageChange={setPage}
          totalPages={totalPages}
          onSearchChange={tableSearchHandler}
          headerActionsSlot={tableHeadActionsSlot()}
          renderers={{
            type: (item) => (
              <div>
                <span>{itemType(item)}</span>
              </div>
            ),
            created_by: (item) => (
              <div>
                <span>{item.created_by.name}</span>
              </div>
            ),
            status: (item, index: number) => (
              <UIPrimaryDropdown
                tiny={true}
                itemName="name"
                itemValue="is_active"
                btnColorTailwindClass={
                  item.status == "closed"
                    ? "bg-red-100 text-red-600 hover:bg-text-red-200"
                    : undefined
                }
                onSelected={(value) => {
                  updateDataItemActive(value, index);
                }}
                items={statusList}
              >
                {item.status == "open" ? "مفتوحة" : "مغلقة"}
              </UIPrimaryDropdown>
            ),

            procedures: (item, index: number) => (
              <div className="flex justify-center gap-3">
                <UIDialogConfirm
                  danger
                  title="هل انت متأكد من حذف العنصر"
                  confirmHandler={() => {
                    deleteSubmit(item, index);
                  }}
                >
                  <button className="bg-[#F9285A0A] p-1 rounded-lg">
                    <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                  </button>
                </UIDialogConfirm>

                <div
                  onClick={() => router.push(`/support/startChat?id=${item.id}`)}
                  className="bg-[#009414] py-1 px-3 rounded-xl text-center  text-white  cursor-pointer"
                >
                  <span className="mdi mdi-chat-processing-outline"></span>
                </div>

              </div>
            ),
          }}
        >

        </BaseDataTable>
      </div>
    </>
  );
}
