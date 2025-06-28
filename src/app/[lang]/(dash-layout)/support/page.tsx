"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import FileInputImg from "@/components/ui/form/FileInputImg";
import { Ticket } from "@/types/tickets.interface";
import {
    addTicketService,
    deleteTicketService,
    getTicketsService,
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
        });
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
            .catch((error) => {});
    };

    const deleteSubmit = (item: Ticket, selectedIndex: number) => {
        deleteTicketService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => {});
    };

    const updateDataItem = (item: Ticket) => {
        setSelectedDataItem(item);
        setUpdateFormData({
            title_ar: item.title,
            title_en: item.title,
            order: item.order,
            link: item.link,
            is_active: item.is_active ? 1 : 0,
            image: item.image,
        });
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedDataItem) return;

        const body = JSON.stringify({
            ...updateFormData,
        });

        updateTicketService(selectedDataItem.id, body)
            .then((response) => {
                fetchDataList();
                successDialog(true);
            })
            .catch((error) => {});
    };

    const addFormChangeHander = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        console.log(e.target.name, e.target.value);
    };
    const updateFormChangeHander = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number
    ) => {
        setUpdateFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        console.log(e.target.name, e.target.value);
    };

    const createSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("title_ar", formData.title_ar);
        fd.append("title_en", formData.title_en);
        fd.append("order", formData.order.toString());
        fd.append("link", formData.link);
        fd.append("is_active", formData.is_active.toString());
        if (formData.image) {
            fd.append("image", formData.image);
        }

        addTicketService(fd)
            .then((response) => {
                fetchDataList();
                //@ts-ignore
                successDialog(true);
                setFormData({
                    title_ar: "",
                    title_en: "",
                    order: 0,
                    link: "",
                    is_active: 0,
                    image: null,
                });
            })
            .catch((error) => {});
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
                                        item.status == "open"
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
                                    {/* <UIBaseDialog
                                        title="تعديل الالاشاد"
                                        confirmHandler={() => {}}
                                        confirmText="اضافة"
                                        form="update-form"
                                        btn={
                                            <button
                                                onClick={() => {
                                                    updateDataItem(item);
                                                }}
                                                className="bg-[#0094140D] p-1 rounded-lg"
                                            >
                                                <span className="mdi mdi-folder-edit-outline text-[#009414]"></span>
                                            </button>
                                        }
                                    >
                                        <form
                                            onSubmit={updateSubmit}
                                            id="update-form"
                                        >
                                            <div className="space-y-7">
                                                <div className="w-full flex justify-center mb-20">
                                                    <FileInputImg
                                                        state="edit"
                                                        fileUrl={item.image}
                                                        onFileChange={(arg) => {
                                                            setUpdateFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    ["image"]:
                                                                        arg?.file64 ??
                                                                        null,
                                                                })
                                                            );
                                                        }}
                                                    ></FileInputImg>
                                                </div>
                                                <TextFieldNada
                                                    name="title_ar"
                                                    type="text"
                                                    prependIcon="mdi mdi-notebook-edit-outline"
                                                    iconType="mdi"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={
                                                        updateFormData.title_ar
                                                    }
                                                    label=" النص ( عربي ) "
                                                    placeholder=" ادخل نص اللافتة بالغة العربية  "
                                                ></TextFieldNada>

                                                <TextFieldNada
                                                    name="title_en"
                                                    type="text"
                                                    prependIcon="mdi mdi-notebook-edit-outline"
                                                    iconType="mdi"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={
                                                        updateFormData.title_en
                                                    }
                                                    label=" النص ( انجليزي ) "
                                                    placeholder=" ادخل نص اللافتة بالغة الانجليزية  "
                                                ></TextFieldNada>

                                                <TextFieldNada
                                                    name="link"
                                                    type="text"
                                                    prependIcon="mdi mdi-notebook-edit-outline"
                                                    iconType="mdi"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={updateFormData.link}
                                                    label=" الرابط"
                                                    placeholder=" ادخل الرابط الخاص باللافتة  "
                                                ></TextFieldNada>

                                                <TextFieldNada
                                                    name="order"
                                                    type="number"
                                                    prependIcon="mdi mdi-swap-vertical"
                                                    iconType="mdi"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={updateFormData.order}
                                                    label=" الترتيب"
                                                    placeholder=" ادخل رقم ترتيب النص في العرض "
                                                ></TextFieldNada>

                                                <SelectInput
                                                    value={
                                                        updateFormData.is_active
                                                    }
                                                    items={statusList}
                                                    itemName="name"
                                                    itemValue="is_active"
                                                    label="الحالة"
                                                    placeholder="لختر الحالة"
                                                    name="is_active"
                                                    required={true}
                                                    onChange={(value) => {
                                                        setUpdateFormData(
                                                            (prev) => ({
                                                                ...prev,
                                                                ["is_active"]:
                                                                    value,
                                                            })
                                                        );
                                                    }}
                                                ></SelectInput>
                                            </div>
                                        </form>
                                    </UIBaseDialog> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </BaseDataTable>
            </div>
        </>
    );
}
