
"use client";
import React, { useEffect, useState } from "react";
import {
    updateDistrictService,
} from "@/services/districtService";
import { District } from "@/types/district.interface";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog, validateAllInputs } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { getCollectorsService } from "@/services/collectorsService";
import { Collector } from "@/types/collectors.interface";
import * as Yup from "yup";
import { Area } from "@/types/area.interface";
import { addAreaService, deleteAreaService, getAreaService, updateAreaService } from "@/services/areaServices";

interface FormDataInputs {
    name_ar: string;
    name_en: string;
}
interface FormDataInputErrors {
    name_ar: string | null;
    name_en: string | null;

}
type FormDataType = {
    name_ar: string;
    name_en: string;
    order: number;
    is_active: number;
};


export default function rubbush_collectors() {
    const [dataList, setDataList] = useState<Area[]>([]);
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " اسم الحي", name: "name_ar" },
        { text: " عدد المناطق", name: "districts_count" },
        { text: " الترتيب", name: "order" },
        { text: "الحالة", name: "is_active" },
        { text: "الاجراءات", name: "procedures" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedDataItem, setSelectedDataItem] = useState<District | null>(
        null,
    );
    const formSchema = Yup.object().shape({
        name_ar: Yup.string().required(),
        name_en: Yup.string().required(),
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
        name_ar: "",
        name_en: "",
    });
    const [updateFormErrors, setUpdateFormErrors] = useState<FormDataInputErrors>(
        {
            name_ar: "",
            name_en: "",

        },
    );
    const [formData, setFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        order: 0,
        is_active: 0,

    });
    const [updateFormData, setUpdateFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        order: 0,
        is_active: 0,

    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
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

        getAreaService(query)
            .then((response) => {
                setDataList(response.data);
                setTotalPages(response.meta.last_page);
            })
            .catch(() => { });
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

        updateAreaService(service.id, body)
            .then((response) => {
                const arr = [...dataList];
                arr[index].is_active = value;

                setDataList(arr);

                console.log(response);
            })
            .catch((error) => { });
    };

    const deleteSubmit = (item: District, selectedIndex: number) => {
        deleteAreaService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(selectedIndex, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => { });
    };

    const updateDataItem = (item: District) => {
        setSelectedDataItem(item);
        setUpdateFormData({
            name_ar: item.name_ar,
            name_en: item.name_en,
            order: item.order,
            is_active: item.is_active ? 1 : 0,

        });
    };

    const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedDataItem) return;
        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            updateFormData,
        );
        if (!validateResult) return;
        setUpdateFormErrors({ ...validateResult.outputResult });
        if (validateResult.isInvalid) return;

        const body = JSON.stringify({
            ...updateFormData,
        });

        updateAreaService(selectedDataItem.id, body)
            .then((response) => {
                fetchDataList();
                successDialog(true);
                setIsUpdateDialogOpen(false);


            })
            .catch((error) => {
                setErrorMsg(error?.message);
                setIsUpdateDialogOpen(false);
            });
    };

    const addFormChangeHander = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        console.log(e.target.name, e.target.value);
    };
    const updateFormChangeHander = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number,
    ) => {
        setUpdateFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        console.log(e.target.name, e.target.value);
    };

    const createSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            formData,
        );
        if (!validateResult) return;
        setFormErrors({ ...validateResult.outputResult });
        if (validateResult.isInvalid) return;
        const fd = new FormData();
        fd.append("name_ar", formData.name_ar);
        fd.append("name_en", formData.name_en);
        fd.append("order", formData.order.toString());
        fd.append("is_active", formData.is_active.toString());
        addAreaService(fd)
            .then((response) => {
                fetchDataList();
                //@ts-ignore
                successDialog(true);
                setIsDialogOpen(false);
                setFormData({
                    name_ar: "",
                    name_en: "",
                    order: 0,
                    is_active: 0,
                });
            })
            .catch((error) => {
                setErrorMsg(error?.message);
            });
    };

    const tableHeadActionsSlot = () => {
        return (
            <>
                <UIBaseDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="اضافة حي"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button onClick={() => setIsDialogOpen(true)} className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة حي
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={createSubmit} id="update-form">


                        <div className="space-y-7">
                            <TextFieldNada
                                errorMessage={formErrors.name_ar || ""}
                                name="name_ar"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.name_ar}
                                label=" اسم الحي ( عربي ) "
                                placeholder=" اسم الحي  "
                                required
                            ></TextFieldNada>

                            <TextFieldNada
                                errorMessage={formErrors.name_en || ""}
                                name="name_en"
                                type="text"
                                handleChange={addFormChangeHander}
                                value={formData.name_en}
                                label=" اسم الحي ( انجليزي ) "
                                placeholder=" اسم الحي  "
                            ></TextFieldNada>


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
                    </form>
                </UIBaseDialog>
            </>
        );
    };


    useEffect(() => {
        fetchDataList();
    }, [page]);


    return (
        <>
            <div className="py-20">
                <BaseDataTable
                    headItems={headerArr}
                    items={dataList}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    onSearchChange={tableSearchHandler}
                    headerActionsSlot={tableHeadActionsSlot()}
                    renderers={{
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
                                    confirmHandler={() => deleteSubmit(item, index)}
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
                ></BaseDataTable>


                <UIBaseDialog
                    open={isUpdateDialogOpen}
                    onClose={() => setIsUpdateDialogOpen(false)}
                    title="تعديل حي"
                    confirmHandler={() => { }}
                    confirmText="حفظ"
                    form="update-form"

                >
                    <form onSubmit={updateSubmit} id="update-form">
                        <div className="space-y-7">
                            <TextFieldNada
                                name="name_ar"
                                type="text"
                                handleChange={updateFormChangeHander}
                                value={updateFormData.name_ar}
                                label=" اسم الحي ( عربي ) "
                                placeholder=" اسم الحي  "
                                errorMessage={updateFormErrors.name_ar || ""}
                            ></TextFieldNada>

                            <TextFieldNada
                                name="name_en"
                                type="text"
                                handleChange={updateFormChangeHander}
                                value={updateFormData.name_en}
                                label=" اسم الحي ( انجليزي ) "
                                placeholder=" اسم الحي  "
                                errorMessage={updateFormErrors.name_en || ""}
                            ></TextFieldNada>


                            <SelectInput
                                value={updateFormData.is_active}
                                items={statusList}
                                itemName="name"
                                itemValue="is_active"
                                label="الحالة"
                                placeholder="اختر الحالة"
                                name="is_active"
                                required={true}
                                onChange={(value) => {
                                    setUpdateFormData((prev) => ({
                                        ...prev,
                                        ["is_active"]: value,
                                    }));
                                }}
                            ></SelectInput>




                        </div>
                    </form>
                </UIBaseDialog>


            </div>
        </>
    );
}
