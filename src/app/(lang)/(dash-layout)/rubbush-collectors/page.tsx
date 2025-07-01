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
import FileInputImg from "@/components/ui/form/FileInputImg";
import { useRouter } from "next/navigation";
import { Collector } from "@/types/collectors.interface";
import {
    addCollectorService,
    deleteCollectorService,
    getCollectorsService,
    updateCollectorService,
} from "@/services/collectorsService";
import { getDistrictService } from "@/services/districtService";
import { District } from "@/types/district.interface";
import { useLocalePath } from "@/utils/lang";

export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<Collector[]>([]);
    const [distrects, setDistrects] = useState<District[]>([]);
    
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " الصورة", name: "image" },
        { text: " الاسم", name: "image" },
        { text: "رقم التليفون", name: "name_ar" },
        { text: " المناطق", name: "no_of_subscriptions" },
        { text: " تم التجميع", name: "no_of_subscriptions" },
        { text: " تعذر التجميع", name: "no_of_subscriptions" },
        { text: "الحالة", name: "is_active" },
        { text: "الاجراءات", name: "image" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedDataItem, setSelectedDataItem] = useState<Collector | null>(
        null
    );
    const localePath = useLocalePath()
    const router = useRouter();
    type FormDataType = {
        name: string;
        phone: string;
        password?: string;
        district_id: string[];
        image: File | null | string;
    };
    type UpdateFormDataType = {
        name: string;
        phone: string;
        password: string;
        district_id: string[];
        image: null | string;
    };
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        phone: "",
        password: "",
        district_id: [],
        image: null,
    });

    const [updateFormData, setUpdateFormData] = useState<UpdateFormDataType>({
        name: "",
        phone: "",
        password: "",
        district_id: [],
        image: null,
    });

    const fetchDataList = ({
        search = "",
        distrect_id = "",
        is_active = undefined,
    }: {
        search?: string;
        distrect_id?: string;
        is_active?: boolean | undefined;
    } = {}) => {
        console.log(is_active);
        const isActive =
            is_active != undefined
                ? is_active
                    ? "&is_active=" + 1
                    : "&is_active=" + 0
                : "";
        const hasSearch = search ? "&search=" + search : "";
        const hasDistrect = distrect_id ? "&distrect_id=" + distrect_id : "";

        const query = `?page=${page}${hasSearch}${isActive}${hasDistrect}`;

        getCollectorsService(query)
            .then((response) => {
                setDataList(response.data);
                setTotalPages(response.meta.last_page);
            })
            .catch((error) => {
                // if (error.message === 'unauthorized') {
                //     router.replace('/auth/login')
                // }
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
            is_active: value,
        });

        updateCollectorService(service.id, body)
            .then((response) => {
                const arr = [...dataList];
                arr[index].is_active = value;

                setDataList(arr);

                console.log(response);
            })
            .catch((error) => {});
    };

    const deleteSubmit = (item: Collector, selectedIndex: number) => {
        deleteCollectorService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => {});
    };

    const updateDataItem = (item: Collector) => {
        setSelectedDataItem(item);
        setUpdateFormData({
            name: item.name,
            phone: item.phone,
            district_id: item.districts.map((dist) => dist.id.toString()),
            image: item.image || null,
            password: '',
        });
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedDataItem) return;

        const form = {...updateFormData}

        if (!form.password) {
            //@ts-ignore
            delete form.password
        }

        const body = JSON.stringify({
            ...form,
        });

        updateCollectorService(selectedDataItem.id, body)
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
        fd.append("name", formData.name);
        fd.append("phone", formData.phone);
        if (formData.password) {
            fd.append("password", formData.password.toString());
        }
        if (formData.image) {
            fd.append("image", formData.image);
        }
        formData.district_id.forEach((item, index) => {
            fd.append(`district_id[${index}]`, item);
        });

        addCollectorService(fd)
            .then((response) => {
                fetchDataList();
                //@ts-ignore
                successDialog(true);
                setFormData({
                    name: "",
                    phone: "",
                    password: "",
                    district_id: [],
                    image: null,
                });
            })
            .catch((error) => {});
    };
    const fetchDistrects = () => {
        getDistrictService()
            .then((response) => {
                setDistrects(response.data);
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
                        fetchDataList({ is_active: value });
                    }}
                >
                    الحالة
                </UIPrimaryDropdown>
                <UIPrimaryDropdown
                    items={distrects}
                    itemName="name_ar"
                    itemValue="id"
                    onSelected={(value) => {
                        fetchDataList({ distrect_id: value });
                    }}
                >
                    المنطقة
                </UIPrimaryDropdown>
                <UIBaseDialog
                    title="اضافة جامع القمامة"
                    confirmHandler={() => {}}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة جامع القمامة
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={createSubmit} id="update-form">
                        <div className="space-y-7">
                            <div className="w-full flex justify-center mb-20">
                                <FileInputImg
                                    state="edit"
                                    onFileChange={(arg) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            ["image"]: arg?.file ?? null,
                                        }));
                                    }}
                                ></FileInputImg>
                            </div>
                            <TextFieldNada
                                name="name"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.name}
                                label=" اسم  "
                                placeholder=" اسم الجامع القمامة  "
                            ></TextFieldNada>
                            <TextFieldNada
                                name="phone"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.phone}
                                label=" رقم الموبايل "
                                placeholder=" رقم موبايل الجامع القمامة  "
                            ></TextFieldNada>
                            <TextFieldNada
                                name="password"
                                type="password"
                                handleChange={addFormChangeHander}
                                value={formData.password}
                                label=" كلمة المرور"
                                placeholder=" ادخل كلمة المرور "
                            ></TextFieldNada>
                            <MultiCheckbox
                                items={distrects}
                                itemName="name_ar"
                                itemValue="id"
                                onChange={(value) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        ["district_id"]: value,
                                    }));
                                }}
                                label="المنطقة"
                                placeholder="ا خترالمنطقة"
                                name="district_id"
                                required
                                value={formData.district_id}
                            ></MultiCheckbox>
                        </div>
                    </form>
                </UIBaseDialog>
            </>
        );
    };

    useEffect(() => {
        fetchDataList();
        fetchDistrects();
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
                                <div className="w-[3rem] aspect-square bg-gray-50 rounded-full overflow-hidden">
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="py-2 px-4">{item.name}</td>
                            <td className="py-2 px-4">{item.phone}</td>
                            <td className="py-2 px-4">
                                {!!item.districts && item.districts.length
                                    ? item.districts
                                          .map((dist) => dist.name)
                                          .join(" | ")
                                    : "-"}
                            </td>
                            <td className="py-2 px-4">
                                {item.count_collected}
                            </td>
                            <td className="py-2 px-4">
                                {item.count_not_collected}
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
                                    <button onClick={() => {router.push(localePath('/rubbush-collectors/details/profile?id=' + item.id))}} className="bg-blue-100 p-1 px-2 rounded-lg">
                                        <span className="mdi mdi-eye text-blue-500"></span>
                                    </button>
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
                                                className="bg-[#0094140D] p-1 px-2 rounded-lg"
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
                                                        fileUrl={
                                                            updateFormData.image ??
                                                            ""
                                                        }
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
                                                    name="name"
                                                    type="text"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={updateFormData.name}
                                                    label=" اسم  "
                                                    placeholder=" اسم الجامع القمامة  "
                                                ></TextFieldNada>
                                                <TextFieldNada
                                                    name="phone"
                                                    type="text"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={updateFormData.phone}
                                                    label=" رقم الموبايل "
                                                    placeholder=" رقم موبايل الجامع القمامة  "
                                                ></TextFieldNada>
                                                <TextFieldNada
                                                    name="password"
                                                    type="password"
                                                    handleChange={
                                                        updateFormChangeHander
                                                    }
                                                    value={
                                                        updateFormData.password
                                                    }
                                                    label=" كلمة المرور"
                                                    placeholder=" ادخل كلمة المرور "
                                                ></TextFieldNada>
                                                <MultiCheckbox
                                                    items={distrects}
                                                    itemName="name_ar"
                                                    itemValue="id"
                                                    onChange={(value) => {
                                                        setUpdateFormData(
                                                            (prev) => ({
                                                                ...prev,
                                                                ["district_id"]:
                                                                    value,
                                                            })
                                                        );
                                                    }}
                                                    label="المنطقة"
                                                    placeholder="ا خترالمنطقة"
                                                    name="district_id"
                                                    required
                                                    value={
                                                        updateFormData.district_id
                                                    }
                                                ></MultiCheckbox>
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
