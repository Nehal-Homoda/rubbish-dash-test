"use client";
import React, { useEffect, useState } from "react";
import { Checkbox, Label } from "flowbite-react";
import { Radio } from "flowbite-react";
import {
    addDistrictService,
    deleteDistrictService,
    updateDistrictService,
} from "@/services/districtService";

import { getDistrictService } from "@/services/districtService";
import { District } from "@/types/district.interface";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";

export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<District[]>([]);
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " اسم المنطقة", name: "name_ar" },
        { text: " عدد الاشتراكات", name: "no_of_subscriptions" },
        { text: "الحالة", name: "is_active" },
        { text: "الاجراءات", name: "image" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [districtDays, setDistrictDays] = useState<string[]>([]);
    const [districtTime, setDistrictTime] = useState<string[]>([]);
    const [selectedDataItem, setSelectedDataItem] = useState<District | null>(
        null
    );
    type FormDataType = {
        name_ar: string;
        name_en: string;
        order: number;
        is_active: number;
        available_days: string[];
        available_times: string[];
    };
    const [formData, setFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        order: 0,
        is_active: 0,
        available_days: [],
        available_times: [],
    });

    const [updateFormData, setUpdateFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        order: 0,
        is_active: 0,
        available_days: [],
        available_times: [],
    });

    const fetchDataList = ({
        search = "",
        is_active = undefined,
    }: { search?: string; is_active?: boolean | undefined } = {}) => {
        console.log(is_active);
        const isActive =
            is_active != undefined
                ? is_active
                    ? "&is_active=" + 1
                    : "&is_active=" + 0
                : "";
        const hasSearch = search ? "&search=" + search : "";

        const query = `?page=${page}${hasSearch}${isActive}`;

        getDistrictService(query).then((response) => {
            setDataList(response.data);
            response.data.map((item, index) => {
                setDistrictDays(item.available_days);
                setDistrictTime(item.available_times);
            });
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
            is_active: value,
        });

        updateDistrictService(service.id, body)
            .then((response) => {
                const arr = [...dataList];
                arr[index].is_active = value;

                setDataList(arr);

                console.log(response);
            })
            .catch((error) => {});
    };

    const deleteSubmit = (item: District, selectedIndex: number) => {
        deleteDistrictService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => {});
    };

    const updateDataItem = (item: District) => {
        setSelectedDataItem(item);
        setUpdateFormData({
            name_ar: item.name_ar,
            name_en: item.name_en,
            order: item.order,
            is_active: item.is_active ? 1 : 0,
            available_days: item.available_days,
            available_times: item.available_times,
        });
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedDataItem) return;

        const body = JSON.stringify({
            ...updateFormData,
        });

        updateDistrictService(selectedDataItem.id, body)
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
        fd.append("name_ar", formData.name_ar);
        fd.append("name_en", formData.name_en);
        fd.append("order", formData.order.toString());
        formData.available_days.forEach((day, index) =>
            fd.append(`available_days[${index}]`, day)
        );
        formData.available_days.forEach((time, index) =>
            fd.append(`available_times[${index}]`, time)
        );
        fd.append("is_active", formData.is_active.toString());

        addDistrictService(fd)
            .then((response) => {
                fetchDataList();
                //@ts-ignore
                successDialog(true);
                setFormData({
                    name_ar: "",
                    name_en: "",
                    order: 0,
                    is_active: 0,
                    available_days: [],
                    available_times: [],
                });
            })
            .catch((error) => {});
    };


    const tableHeadActionsSlot = () => {
        return (
            <>
                <UIBaseDialog
                    title="اضافة منطقه"
                    confirmHandler={() => {}}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة منطقة
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={createSubmit} id="update-form">
                        <div className="space-y-7">
                            <TextFieldNada
                                name="name_ar"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.name_ar}
                                label=" اسم المنطقة ( عربي ) "
                                placeholder=" اسم المنطقة  "
                            ></TextFieldNada>

                            <TextFieldNada
                                name="name_en"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.name_en}
                                label=" اسم المنطقة ( انجليزي ) "
                                placeholder=" اسم المنطقة  "
                            ></TextFieldNada>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="col-span-1">
                                    <MultiCheckbox
                                        items={districtDays}
                                        value={formData.available_days}
                                        label="اليوم"
                                        required={true}
                                        name="available_days"
                                        placeholder="اختر اليوم"
                                        prependIcon="mdi mdi-calendar-month-outline"
                                        iconType="mdi"
                                        onChange={(value) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                ["available_days"]: value,
                                            }));
                                        }}
                                    ></MultiCheckbox>
                                </div>
                                <div className="col-span-1">
                                    <MultiCheckbox
                                        items={districtTime}
                                        value={formData.available_times}
                                        label="الوقت"
                                        required={true}
                                        name="available_times"
                                        placeholder="اختر الوقت"
                                        prependIcon="mdi mdi-calendar-month-outline"
                                        iconType="mdi"
                                        onChange={(value) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                ["available_times"]: value,
                                            }));
                                        }}
                                    ></MultiCheckbox>
                                </div>
                            </div>

                            <SelectInput
                                value={formData.is_active}
                                items={statusList}
                                itemName="name"
                                itemValue="is_active"
                                label="الحالة"
                                placeholder="لختر الحالة"
                                name="is_active"
                                required={true}
                                onChange={(value) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        ["is_active"]: value,
                                    }));
                                }}
                            ></SelectInput>
                        </div>
                    </form>
                </UIBaseDialog>
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

                            <td className="py-2 px-4">{item.name_ar}</td>
                            <td className="py-2 px-4">
                                {item.no_of_subscriptions}
                            </td>
                            <td className="py-2 px-4">
                                <UIPrimaryDropdown
                                    tiny={true}
                                    itemName="name"
                                    itemValue="is_active"
                                    btnColorTailwindClass={
                                        !item.is_active
                                            ? "bg-red-100 text-red-600 hover:bg-text-red-200"
                                            : undefined
                                    }
                                    onSelected={(value) => {
                                        updateDataItemActive(value, index);
                                    }}
                                    items={statusList}
                                >
                                    {item.is_active ? "مفعل" : "غير مفعل"}
                                </UIPrimaryDropdown>
                            </td>
                            <td className="">
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
                                    <UIBaseDialog
                                        title="تعديل منطقه"
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
                                                <TextFieldNada
                                                    name="name_ar"
                                                    type="text"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={
                                                        updateFormData.name_ar
                                                    }
                                                    label=" اسم المنطقة ( عربي ) "
                                                    placeholder=" اسم المنطقة  "
                                                ></TextFieldNada>

                                                <TextFieldNada
                                                    name="name_en"
                                                    type="text"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={
                                                        updateFormData.name_en
                                                    }
                                                    label=" اسم المنطقة ( انجليزي ) "
                                                    placeholder=" اسم المنطقة  "
                                                ></TextFieldNada>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="col-span-1">
                                                        <MultiCheckbox
                                                            items={districtDays}
                                                            value={
                                                                updateFormData.available_days
                                                            }
                                                            label="اليوم"
                                                            required={true}
                                                            name="available_days"
                                                            placeholder="اختر اليوم"
                                                            prependIcon="mdi mdi-calendar-month-outline"
                                                            iconType="mdi"
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                setUpdateFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        ["available_days"]:
                                                                            value,
                                                                    })
                                                                );
                                                            }}
                                                        ></MultiCheckbox>
                                                    </div>
                                                    <div className="col-span-1">
                                                        <MultiCheckbox
                                                            items={districtTime}
                                                            value={
                                                                updateFormData.available_times
                                                            }
                                                            label="الوقت"
                                                            required={true}
                                                            name="available_times"
                                                            placeholder="اختر الوقت"
                                                            prependIcon="mdi mdi-calendar-month-outline"
                                                            iconType="mdi"
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                setUpdateFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        ["available_times"]:
                                                                            value,
                                                                    })
                                                                );
                                                            }}
                                                        ></MultiCheckbox>
                                                    </div>
                                                </div>

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
                                    </UIBaseDialog>
                                </div>
                            </td>
                        </tr>
                    ))}
                </BaseDataTable>
            </div>
        </>
    );
}
