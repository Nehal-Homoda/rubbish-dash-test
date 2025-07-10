"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import {
    addPackageService,
    deletePackageService,
    getPackagesService,
    updatePackageService,
} from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { getCategoriesService } from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";

export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<PackageOffer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " اسم الباقة", name: "name" },
        { text: " نوع الخدمة", name: "category" },
        { text: "سعر الوحدة", name: "price_per_unit" },
        { text: "مدة الباقة", name: "days_count" },
        { text: "عدد الاشتراكات", name: "price_per_unit" },
        { text: "الحالة", name: "is_active" },
        { text: "الاجراءات", name: "" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedDataItem, setSelectedDataItem] =
        useState<PackageOffer | null>(null);
    type FormDataType = {
        name_ar: string;
        name_en: string;
        category_id: number | string;
        is_active: number;
        price_per_unit: number | string;
        order: number;
        days_count: number | string;
    };
    const [formData, setFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        category_id: "",
        is_active: 0,
        price_per_unit: "",
        order: 0,
        days_count: "",
    });

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
        is_active = undefined,
        category_id = undefined,
    }: {
        search?: string;
        is_active?: boolean | undefined;
        category_id?: number | undefined;
    } = {}) => {
        console.log(is_active);
        const isActive =
            is_active != undefined
                ? is_active
                    ? "&is_active=" + 1
                    : "&is_active=" + 0
                : "";
        const category =
            category_id != undefined ? "&category_id=" + category_id : "";
        const hasSearch = search ? "&search=" + search : "";

        const query = `?page=${page}${hasSearch}${isActive}${category}`;

        getPackagesService(query).then((response) => {
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
            is_active: value,
        });

        updatePackageService(service.id, body)
            .then((response) => {
                const arr = [...dataList];
                arr[index].is_active = value;

                setDataList(arr);

                console.log(response);
            })
            .catch((error) => { });
    };

    const deleteSubmit = (item: PackageOffer, selectedIndex: number) => {
        deletePackageService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => { });
    };

    const updateDataItem = (item: PackageOffer) => {
        setSelectedDataItem(item);
        setUpdateFormData({
            name_ar: item.name_ar,
            name_en: item.name_ar,
            order: item.order ? item.order : 0,
            is_active: item.is_active ? 1 : 0,
            category_id: "",
            days_count: item.days_count ? parseInt(item.days_count) : "",
            price_per_unit: item.price_per_unit
                ? parseInt(item.price_per_unit)
                : "",
        });
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedDataItem) return;

        const body = JSON.stringify({
            ...updateFormData,
        });

        updatePackageService(selectedDataItem.id, body)
            .then((response) => {
                fetchDataList();
                successDialog(true);
            })
            .catch((error) => { });
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

        for (const keyName in formData) {
            //@ts-ignore
            fd.append(keyName, formData[keyName]);
        }

        addPackageService(fd)
            .then((response) => {
                fetchDataList();
                //@ts-ignore
                successDialog(true);
                setFormData({
                    name_ar: "",
                    name_en: "",
                    category_id: 0,
                    is_active: 0,
                    price_per_unit: 0,
                    order: 0,
                    days_count: 0,
                });
            })
            .catch((error) => { });
    };

    const tableHeadActionsSlot = () => {
        return (
            <>
                <UIPrimaryDropdown
                    items={categories}
                    itemName="name_ar"
                    itemValue="id"
                    onSelected={(value) => {
                        fetchDataList({ category_id: value });
                    }}
                >
                    نوع الخدمة
                </UIPrimaryDropdown>
                <UIPrimaryDropdown
                    items={statusList}
                    itemName="name"
                    itemValue="is_active"
                    onSelected={(value) => {
                        fetchDataList({ is_active: value });
                    }}
                >
                    الحالة
                </UIPrimaryDropdown>
                <UIBaseDialog
                    title="اضافة باقة"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة باقة
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
                                label=" اسم الباقة ( عربي ) "
                                placeholder=" اسم الباقة  "
                            ></TextFieldNada>

                            <TextFieldNada
                                name="name_en"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.name_en}
                                label=" اسم الباقة ( انجليزي ) "
                                placeholder=" اسم الباقة  "
                            ></TextFieldNada>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="col-span-1">
                                    <SelectInput
                                        value={formData.category_id}
                                        items={categories}
                                        itemName="name_ar"
                                        itemValue="id"
                                        label="نوع الخدمة"
                                        placeholder="اختر نوع الخدمة"
                                        name="category_id"
                                        required={true}
                                        onChange={(value) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                ["category_id"]: value,
                                            }));
                                        }}
                                    ></SelectInput>
                                </div>
                                <div className="col-span-1">
                                    <SelectInput
                                        value={formData.is_active}
                                        items={statusList}
                                        itemName="name"
                                        itemValue="is_active"
                                        label="الحالة"
                                        placeholder="اختر الحالة"
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
                            </div>
                            <TextFieldNada
                                name="price_per_unit"
                                type="number"
                                handleChange={addFormChangeHander}
                                value={formData.price_per_unit}
                                label=" سعر الوحدة"
                                placeholder=" ادخل سعر الوحدة "
                            ></TextFieldNada>
                            <TextFieldNada
                                name="days_count"
                                type="number"
                                handleChange={addFormChangeHander}
                                value={formData.days_count}
                                label=" مدة الباقة "
                                placeholder=" ادخل مدة الباقة  "
                            ></TextFieldNada>
                        </div>
                    </form>
                </UIBaseDialog>
            </>
        );
    };
    const fetchCategories = () => {
        getCategoriesService()
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => { });
    };
    useEffect(() => {
        fetchDataList();
        fetchCategories();
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
                            <td className="py-2 px-4">{item.category}</td>
                            <td className="py-2 px-4">{item.price_per_unit}</td>
                            <td className="py-2 px-4">{item.days_count}</td>
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
                                <div className=" flex justify-center gap-3">
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
                                        confirmHandler={() => { }}
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
                                                    value={updateFormData.name_ar}
                                                    label=" اسم الباقة ( عربي ) "
                                                    placeholder=" اسم الباقة  "
                                                ></TextFieldNada>

                                                <TextFieldNada
                                                    name="name_en"
                                                    type="text"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={updateFormData.name_en}
                                                    label=" اسم الباقة ( انجليزي ) "
                                                    placeholder=" اسم الباقة  "
                                                ></TextFieldNada>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="col-span-1">
                                                        <SelectInput
                                                            value={
                                                                updateFormData.category_id
                                                            }
                                                            items={categories}
                                                            itemName="name_ar"
                                                            itemValue="id"
                                                            label="نوع الخدمة"
                                                            placeholder="اختر نوع الخدمة"
                                                            name="category_id"
                                                            required={true}
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                setUpdateFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        ["category_id"]:
                                                                            value,
                                                                    })
                                                                );
                                                            }}
                                                        ></SelectInput>
                                                    </div>
                                                    <div className="col-span-1">
                                                        <SelectInput
                                                            value={
                                                                updateFormData.is_active
                                                            }
                                                            items={statusList}
                                                            itemName="name"
                                                            itemValue="is_active"
                                                            label="الحالة"
                                                            placeholder="اختر الحالة"
                                                            name="is_active"
                                                            required={true}
                                                            onChange={(
                                                                value
                                                            ) => {
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
                                                </div>
                                                <TextFieldNada
                                                    name="price_per_unit"
                                                    type="number"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={
                                                        updateFormData.price_per_unit
                                                    }
                                                    label=" سعر الوحدة"
                                                    placeholder=" ادخل سعر الوحدة "
                                                ></TextFieldNada>
                                                <TextFieldNada
                                                    name="days_count"
                                                    type="number"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={updateFormData.days_count}
                                                    label=" مدة الباقة "
                                                    placeholder=" ادخل مدة الباقة  "
                                                ></TextFieldNada>
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
