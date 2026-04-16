"use client";
import React, { useEffect, useState } from "react";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import { getQueryParam, successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { Visit } from "@/types/visits.interface";
import {
    deleteVisitsService,

    getVisitsService,
    updateVisitsService,
} from "@/services/visitService";


type FormDataType = {
    name_ar: string;
    name_en: string;
    category_id: number | string;
    is_active: number;
    price_per_unit: number | string;
    order: number;
    days_count: number | string;
};


export default function page() {
    const [dataList, setDataList] = useState<Visit[]>([]);
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " المنطقة ", name: "name" },
        { text: " نوع الخدمة", name: "category" },
        { text: "المستخدم", name: "price_per_unit" },
        { text: "جامع القمامة", name: "days_count" },
        { text: "تاريخ الزيارة", name: "price_per_unit" },
        { text: "الحالة", name: "is_active" },
        { text: "ملاحظة", name: "" },
    ];
    const statusList = [
        { is_active: "pending", name: "قيد الانتظار" },
        { is_active: "in_progress", name: "قيد التنفيذ" },
        { is_active: "collected", name: "مجمع" },
        { is_active: "not_collected", name: "غير مجمع" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedDataItem, setSelectedDataItem] = useState<Visit | null>(
        null
    );


    const [updateFormData, setUpdateFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        category_id: "",
        is_active: 0,
        price_per_unit: "",
        order: 0,
        days_count: "",
    });

    const fetchDataList = ({
        search = "",
        collector_id = ""


    }: { search?: string; collector_id?: string } = {}) => {
        const id = () => {
            return getQueryParam('id') || '';
        };
        console.log(id())
        getVisitsService().then((response) => {
            console.log('response is', response)
        })
        const hasSearch = search ? "&search=" + search : "";
        const collectorId = "&collector_id=" + id();
        const query = `?page=${page}${hasSearch}${collectorId}`;

        getVisitsService(query)
            .then((response) => {
                console.log('response is', response)
                setDataList(response.data);
                setTotalPages(response.meta.last_page);
            })
            .catch(() => { });
    };
    const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        // fetchDataList({ search: e.target.value });
    };

    const updateDataItemActive = (value: any, index: number) => {
        const service = dataList.find((item, i) => {
            return index == i;
        });

        if (!service) return;

        const body = JSON.stringify({
            status: value,
        });

        updateVisitsService(service.id, body)
            .then((response) => {
                const arr = [...dataList];
                arr[index].status = value;

                setDataList(arr);

                console.log(response);
            })
            .catch((error) => { });
    };

    const deleteSubmit = (item: Visit, selectedIndex: number) => {
        deleteVisitsService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => { });
    };

    const updateDataItem = (item: Visit) => {
        setSelectedDataItem(item);
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedDataItem) return;

        const body = JSON.stringify({
            ...updateFormData,
        });

        updateVisitsService(selectedDataItem.id, body)
            .then((response) => {
                fetchDataList();
                successDialog(true);
            })
            .catch((error) => { });
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

    const statusDropdownColor = (name: string) => {
        if (name === "not_collected")
            return "bg-red-100 text-red-600 hover:bg-text-red-200";
        if (name === "in_progress")
            return "bg-blue-100 text-blue-600 hover:bg-text-blue-200";
        if (name === "collected") return undefined;
        if (name === "pending")
            return "bg-yellow-100 text-yellow-600 hover:bg-text-yellow-200";
    };
    const statusDropdownName = (name: string) => {
        return statusList.find((item) => item.is_active === name)?.name ?? "";
    };

    const tableHeadActionsSlot = () => {
        return <>


        </>;
    };
    useEffect(() => {
        fetchDataList();
    }, [page]); // runs every time `page` changes

    return (
        <>
            <div className="">
                <BaseDataTable
                    items={dataList}
                    headItems={headerArr}
                    showSearch={false}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    onSearchChange={tableSearchHandler}
                    headerActionsSlot={tableHeadActionsSlot()}
                    renderers={{

                    }}
                >
                    {/* {dataList.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4">{item.id}</td>

                            <td className="py-2 px-4">{item.address}</td>
                            <td className="py-2 px-4">{item.category_name}</td>
                            <td className="py-2 px-4">{item.user_name}</td>
                            <td className="py-2 px-4">{item.collector_name}</td>
                            <td className="py-2 px-4">{item.collected_at}</td>
                            <td className="py-2 px-4">
                                <UIPrimaryDropdown
                                    tiny={true}
                                    itemName="name"
                                    itemValue="is_active"
                                    btnColorTailwindClass={statusDropdownColor(
                                        item.status
                                    )}
                                    onSelected={(value) => {
                                        updateDataItemActive(value, index);
                                    }}
                                    items={statusList}
                                >
                                    {statusDropdownName(item.status)}
                                </UIPrimaryDropdown>
                            </td>
                            <td className="">
                                <div className=" flex justify-center gap-3">
                                    <UIDialogConfirm
                                        danger
                                        title="هل انت متأكد من حذف العنصر"
                                        confirmHandler={() => {
                                            deleteSubmit(item, index);
                                        }}
                                    >
                                        <button className="bg-[#F9285A0A] p-1 px-2 text-sm rounded-lg">
                                            <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                                        </button>
                                    </UIDialogConfirm>
                                    <UIBaseDialog
                                        hideConfirmBtn
                                        title="تعديل منطقه"
                                        confirmHandler={() => { }}
                                        confirmText="اضافة"
                                        form="update-form"
                                        btn={
                                            <button
                                                onClick={() => {
                                                    updateDataItem(item);
                                                }}
                                                className="bg-blue-100 p-1 px-2 text-sm rounded-lg"
                                            >
                                                <span className="mdi mdi-eye-outline text-blue-500"></span>
                                            </button>
                                        }
                                    >
                                        <form
                                            onSubmit={updateSubmit}
                                            id="update-form"
                                        >
                                            <div className="space-y-7">
                                                <div className="relative py-3 px-5 border border-surface-light-700 rounded-2xl">
                                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 text-sm font-semibold">
                                                        <label>
                                                            ملاحظة المستخدم
                                                        </label>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-start w-full py-2 ">
                                                            {selectedDataItem?.user_note
                                                                ? selectedDataItem?.user_note
                                                                : "لا يوجد ملاحظة"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative py-3 px-5 border border-surface-light-700 rounded-2xl">
                                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 text-sm font-semibold">
                                                        <label>
                                                            سبب تعذر التجميع
                                                        </label>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-start w-full py-2 ">
                                                            {selectedDataItem?.collector_note
                                                                ? selectedDataItem?.collector_note
                                                                : "لا يوجد سبب"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-start">
                                                    <div
                                                        className={`text-start py-2 px-5 rounded-md ${statusDropdownColor(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {statusDropdownName(
                                                            item.status
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </UIBaseDialog>
                                </div>
                            </td>
                        </tr>
                    ))} */}
                </BaseDataTable>
            </div>
        </>
    );
}
