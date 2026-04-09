"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog, validateAllInputs } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import FileInputImg from "@/components/ui/form/FileInputImg";
import { Guideline } from "@/types/guidelines.interface";
import {
    addGuidelineService,
    deleteGuidelineService,
    getGuidelinesService,
    updateGuidelineService,
} from "@/services/guidelinesServices";
import * as Yup from "yup"


interface FormDataInputs {
    title_ar: string;
    title_en: string;
    is_active: number;
    order: number;
    image: File | null | string;
}
interface FormDataInputErrors {
    title_ar: string;
    title_en: string;
    is_active: string;
    order: string;
    image: string;
}
type FormDataType = {
    title_ar: string;
    title_en: string;
    order: number;
    is_active: number;
    image: File | null | string;
};




export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<Guideline[]>([]);
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " الصورة ", name: "image" },
        { text: " النص", name: "title" },
        { text: "الحالة", name: "is_active" },
        { text: "الترتيب", name: "order" },
        { text: "الاجراءات", name: "procedures" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedDataItem, setSelectedDataItem] = useState<Guideline | null>(
        null
    );
    const [formData, setFormData] = useState<FormDataType>({
        title_ar: "",
        title_en: "",
        order: 0,
        is_active: 0,
        image: null,
    });
    const formSchema = Yup.object().shape({
        title_ar: Yup.string().required(),
        title_en: Yup.string().required(),

    });
    const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
        title_ar: "",
        title_en: "",
        order: "",
        is_active: "",
        image: "",
    });
    const [updateFormErrors, setUpdateFormErrors] = useState<FormDataInputErrors>({
        title_ar: "",
        title_en: "",
        order: "",
        is_active: "",
        image: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [updateFormData, setUpdateFormData] = useState<FormDataType>({
        title_ar: "",
        title_en: "",
        order: 0,
        is_active: 0,
        image: null,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

    const fetchDataList = ({
        search = searchTerm,
        is_active = activeFilter,
        pageNum = page
    }: { search?: string; is_active?: boolean | undefined; pageNum?: number } = {}) => {
        console.log(is_active);
        const isActive =
            is_active != undefined
                ? is_active
                    ? "&is_active=" + 1
                    : "&is_active=" + 0
                : "";
        const hasSearch = search ? "&search=" + search : "";

        const query = `?page=${page}${hasSearch}${isActive}`;

        getGuidelinesService(query).then((response) => {
            setDataList(response.data);
            setTotalPages(response.meta.last_page);
        })
            .catch(() => {

            })
    };
    const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        setPage(1);
        fetchDataList({ search: val, pageNum: 1 });
    };

    const handleActiveFilter = (value: boolean | undefined) => {
        // setActiveFilter(value);
        setPage(1);
        fetchDataList({ is_active: value, pageNum: 1 });
    };

    const updateDataItemActive = (value: any, index: number) => {
        const service = dataList.find((item, i) => {
            return index == i;
        });

        if (!service) return;

        const body = JSON.stringify({
            is_active: value,
        });

        updateGuidelineService(service.id, body)
            .then((response) => {
                const arr = [...dataList];
                arr[index].is_active = value;

                setDataList(arr);

                console.log(response);
            })
            .catch((error) => { });
    };

    const deleteSubmit = (item: Guideline, selectedIndex: number) => {
        deleteGuidelineService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => { });
    };

    const updateDataItem = (item: Guideline) => {
        setSelectedDataItem(item);
        setUpdateFormData({
            title_ar: item.title,
            title_en: item.title,
            order: item.order,
            is_active: item.is_active ? 1 : 0,
            image: item.image,
        });
    };

    const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMsg('')
        const validateResult = await validateAllInputs(
            formSchema,
            updateFormData
        );
        if (!validateResult) return;

        //@ts-ignore
        setUpdateFormErrors({ ...validateResult.outputResult });

        if (validateResult.isInvalid) return;

        if (!selectedDataItem) return;

        const body = JSON.stringify({
            ...updateFormData,
        });


        updateGuidelineService(selectedDataItem.id, body)
            .then((response) => {
                setIsUpdateDialogOpen(false)
                fetchDataList();
                successDialog(true);
            })
            .catch((error) => {
                setIsUpdateDialogOpen(false)
                setErrorMsg(error?.message)
            });
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

    const resetForm = () => {
        setFormData({
            title_ar: "",
            title_en: "",
            order: 0,
            is_active: 0,
            image: "",
        })
    }

    const createSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            formData
        );
        if (!validateResult) return
        setFormErrors({ ...validateResult.outputResult });
        if (validateResult.isInvalid) return;

        const fd = new FormData();
        fd.append("title_ar", formData.title_ar);
        fd.append("title_en", formData.title_en);
        fd.append("order", formData.order.toString());
        fd.append("is_active", formData.is_active.toString());
        if (formData.image) {
            fd.append("image", formData.image);
        }
        addGuidelineService(fd)
            .then((response) => {
                setIsDialogOpen(false)
                fetchDataList();
                //@ts-ignore
                successDialog(true);
                setFormData({
                    title_ar: "",
                    title_en: "",
                    order: 0,
                    is_active: 0,
                    image: null,
                });
            })
            .catch((error) => {
                setIsDialogOpen(false)
                setErrorMsg(error.message)
            });
    };

    const tableHeadActionsSlot = () => {
        return (
            <>
                <UIPrimaryDropdown
                    items={[{ is_active: undefined, name: "الكل" }, ...statusList]}
                    itemName="name"
                    itemValue="is_active"
                    // onSelected={(value) => {
                    //     fetchDataList({ is_active: value });
                    // }}
                    onSelected={handleActiveFilter}
                >
                    الحالة
                </UIPrimaryDropdown>
                <UIBaseDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="اضافة ارشاد"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button onClick={() => setIsDialogOpen(true)} className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة ارشاد
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={createSubmit} id="update-form">

                        {errorMsg && (
                            <div className="mb-5">
                                <span className="text-red-800"> {errorMsg}</span>

                            </div>
                        )}
                        <div className="space-y-7">
                            <div className="w-full flex justify-center mb-20">
                                <FileInputImg
                                    errorMessage={formErrors.image}
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
                                errorMessage={formErrors.title_ar || ''}
                                name="title_ar"
                                type="text"
                                prependIcon="mdi mdi-notebook-edit-outline"
                                iconType="mdi"
                                handleChange={addFormChangeHander}
                                value={formData.title_ar}
                                label=" النص ( عربي ) "
                                placeholder=" ادخل نص الارشاد بالغة العربية  "
                            ></TextFieldNada>

                            <TextFieldNada
                                errorMessage={formErrors.title_en || ''}
                                name="title_en"
                                type="text"
                                prependIcon="mdi mdi-notebook-edit-outline"
                                iconType="mdi"
                                handleChange={addFormChangeHander}
                                value={formData.title_en}
                                label=" النص ( انجليزي ) "
                                placeholder=" ادخل نص الارشاد بالغة الانجليزية  "
                            ></TextFieldNada>

                            <TextFieldNada
                                errorMessage={formErrors.order || ''}
                                name="order"
                                type="number"
                                prependIcon="mdi mdi-swap-vertical"
                                iconType="mdi"
                                handleChange={addFormChangeHander}
                                value={formData.order}
                                label=" الترتيب"
                                placeholder=" ادخل رقم ترتيب النص في العرض "
                            ></TextFieldNada>

                            <SelectInput
                                errorMessage={formErrors.is_active}
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
                    items={dataList}
                    headItems={headerArr}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    onSearchChange={tableSearchHandler}
                    headerActionsSlot={tableHeadActionsSlot()}
                    renderers={{
                        image: (item) => (
                            <div className="w-12 h-12 max-h-[30px] bg-gray-50 rounded-md">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-contain"
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

                                <button
                                    onClick={() => {
                                        updateDataItem(item);
                                        setIsUpdateDialogOpen(true)
                                    }}
                                    className="bg-[#0094140D] p-1 rounded-lg"
                                >
                                    <span className="mdi mdi-folder-edit-outline text-[#009414]"></span>
                                </button>

                            </div>
                        ),

                    }}
                >

                </BaseDataTable>
            </div>


            <UIBaseDialog
                open={isUpdateDialogOpen}
                onClose={() => setIsUpdateDialogOpen(false)}
                title="تعديل الارشاد"
                confirmHandler={() => { }}
                confirmText="تعديل"
                form="update-form"

            >
                <form
                    onSubmit={updateSubmit}
                    id="update-form"
                >

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
                                fileUrl={updateFormData.image as string}
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
                            errorMessage={updateFormErrors.title_ar || ''}
                            name="title_ar"
                            type="text"
                            prependIcon="mdi mdi-notebook-edit-outline"
                            iconType="mdi"
                            handleChange={
                                updateFormChangeHander
                            }
                            value={updateFormData.title_ar}
                            label=" النص ( عربي ) "
                            placeholder=" ادخل نص الارشاد بالغة العربية  "
                        ></TextFieldNada>

                        <TextFieldNada
                            errorMessage={updateFormErrors.title_en || ''}
                            name="title_en"
                            type="text"
                            prependIcon="mdi mdi-notebook-edit-outline"
                            iconType="mdi"
                            handleChange={
                                updateFormChangeHander
                            }
                            value={updateFormData.title_en}
                            label=" النص ( انجليزي ) "
                            placeholder=" ادخل نص الارشاد بالغة الانجليزية  "
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
                            value={updateFormData.is_active}
                            items={statusList}
                            itemName="name"
                            itemValue="is_active"
                            label="الحالة"
                            placeholder="لختر الحالة"
                            name="is_active"
                            required={true}
                            onChange={(value) => {
                                setUpdateFormData((prev) => ({
                                    ...prev,
                                    ["is_active"]:
                                        value,
                                }));
                            }}
                        ></SelectInput>
                    </div>
                </form>
            </UIBaseDialog>
        </>
    );
}
