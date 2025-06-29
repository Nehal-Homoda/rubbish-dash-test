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
import {
    addNotificationService,
    deleteNotificationService,
    getNotificationsService,
    updateNotificationService,
} from "@/services/notificationsServices";
import { Notification } from "@/types/notifications.interface";
import MultiCheckboxWithSearch from "@/components/ui/form/MultiCheckboxWithSearch";
import { AppUser } from "@/types/user.interface";
import { Collector } from "@/types/collectors.interface";
import { getUserService } from "@/services/userService";
import { getCollectorsService } from "@/services/collectorsService";

export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<Notification[]>([]);
    const [usersList, setUsersList] = useState<AppUser[]>([]);
    const [collectorsList, setCollectorsList] = useState<Collector[]>([]);
    const [selectedAudience, setSelectedAudience] = useState('');
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " العنوان ", name: "image" },
        { text: " النص", name: "name_ar" },
        { text: "المستخدم", name: "is_active" },
        { text: "اسم المستخدم", name: "is_active" },
        { text: "تاريخ الانشاء", name: "image" },
        { text: "الاجراءات", name: "image" },
    ];
    const statusList = [
        { is_active: "all_users", name: "كل المستخدمين" },
        { is_active: "all_collectors", name: "كل جامعي القمامة" },
        { is_active: "specific_user", name: "مستخدم محدد" },
        { is_active: "specific_collector ", name: "جامع قمامة محدد" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedDataItem, setSelectedDataItem] =
        useState<Notification | null>(null);
    type FormDataType = {
        title_ar: string;
        title_en: string;
        body_ar: string;
        body_en: string;
        target_audience: string;
    };
    const [formData, setFormData] = useState<FormDataType>({
        title_ar: "",
        title_en: "",
        body_ar: "",
        body_en: "",
        target_audience: "",
    });

    const [updateFormData, setUpdateFormData] = useState<FormDataType>({
        title_ar: "",
        title_en: "",
        body_ar: "",
        body_en: "",
        target_audience: "",
    });

    const fetchDataList = ({
        search = "",
        target_audience = undefined,
    }: { search?: string; target_audience?: string | undefined } = {}) => {
        const isActive = target_audience
            ? "&target_audience=" + target_audience
            : "";
        const hasSearch = search ? "&search=" + search : "";

        const query = `?page=${page}${hasSearch}${isActive}`;

        getNotificationsService(query).then((response) => {
            setDataList(response.data);
            setTotalPages(response.meta.last_page);
        })
        .catch(() => {
            
        })
    };
    const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        fetchDataList({ search: e.target.value });
    };

    const deleteSubmit = (item: Notification, selectedIndex: number) => {
        deleteNotificationService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => {});
    };

    const updateDataItem = (item: Notification) => {
        setSelectedDataItem(item);
        setUpdateFormData({
            title_ar: item.title,
            title_en: item.title,
            body_ar: item.body,
            body_en: item.body,
            target_audience: item.type,
        });
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedDataItem) return;

        const body = JSON.stringify({
            ...updateFormData,
        });

        updateNotificationService(selectedDataItem.id, body)
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
        fd.append("body_ar", formData.body_ar);
        fd.append("body_en", formData.body_en);
        fd.append("target_audience", formData.target_audience);
        
        if (formData.target_audience === "specific_user") {
          fd.append("specific_user", selectedAudience);
        }
        if (formData.target_audience === "specific_collector") {
          fd.append("specific_collector", selectedAudience);
        }

        addNotificationService(fd)
            .then((response) => {
                fetchDataList();
                //@ts-ignore
                successDialog(true);
                setFormData({
                    title_ar: "",
                    title_en: "",
                    body_ar: "",
                    body_en: "",
                    target_audience: "",
                });
            })
            .catch((error) => {});
    };

    const handleAudienceSearch = (value: string, audience: string) => {
        if (audience === "specific_user") {
            fetchUsersList({ search: value });
            return;
        }
        if (audience === "specific_collector") {
            fetchCollectorsList({ search: value });
            return;
        }
    };
    const fetchUsersList = ({
        search = "",
    }: { search?: string; target_audience?: string | undefined } = {}) => {
        const hasSearch = search ? "&search=" + search : "";
        const query = `?page=${page}${hasSearch}`;

        getUserService(query).then((response) => {
            setUsersList(response.data);
        })
        .catch(() => {
            
        })
    };
    const fetchCollectorsList = ({
        search = "",
    }: { search?: string; target_audience?: string | undefined } = {}) => {
        const hasSearch = search ? "&search=" + search : "";
        const query = `?page=${page}${hasSearch}`;

        getCollectorsService(query).then((response) => {
            setCollectorsList(response.data);
        })
        .catch(() => {
            
        })
    };

    const tableHeadActionsSlot = () => {
        return (
            <>
                <UIPrimaryDropdown
                    items={statusList}
                    itemName="name"
                    itemValue="is_active"
                    onSelected={(value) => {
                        fetchDataList({ target_audience: value });
                    }}
                >
                    نوع الاشعار
                </UIPrimaryDropdown>
                <UIBaseDialog
                    title="اضافة اشعار"
                    confirmHandler={() => {}}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة اشعار
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={createSubmit} id="update-form">
                        <div className="space-y-10">
                            <SelectInput
                                value={formData.target_audience}
                                items={statusList}
                                itemName="name"
                                itemValue="is_active"
                                label="الفئه المستخدمة"
                                placeholder="اختر الفئه المستخدمة"
                                name="target_audience"
                                required={true}
                                onChange={(value) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        ["target_audience"]: value,
                                    }));
                                }}
                            ></SelectInput>

                            {formData.target_audience === "specific_user" && (
                                <MultiCheckboxWithSearch
                                    items={usersList}
                                    value={selectedAudience}
                                    itemName="name"
                                    itemSubName="phone"
                                    itemValue="id"
                                    showSearch={true}
                                    label="المستخدم"
                                    placeholder="اختر المستخدم المحدد"
                                    searchPlaceholder="ابحث عن مستخدم المحدد"
                                    onChange={(value) => {
                                        setSelectedAudience(value);
                                    }}
                                    onSearchChange={(e) => {
                                        handleAudienceSearch(
                                            e.target.value,
                                            "specific_user"
                                        );
                                    }}
                                    name="specific_user"
                                ></MultiCheckboxWithSearch>
                            )}

                            {formData.target_audience ===
                                "specific_collector" && (
                                <MultiCheckboxWithSearch
                                    items={collectorsList}
                                    value={selectedAudience}
                                    itemName="name"
                                    itemSubName="phone"
                                    itemValue="id"
                                    showSearch={true}
                                    label="جامع القمامة"
                                    placeholder="اختر جامع القمامة المحدد"
                                    searchPlaceholder="ابحث عن جامع القمامة المحدد"
                                    onChange={(value) => {
                                        setSelectedAudience(value);
                                    }}
                                    onSearchChange={(e) => {
                                        handleAudienceSearch(
                                            e.target.value,
                                            "specific_collector"
                                        );
                                    }}
                                    name="specific_collector"
                                ></MultiCheckboxWithSearch>
                            )}

                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 md:col-span-1">
                                    <TextFieldNada
                                        name="title_ar"
                                        type="text"
                                        prependIcon="mdi mdi-notebook-edit-outline"
                                        iconType="mdi"
                                        handleChange={addFormChangeHander}
                                        value={formData.title_ar}
                                        label=" العنوان ( عربي ) "
                                        placeholder=" ادخل عنوان الاشعار بالغة العربية  "
                                    ></TextFieldNada>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <TextFieldNada
                                        name="title_en"
                                        type="text"
                                        prependIcon="mdi mdi-notebook-edit-outline"
                                        iconType="mdi"
                                        handleChange={addFormChangeHander}
                                        value={formData.title_en}
                                        label=" العنوان ( انجليزي ) "
                                        placeholder=" ادخل عنوان الاشعار بالغة الانجليزية  "
                                    ></TextFieldNada>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 md:col-span-1">
                                    <TextFieldNada
                                        name="body_ar"
                                        type="text"
                                        prependIcon="mdi mdi-notebook-edit-outline"
                                        iconType="mdi"
                                        handleChange={addFormChangeHander}
                                        value={formData.body_ar}
                                        label=" النص ( عربي ) "
                                        placeholder=" ادخل نص الاشعار بالغة العربية  "
                                    ></TextFieldNada>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <TextFieldNada
                                        name="body_en"
                                        type="text"
                                        prependIcon="mdi mdi-notebook-edit-outline"
                                        iconType="mdi"
                                        handleChange={addFormChangeHander}
                                        value={formData.body_en}
                                        label=" النص ( انجليزي ) "
                                        placeholder=" ادخل نص الاشعار بالغة الانجليزية  "
                                    ></TextFieldNada>
                                </div>
                            </div>
                        </div>
                    </form>
                </UIBaseDialog>
            </>
        );
    };
    useEffect(() => {
        fetchDataList();
        fetchUsersList();
        fetchCollectorsList();
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
                            <td className="py-2 px-4">{item.title}</td>
                            <td className="py-2 px-4">{item.body}</td>
                            <td className="py-2 px-4">{item.type}</td>
                            <td className="py-2 px-4">{item.name ?? "-"}</td>
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
                                        <button className="bg-[#F9285A0A] p-1 px-2 rounded-lg">
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
                                                    placeholder=" ادخل نص الاشعار بالغة العربية  "
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
                                                    placeholder=" ادخل نص الاشعار بالغة الانجليزية  "
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
