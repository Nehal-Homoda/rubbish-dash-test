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
import editImg from '@/assets/images/icons/edit.png'
import {
    addTicketMessageService,
    deleteTicketService,
    getTicketsService,
    showTicketMessagesService,
    updateTicketService,
} from "@/services/ticketsServices";

export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<Ticket[]>([]);
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " الاسم", name: "name_ar" },
        { text: "الموضوع", name: "is_active" },
        { text: "الحالة", name: "is_active" },
        { text: "تاريخ الانشاء", name: "is_active" },
        { text: "الاجراءات", name: "image" },
    ];
    const statusList = [
        { is_active: "open", name: "مفتوحة" },
        { is_active: "closed", name: "مغلقة" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedDataItem, setSelectedDataItem] = useState<Ticket | null>(
        null
    );
    const [adminTicket, setAdminTicket] = useState<AdminTicket | null>(null)

    type FormDataType = {
        title_ar: string;
        content: string;
    };
    const [formData, setFormData] = useState<FormDataType>({
        title_ar: "",
        content: "",
    });

    const [updateFormData, setUpdateFormData] = useState<FormDataType>({
        title_ar: "",
        content: "",
    });
    const [inputMessage, setInputMessage] = useState<string>('')
    const [isSent, setIsSent] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [adminMessage, setAdminMessage] = useState<string>('')


    const fetchDataList = ({
        search = "",
        status = undefined,
    }: { search?: string; status?: string | undefined } = {}) => {
        const isActive = status != undefined ? "&status=" + status : "";
        const hasSearch = search ? "&search=" + search : "";

        const query = `?page=${page}${hasSearch}${isActive}`;

        getTicketsService(query).then((response) => {
            setDataList(response.data);
            setTotalPages(response.meta.last_page);
        })
            .catch(() => {

            })
    };
    const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        fetchDataList({ search: e.target.value });
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
                    items={statusList}
                    itemName="name"
                    itemValue="is_active"
                    onSelected={(value) => {
                        fetchDataList({ status: value });
                    }}
                >
                    الحالة
                </UIPrimaryDropdown>


            </>
        );
    };
    useEffect(() => {
        fetchDataList();
    }, [page]); // runs every time `page` changes

    const handleChangeValue = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value)
    }


    const handleSelectedTicket = (item: any) => {

        setAdminTicket(item)

        showTicketMessagesService(item.id).then((response) => {
            console.log(response)


            setMessages(response.data.messages)

        })
    }





    const handleSendMsg = () => {

        if (!adminTicket) return
        const body = JSON.stringify({
            content: inputMessage
        })
        addTicketMessageService(adminTicket.id, body).then((response) => {
            console.log(response)
            setIsSent(true)
            setAdminMessage(inputMessage)
            setInputMessage('')


        })
    }




    useEffect(() => {
        if (!adminTicket) return
        const messageInterval = setInterval(() => {

            showTicketMessagesService(adminTicket.id).then((response) => {
                console.log('new new ')
                setMessages(response.data.messages)


            })

        }, 3000);

        return () => {
            clearInterval(messageInterval);
        };

    }, [adminTicket])


    const updateDataItem = (item: any) => {

    }
    const updateSubmit = () => {

    }
    const updateFormChangeHander = () => {

    }



    return (
        <>
            <div className="py-20">
                <BaseDataTable
                    headItems={headerArr}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    onSearchChange={tableSearchHandler}
                    headerActionsSlot={tableHeadActionsSlot()}
                >
                    {dataList.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4">{item.id}</td>
                            <td className="py-2 px-4">
                                {item.created_by.name}
                            </td>
                            <td className="py-2 px-4">{item.subject}</td>

                            <td className="py-2 px-4">
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
                            </td>
                            <td className="py-2 px-4">{item.created_at}</td>
                            <td className="">
                                <div className="flex gap-3">
                                    <UIDialogConfirm
                                    deleteAction={true}
                                        danger
                                        title="حذف تذكرة"
                                        confirmHandler={() => {
                                            deleteSubmit(item, index);
                                        }}
                                    >


                                        <button className="bg-[#F9285A0A] p-1 rounded-lg w-4 h-4">
                                            <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                                        </button>
                                    </UIDialogConfirm>





                                    {/* <UIBaseDialog
                                        title="تعديل تذكرة"
                                        confirmHandler={() => { }}
                                        confirmText="حفظ"
                                        form="update-form"
                                        btn={
                                            <button
                                                onClick={() => {
                                                    updateDataItem(item);
                                                }}
                                                className="bg-[#0094140D] p-1 rounded-lg"
                                            >
                                                <div className="w-4 h-4">
                                                    <img className="w-full h-full object-contain" src={editImg.src} alt="" />
                                                </div>
                                            </button>
                                        }
                                    >
                                        <form
                                            onSubmit={updateSubmit}
                                            id="update-form"
                                        >
                                            <div className="space-y-7">
                                                <TextFieldNada
                                                    name="name_ar"
                                                    type="text"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={
                                                        undefined
                                                    }
                                                    label=" اسم المنطقة ( عربي ) "
                                                    placeholder=" اسم المنطقة  "
                                                ></TextFieldNada>





                                            </div>
                                        </form>
                                    </UIBaseDialog> */}



                                    <UIBaseDialog heightStyle="h-[900px]"
                                        title="بدء محادثة"
                                        confirmHandler={() => { handleSendMsg() }}
                                        confirmText="ارسال"
                                        form="update-form"
                                        btn={
                                            <div onClick={() => handleSelectedTicket(item)} className="bg-[#009414] py-1 px-3 rounded-xl text-center  text-white  cursor-pointer">
                                                <span className="mdi mdi-chat-processing-outline"></span>
                                            </div>
                                        }
                                    >
                                        <div className="flex flex-col justify-between h-full ">

                                            <div className="" >
                                                <div className="text-right px-4 py-5">
                                                    <span className="font-bold">{adminTicket && adminTicket.created_by.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center gap-1">
                                                    <div className="bg-gray-100 w-full h-0.5 mt-3">

                                                    </div>
                                                    <span className="">اليوم</span>
                                                    <div className="bg-gray-100 w-full h-0.5 mt-3">

                                                    </div>
                                                    <div>

                                                    </div>

                                                </div>
                                            </div>


                                            <div className="h-[500px] overflow-y-auto px-4 mt-3">

                                                {messages.map((item, index) => (
                                                    item.sender.type.includes('Admin') ?
                                                        <div className=" bg-[#009414] text-white text-right mb-4  px-3 py-4 rounded-lg">
                                                            {item.content}
                                                        </div> :

                                                        <div className="text-left text-[#38433bf6] bg-[#ADAAAA1F] mb-4 px-3 py-4  rounded-lg ">
                                                            {item.content}
                                                        </div>
                                                ))}



                                            </div>


                                            <div className="">
                                                <div className="p-4   bg-white">
                                                    <input value={inputMessage} onChange={(e) => handleChangeValue(e)} className="w-full border rounded px-3 py-2" type="text" placeholder="اكتب رسالتك هنا" />
                                                </div>
                                            </div>






                                        </div>
                                    </UIBaseDialog>




                                </div>
                            </td>
                        </tr>
                    ))}
                </BaseDataTable >
            </div >
        </>
    );
}
