"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import { successDialog, validateAllInputs } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import FileInputImg from "@/components/ui/form/FileInputImg";
import { useRouter } from "next/navigation";
import { Collector } from "@/types/collectors.interface";
import * as Yup from "yup"
import {
    addCollectorService,
    deleteCollectorService,
    getCollectorsService,
    updateCollectorService,
} from "@/services/collectorsService";
import { getDistrictService } from "@/services/districtService";
import { District } from "@/types/district.interface";
import { useLocalePath } from "@/utils/lang";
import editImg from '@/assets/images/icons/edit.png'

interface FormDataInputErrors {
    name: string | null,
    phone: string,
    password: string,
    district_id: string,
    image: string | null,
}
interface FormDataInputs {
    name: string | null,
    phone: string,
    password: string,
    district_id: string[],
    image: string | null,
}
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
export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<Collector[]>([]);
    const [distrects, setDistrects] = useState<District[]>([]);
    const headerArr = [
        { text: "ID", name: "id" },
        // { text: " الصورة", name: "image" },
        { text: " الاسم", name: "name" },
        { text: "رقم التليفون", name: "phone" },
        { text: " المناطق", name: "districts" },
        { text: " تم التجميع", name: "count_collected" },
        { text: " تعذر التجميع", name: "count_not_collected" },
        { text: "الحالة", name: "is_active" },
        { text: "الاجراءات", name: "procedures" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    // ################### FILTER SECTION ####################
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
    const [regionFilter, setRegionFilter] = useState<string | undefined>(undefined)
    const localePath = useLocalePath()
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        phone: "",
        password: "",
        district_id: [],
        image: null,
    });
    const formSchema = Yup.object().shape({
        name: Yup.string().required(),
        phone: Yup.string()
            .required("رقم الهاتف مطلوب.")
            .matches(/^[0-9]+$/, "يجب أن يحتوي رقم الهاتف على أرقام فقط.")
            .min(11, "رقم الهاتف يجب أن يكون على الأقل 11 رقم."),
        password: Yup.string().required('كلمة المرور مطلوبه').min(8, "كلمة المرور يجب ان تحتوي علي 8 علي الاقل."),
        district_id: Yup.array()
            .of(Yup.string())
            .min(1, "Select at least one district")
            .required("Available districts are required"),
        image: Yup.string().required(),

    })
    const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
        name: "",
        phone: "",
        password: "",
        district_id: "",
        image: ""
    });
    const fetchDataList = ({
        search = searchTerm,
        district_id = regionFilter,
        is_active = statusFilter,
        pageNum = page
    }: {
        search?: string;
        district_id?: string;
        is_active?: boolean | undefined;
        pageNum?: number
    } = {}) => {
        console.log(is_active);
        const isActive =
            is_active != undefined
                ? is_active
                    ? "&is_active=" + 1
                    : "&is_active=" + 0
                : "";
        const hasSearch = search ? "&search=" + search : "";
        const hasDistrect = district_id ? "&district_id=" + district_id : "";

        const query = `?page=${pageNum}${hasSearch}${isActive}${hasDistrect}`;

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
        const val = e.target.value;
        setSearchTerm(val);
        setPage(1)
        fetchDataList({ search: e.target.value, pageNum: 1 });
    };

    const handleActiveFilter = (value: boolean | undefined) => {
        setPage(1)
        setStatusFilter(value)
        setPage(1);
        fetchDataList({ is_active: value, pageNum: 1 });


    }
    const handleRegionFilter = (value: string | undefined) => {
        setPage(1)
        setRegionFilter(value)
        setPage(1);
        fetchDataList({ district_id: value, pageNum: 1 });


    }

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
            .catch((error) => { });
    };

    const deleteSubmit = (item: Collector, selectedIndex: number) => {
        deleteCollectorService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
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

    const createSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('')

        const validateResult = await validateAllInputs<FormDataType>(
            formSchema,
            formData
        );
        if (!validateResult) return;
        //@ts-ignore
        setFormErrors({ ...validateResult.outputResult });
        if (validateResult.isInvalid) return;

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
                setIsDialogOpen(false)
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
            .catch((error) => {

                setErrorMsg(error?.message);


            });
    };
    const fetchDistrects = () => {
        getDistrictService()
            .then((response) => {
                setDistrects(response.data);
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
                    onSelected={handleActiveFilter}
                >
                    الحالة
                </UIPrimaryDropdown>
                <UIPrimaryDropdown
                    items={[{ id: undefined, name_ar: "الكل" }, ...distrects]}
                    itemName="name_ar"
                    itemValue="id"
                    onSelected={handleRegionFilter}
                >
                    المنطقة
                </UIPrimaryDropdown>
                <UIBaseDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="اضافة جامع القمامة"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button onClick={() => setIsDialogOpen(true)} className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة جامع القمامة
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={createSubmit} id="update-form">
                        {errorMsg && (
                            <div className="mb-6 text-start border border-red-800 bg-red-100 px-3 py-3 rounded-lg">
                                <span className="text-red-800 error-alert">
                                    {" "}
                                    {errorMsg}
                                </span>
                            </div>
                        )}
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

                                    errorMessage={formErrors.image || ""}
                                ></FileInputImg>
                            </div>
                            <TextFieldNada
                                name="name"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.name}
                                label=" اسم  "
                                placeholder=" اسم الجامع القمامة  "
                                errorMessage={formErrors.name || ""}
                            ></TextFieldNada>
                            <TextFieldNada
                                name="phone"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.phone}
                                label=" رقم الموبايل "
                                placeholder=" رقم موبايل الجامع القمامة  "
                                errorMessage={formErrors.phone}
                            ></TextFieldNada>
                            <TextFieldNada
                                name="password"
                                type="password"
                                handleChange={addFormChangeHander}
                                value={formData.password}
                                label=" كلمة المرور"
                                placeholder=" ادخل كلمة المرور "
                                errorMessage={formErrors.password}
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
                                errorMessage={formErrors.district_id}
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
    }, [page]);

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
                        districts: (item, index) => (
                            <div className="flex flex-wrap gap-2">
                                {item.districts?.map((district: any, index: number) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                                    >
                                        {district.name}
                                    </span>
                                ))}
                            </div>
                        ),
                        image: (item) => (
                            <div className="w-[3rem] h-[3rem]   rounded-full overflow-hidden">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ),
                        is_active: (item, index: number) => (
                            <UIPrimaryDropdown
                                tiny
                                itemName="name"
                                itemValue="is_active"
                                btnColorTailwindClass={
                                    !item.is_active
                                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                                        : undefined
                                }
                                items={statusList}
                                onSelected={(value) => updateDataItemActive(value, index)}
                            >
                                {item.is_active ? "مفعل" : "غير مفعل"}
                            </UIPrimaryDropdown>
                        ),
                        procedures: (item, index: number) => (
                            <div className="flex justify-center gap-3">

                                <button onClick={() => { router.push(localePath('/rubbush-collectors/details/profile?id=' + item.id)) }} className="bg-blue-100 p-1 px-2 rounded-lg">
                                    <div className="w-4 h-4 cursor-pointer">
                                        <img className="w-full h-full object-contain" src={editImg.src} alt="" />
                                    </div>
                                </button>
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
                            </div>
                        ),
                    }}
                >

                </BaseDataTable>
            </div>
        </>
    );
}
