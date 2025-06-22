"use client";

import React, { useEffect, useState } from "react";
import CustomDataTable from "@/components/data-tables/customDataTable";
import {
    activateDistrictService,
    addDistrictService,
    deleteDistrictService,
    updateDistrictService,
} from "@/services/districtService";
import DropDown from "@/components/shared/StateDropDown";
import BaseDropDown from "@/components/shared/BaseDropDown";

import { getDistrictService } from "@/services/districtService";
import { District } from "@/types/district.interface";
import { useRouter } from "next/navigation";
import {
    Button,
    Checkbox,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
} from "flowbite-react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import FileInput from "@/components/ui/form/FileInput";
import { Categories } from "@/types/categories.interface";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";

export default function rubbush_collectors() {
    const [districtList, setDistrictList] = useState<District[]>([]);
    const router = useRouter();
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

    const [checkBoxValue, setCheckBoxValue] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [districtIsActive, setDistrictIsActive] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    // const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [selectedItemToUpdate, setSelectedItemToUpdate] =
        useState<District | null>(null);

    const [formData, setFormData] = useState({
        name_ar: "",
        name_en: "",
        order: 0,
        is_active: 0,
    });

    const [updateFormData, setUpdateFormData] = useState({
        id: 0,
        name_ar: "",
        name_en: "",
        order: 0,
        is_active: 0,
    });

    const onCloseModal = () => {
        setOpenModal(false);

        setFormData({
            name_ar: "",
            name_en: "",
            order: 0,
            is_active: 0,
        });
    };
    const onCloseUpdateModal = () => {
        setOpenUpdateModal(false);

        setUpdateFormData({
            id: 0,
            name_ar: "",
            name_en: "",
            order: 0,
            is_active: 0,
        });
    };

    const fetchDistrictList = ({
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
            setDistrictList(response.data);
            setTotalPages(response.meta.last_page);
        });
    };
    const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        fetchDistrictList({ search: e.target.value });
    };

    const updateDistrictActive = (value: any, index: number) => {
        const service = districtList.find((item, i) => {
            return index == i;
        });

        if (!service) return;

        const body = JSON.stringify({
            is_active: value,
        });

        updateDistrictService(service.id, body)
            .then((response) => {
                const arr = [...districtList];
                arr[index].is_active = value;

                setDistrictList(arr);

                console.log(response);
            })
            .catch((error) => {});
    };

    const deleteDistrict = (item, selectedIndex) => {
        console.log(item);
        deleteDistrictService(item.id).then((response) => {
            const updatedArr = [...districtList];
            updatedArr.splice(selectedIndex, 1);
            setDistrictList(updatedArr);
        });
    };

    const addDistrictSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("name_ar", formData.name_ar);
        fd.append("name_en", formData.name_en);
        fd.append("order", formData.order);
        fd.append("is_active", formData.is_active);
        addDistrictService(fd).then((response) => {
            // setDistrictList(response.data)
            onCloseModal();
        });
    };

    const updateDistrictItem = (item: District) => {
        setUpdateFormData({
            id: item.id,
            name_ar: item.name_ar,
            name_en: item.name_en,
            order: item.order,
            is_active: item.is_active ? 1 : 0,
            //   image: item.image,
        });
    };

    const updateDistrictSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body = JSON.stringify({
            ...updateFormData,
        });

        updateDistrictService(updateFormData.id, body)
            .then((response) => {
                fetchDistrictList();
            })
            .catch((error) => {});
    };

    const tableHeadActionsSlot = () => {
        return (
            <>
                <UIPrimaryDropdown
                    itemName="name"
                    itemValue="is_active"
                    onSelected={(value) => {
                        fetchDistrictList({ is_active: value });
                    }}
                    items={statusList}
                >
                    الحالة
                </UIPrimaryDropdown>

                <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="w-full h-full"
                    >
                        اضافة منطقة
                    </button>
                </div>
            </>
        );
    };

    useEffect(() => {
        fetchDistrictList();
    }, [page]); // runs every time `page` changes

    return (
        <>
            <div className="py-20">
                <BaseDataTable
                    headItems={headerArr}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    onSearchChange={tableSearchHandler}
                >
                    {districtList.map((item, index) => (
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
                                        updateDistrictActive(value, index);
                                    }}
                                    items={statusList}
                                >
                                    {item.is_active ? "مفعل" : "غير مفعل"}
                                </UIPrimaryDropdown>
                            </td>
                            <td className="">
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() =>
                                            deleteDistrict(item, index)
                                        }
                                        className="bg-[#F9285A0A] p-1 rounded-lg"
                                    >
                                        <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                                    </button>
                                    <UIBaseDialog
                                        title="Payment"
                                        confirmHandler={() => {}}
                                        confirmText="اضافة"
                                        form="update-form"
                                        btn={
                                            <button
                                                onClick={() => {
                                                    updateDistrictItem(item);
                                                }}
                                                className="bg-[#0094140D] p-1 rounded-lg"
                                            >
                                                <span className="mdi mdi-folder-edit-outline text-[#009414]"></span>
                                            </button>
                                        }
                                    >
                                        <form
                                            onSubmit={updateDistrictSubmit}
                                            id="update-form"
                                        >
                                            <div className="space-y-6">
                                                <div className="mx-auto text-center">
                                                    <FileInput
                                                        fileUrl={
                                                            updateFormData.image
                                                        }
                                                        state="edit"
                                                        onFileChange={(
                                                            file
                                                        ) => {
                                                            console.log(
                                                                "Received base64 in parent:",
                                                                file
                                                            );
                                                            setUpdateFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    image: file,
                                                                })
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <TextFieldNada
                                                        name="name"
                                                        type="text"
                                                        handleChange={(e) =>
                                                            takeFormValue(
                                                                e,
                                                                "updateFormData",
                                                                "name_ar"
                                                            )
                                                        }
                                                        value={
                                                            updateFormData.name_ar
                                                        }
                                                        label=" اسم المنطقة ( عربي ) *"
                                                        placeholder=" اسم المنطقه  *"
                                                    ></TextFieldNada>
                                                </div>
                                                <div>
                                                    <TextFieldNada
                                                        name="name"
                                                        type="text"
                                                        handleChange={(e) =>
                                                            takeFormValue(
                                                                e,
                                                                "updateFormData",
                                                                "name_en"
                                                            )
                                                        }
                                                        value={
                                                            updateFormData.name_en
                                                        }
                                                        label=" اسم المنطقة ( انجليزي ) *"
                                                        placeholder=" اسم المنطقه  *"
                                                    ></TextFieldNada>
                                                </div>

                                                <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                                                        <label htmlFor="district">
                                                            الحالة
                                                        </label>
                                                    </div>

                                                    <select
                                                        onChange={(e) =>
                                                            takeSelectedState(e)
                                                        }
                                                        value={Number(
                                                            updateFormData.is_active
                                                        )}
                                                        className="w-full h-full"
                                                        id="district"
                                                        required
                                                    >
                                                        {statusList.map(
                                                            (item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        item.is_active
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </form>
                                    </UIBaseDialog>
                                </div>
                            </td>
                        </tr>
                    ))}
                </BaseDataTable>

                <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                    <ModalHeader />
                    <ModalBody>
                        <form onSubmit={addDistrictService}>
                            <div className="space-y-6">
                                <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
                                    اضافة خدمة
                                </h3>
                                <div>
                                    <TextFieldNada
                                        name="name"
                                        type="text"
                                        handleChange={(e) =>
                                            takeFormValue(
                                                e,
                                                "formData",
                                                "name_ar"
                                            )
                                        }
                                        value={formData.name_ar}
                                        label=" اسم المنطقة ( عربي ) *"
                                        placeholder=" اسم المنطقة  *"
                                    ></TextFieldNada>
                                </div>
                                <div>
                                    <TextFieldNada
                                        name="name"
                                        type="text"
                                        handleChange={(e) =>
                                            takeFormValue(
                                                e,
                                                "formData",
                                                "name_en"
                                            )
                                        }
                                        value={formData.name_en}
                                        label=" اسم المنطقة ( انجليزي ) *"
                                        placeholder=" اسم المنطقة  *"
                                    ></TextFieldNada>
                                </div>

                                <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                                        <label htmlFor="district">الحالة</label>
                                    </div>

                                    <select
                                        onChange={(e) =>
                                            takeSelectedStateInFormData(e)
                                        }
                                        value={formData.is_active}
                                        className="w-full h-full"
                                        id="district"
                                        required
                                    >
                                        {statusList.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.is_active}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mx-auto w-[50%] py-5 flex gap-4">
                                    <button className="bg-[#009414] rounded-xl px-3 py-2 text-white w-full">
                                        اضافة
                                    </button>
                                    <button className="bg-[#00941412] text-[#009414] w-full rounded-xl px-3 py-2">
                                        الغاء
                                    </button>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
            </div>
        </>
    );
}
