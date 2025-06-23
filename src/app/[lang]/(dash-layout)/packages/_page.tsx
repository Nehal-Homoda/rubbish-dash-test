"use client";

import React, { useEffect, useState } from "react";
import CustomDataTable from "@/components/data-tables/customDataTable";
import {
    activatePackageService,
    filterPackageBySearchService,
    filterPackageByStateService,
    packageListByPageService,
    addPackageService,
    deletePackageService,
    updatePackageService,
    filterPackageByCategoryService,
} from "@/services/packagesOffersService";
import DropDown from "@/components/shared/StateDropDown";
import BaseDropDown from "@/components/shared/BaseDropDown";

import { getPackagesService } from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
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
import { getCategoriesService } from "@/services/categoriesService";
import { Categories } from "@/types/categories.interface";

export default function rubbush_collectors() {
    const [packageList, setPackageList] = useState<PackageOffer[]>([]);
    const [categoryList, setCategoryList] = useState<Categories[]>([]);

    const router = useRouter();
    const headerArr = [
        { text: "ID", name: "id" },
        { text: " اسم الباقة", name: "name" },
        { text: " نوع الخدمة", name: "category" },
        { text: "سعر الوحدة", name: "price_per_unit" },
        { text: "مدة الباقة", name: "days_count" },
        { text: "الحالة", name: "is_active" },
        { text: "الاجراءات", name: "" },
    ];

    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];

    const [checkBoxValue, setCheckBoxValue] = useState(false);
    const [page, setPage] = useState(1);
    const [packageIsActive, setPackageIsActive] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    // const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [selectedItemToUpdate, setSelectedItemToUpdate] =
        useState<PackageOffer | null>(null);

    type FormDataType = {
        name_ar: string;
        name_en: string;
        category_id: number;
        is_active: number;
        price_per_unit: number;
        order: number;
        days_count: number;
    };
    const [formData, setFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        category_id: 0,
        is_active: 0,
        price_per_unit: 0,
        order: 0,
        days_count: 0,
    });

    const [updateFormData, setUpdateFormData] = useState<FormDataType>({
        name_ar: "",
        name_en: "",
        category_id: 0,
        is_active: 0,
        price_per_unit: 0,
        order: 0,
        days_count: 0,
    });

    const onCloseModal = () => {
        setOpenModal(false);

        setFormData({
            name: "",
            category: "",
            price_per_unit: 0,
            days_count: 0,
            no_of_subscriptions: 0,
            is_active: 0,
        });
    };
    const onCloseUpdateModal = () => {
        setOpenUpdateModal(false);

        setUpdateFormData({
            name: "",
            category: "",
            price_per_unit: 0,
            days_count: 0,
            no_of_subscriptions: 0,
            is_active: 0,
        });
    };

    const takeFormValue = (e, formName: string, name: string) => {
        console.log("nn", e.target.value);
        let value = e.target.value;
        if (e.target.type === "number") {
            value = Number(e.target.value);
        }

        if (formName == "formData") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setUpdateFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const takeSelectedStateInFormData = (e) => {
        const value = Number(e.target.value);
        console.log(e.target.value);
        setFormData((prev) => ({
            ...prev,
            is_active: value,
        }));
    };

    const takeSelectedCategoryFormData = (e, formDataName: string) => {
        if (formDataName == "formData") {
            setFormData((prev) => ({
                ...prev,
                category_id: selectedCategoryId,
            }));
        } else {
            setUpdateFormData((prev) => ({
                ...prev,
                category_id: selectedCategoryId,
            }));
        }
        const selectedCategoryId = Number(e.target.value);
        console.log(selectedCategoryId);
        console.log(formData);
    };

    const takeSelectedState = (e) => {
        const value = Number(e.target.value);
        setUpdateFormData((prev) => ({
            ...prev,
            is_active: value,
        }));
    };

    const fetchPackageList = (pageNumber) => {
        packageListByPageService(pageNumber).then((response) => {
            console.log(response);
            setPackageList(response.data);
            // setFilteredArr(response.data);
        });
    };

    const filterPackageBySearch = (pageNumber, searchValue) => {
        filterPackageBySearchService(pageNumber, searchValue).then(
            (response) => {
                setPackageList(response.data);
            }
        );
    };
    const takeValue = (e) => {
        console.log("sjkdhfu");
        console.log(e);
        filterPackageBySearch(page, e);
    };

    const filterPackageByState = (selectedItem) => {
        console.log(selectedItem.is_active);
        filterPackageByStateService(page, selectedItem.is_active).then(
            (response) => {
                setPackageList(response.data);
                console.log("yes im active");
            }
        );
    };
    const filterPackageByCategory = (selectedItem, selectedIndex) => {
        if (!selectedItem) return;
        const x = categoryList.find((item, index) => {
            return index == selectedIndex;
        });
        if (!x) return;
        console.log(x);
        filterPackageByCategoryService(page, x.id).then((response) => {
            setPackageList(response.data);
            console.log("yes im active");
        });
    };

    const takeSelectedPage = (pageNum: number) => {
        console.log(pageNum);
        // setPage(pageNum)

        fetchPackageList(pageNum);
    };

    const takeCheckValue = (e) => {
        console.log("input checked", e.target.checked);
        setCheckBoxValue(e.target.checked);
    };

    const updatePackageActive = (selectedItem, itemIndex) => {
        const service = packageList.find((item, index) => {
            return index == itemIndex;
        });
        if (!service) return;
        const toggledIsActive = service.is_active ? 0 : 1;
        activatePackageService(service.id, toggledIsActive).then((response) => {
            const arr = packageList.map((item, index) => {
                if (index == itemIndex) {
                    console.log("Service is", item);
                    return {
                        ...item,
                        is_active: toggledIsActive,
                    };
                }
                return item;
            });
            setPackageList(arr);

            console.log(response);
        });
    };

    const deletePackage = (item, selectedIndex) => {
        console.log(item);
        deletePackageService(item.id).then((response) => {
            const updatedArr = [...packageList];
            updatedArr.splice(selectedIndex, 1);
            setPackageList(updatedArr);
        });
    };

    const fetchPackages = () => {
        getPackagesService().then((response) => {
            setPackageList(response.data);
        });
    };
    const addPackageSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();

        fd.append("name_ar", formData.name_ar);
        fd.append("name_en", formData.name_en);
        fd.append("category_id", formData.category_id);
        fd.append("days_count", Number(formData.days_count));
        fd.append("is_active", formData.is_active);
        fd.append("price_per_unit", formData.price_per_unit);

        addPackageService(fd).then((response) => {
            fetchPackages();
            // setPackageList(response.data)
            onCloseModal();
        });
    };

    const openUpdateDialog = (item, index) => {
        setSelectedItemToUpdate(item);
        // setUpdateFormData({
        //   id:item.id,
        //   name_ar: item.name_ar,
        //   name_en: item.name_en,
        //   order: item.order,
        //   is_active:  Number(item.is_active),
        //   image: item.image,
        // });

        setOpenUpdateModal(true);
    };

    const updatePackageSubmit = (e) => {
        e.preventDefault();
        if (!updateFormData) return;
        console.log("updated", updateFormData);
        updatePackageService(updateFormData.id, updateFormData).then(
            (response) => {
                fetchPackages();
                // setPackageList(response.data);
                onCloseUpdateModal();
            }
        );
    };

    const fetchCategories = () => {
        getCategoriesService().then((response) => {
            setCategoryList(response.data);
        });
    };

    useEffect(() => {
        fetchCategories();
        fetchPackages();
    }, []);

    useEffect(() => {
        if (selectedItemToUpdate) {
            setUpdateFormData({
                id: selectedItemToUpdate.id,
                name_ar: selectedItemToUpdate.name_ar,
                name_en: selectedItemToUpdate.name_en,
                category_id: selectedItemToUpdate.category_id,
                is_active: selectedItemToUpdate.is_active,
                price_per_unit: selectedItemToUpdate.price_per_unit,
                order: selectedItemToUpdate.order,
                days_count: selectedItemToUpdate.days_count,
            });

            setOpenUpdateModal(true);
        }
    }, [selectedItemToUpdate]);

    return (
        <>
            <div className="py-20">
                <CustomDataTable
                    selectedPage={(pageNum: number) =>
                        takeSelectedPage(pageNum)
                    }
                    handleAllCheck={takeCheckValue}
                    sendValueToParent={(value) => takeValue(value)}
                    tableHead={headerArr}
                    listItem={packageList}
                    tData={(item, index) => (
                        <>
                            <td className="py-2 px-4">{item.id}</td>

                            <td className="py-2 px-4">{item.name}</td>
                            <td className="py-2 px-4">{item.category}</td>
                            <td className="py-2 px-4">{item.price_per_unit}</td>
                            <td className="py-2 px-4">{item.days_count}</td>

                            <td className="py-2 px-4">
                                <DropDown
                                    handleIsActive={(item) =>
                                        updatePackageActive(item, index)
                                    }
                                    btnName={
                                        item.is_active ? "مفعل" : "غير مفعل"
                                    }
                                    isActive={item.is_active}
                                />
                            </td>
                            <td className="">
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() =>
                                            deletePackage(item, index)
                                        }
                                        className="bg-[#F9285A0A] p-1 rounded-lg"
                                    >
                                        <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            openUpdateDialog(item, index)
                                        }
                                        className="bg-[#0094140D] p-1 rounded-lg"
                                    >
                                        <span className="mdi mdi-folder-edit-outline text-[#009414]"></span>
                                    </button>
                                </div>
                            </td>
                        </>
                    )}
                >
                    <div className="bg-[#0094140D]  text-center rounded-xl ">
                        <BaseDropDown
                            handleFilterList={(item, index) =>
                                filterPackageByState(item)
                            }
                            btnName="الحالة"
                            listItem={statusList}
                        ></BaseDropDown>
                    </div>

                    <div className="bg-[#0094140D]  text-center rounded-xl ">
                        <BaseDropDown
                            handleFilterList={(item, index) =>
                                filterPackageByCategory(item, index)
                            }
                            btnName="نوع الخدمة"
                            listItem={categoryList}
                        ></BaseDropDown>
                    </div>

                    <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                        <button
                            onClick={() => setOpenModal(true)}
                            className="w-full h-full"
                        >
                            اضافة باقة
                        </button>
                    </div>
                </CustomDataTable>

                <Modal show={openModal} size="2xl" onClose={onCloseModal} popup>
                    <ModalHeader />
                    <ModalBody>
                        <form onSubmit={addPackageSubmit}>
                            <div className="space-y-6">
                                <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
                                    اضافة باقة
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
                                        label=" اسم الباقة ( عربي ) **"
                                        placeholder=" اسم الباقه  *"
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
                                        label=" اسم الباقة ( انجليزي ) **"
                                        placeholder=" اسم الباقه  *"
                                    ></TextFieldNada>
                                </div>
                                <div>
                                    <TextFieldNada
                                        name="name"
                                        type="number"
                                        handleChange={(e) =>
                                            takeFormValue(
                                                e,
                                                "formData",
                                                "price_per_unit"
                                            )
                                        }
                                        value={formData.price_per_unit}
                                        label=" سعر الوحدة **"
                                        placeholder=" سعر الوحدة *  *"
                                    ></TextFieldNada>
                                </div>
                                <div>
                                    <TextFieldNada
                                        name="name"
                                        type="number"
                                        handleChange={(e) =>
                                            takeFormValue(
                                                e,
                                                "formData",
                                                "days_count"
                                            )
                                        }
                                        value={Number(formData.days_count)}
                                        label="مدة الباقة*"
                                        placeholder=" مدة الباقه  *"
                                    ></TextFieldNada>
                                </div>

                                <div className="relative p-5 border border-surface-light-700 rounded-2xl">
                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                                        <label htmlFor="package">
                                            نوع الخدمة
                                        </label>
                                    </div>

                                    <select
                                        onChange={(e) =>
                                            takeSelectedCategoryFormData(
                                                e,
                                                "formData"
                                            )
                                        }
                                        value={Number(formData.category_id)}
                                        className="w-full h-full"
                                        id="package"
                                        required
                                    >
                                        {categoryList.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name_ar}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative p-5 border border-surface-light-700 rounded-2xl">
                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                                        <label htmlFor="package">الحالة</label>
                                    </div>

                                    <select
                                        onChange={(e) =>
                                            takeSelectedStateInFormData(e)
                                        }
                                        value={formData.is_active}
                                        className="w-full h-full"
                                        id="package"
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

                <Modal
                    show={openUpdateModal}
                    size="2xl"
                    onClose={onCloseUpdateModal}
                    popup
                >
                    <ModalHeader />
                    <ModalBody>
                        <form onSubmit={updatePackageSubmit}>
                            <div className="space-y-6 ">
                                <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
                                    تعديل الباقة
                                </h3>

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
                                        value={updateFormData.name_ar}
                                        label=" اسم الباقة ( عربي ) *"
                                        placeholder=" اسم الباقة  *"
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
                                        value={updateFormData.name_en}
                                        label=" اسم الباقة ( انجليزي ) *"
                                        placeholder=" اسم الباقة  *"
                                    ></TextFieldNada>
                                </div>

                                <div>
                                    <TextFieldNada
                                        name="name"
                                        type="number"
                                        handleChange={(e) =>
                                            takeFormValue(
                                                e,
                                                "updateFormData",
                                                "price_per_unit"
                                            )
                                        }
                                        value={updateFormData.price_per_unit}
                                        label=" سعر الوحدة **"
                                        placeholder=" سعر الوحدة *  *"
                                    ></TextFieldNada>
                                </div>
                                <div>
                                    <TextFieldNada
                                        name="name"
                                        type="number"
                                        handleChange={(e) =>
                                            takeFormValue(
                                                e,
                                                "updateFormData",
                                                "days_count"
                                            )
                                        }
                                        value={Number(
                                            updateFormData.days_count
                                        )}
                                        label="مدة الباقة*"
                                        placeholder=" مدة الباقه  *"
                                    ></TextFieldNada>
                                </div>

                                <div className="relative p-5 border border-surface-light-700 rounded-2xl">
                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                                        <label htmlFor="package">
                                            نوع الخدمة
                                        </label>
                                    </div>

                                    <select
                                        onChange={(e) =>
                                            takeSelectedCategoryFormData(
                                                e,
                                                "updateFormData"
                                            )
                                        }
                                        value={Number(
                                            updateFormData.category_id
                                        )}
                                        className="w-full h-full"
                                        id="package"
                                        required
                                    >
                                        {categoryList.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name_ar}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative p-5 border border-surface-light-700 rounded-2xl">
                                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                                        <label htmlFor="package">الحالة</label>
                                    </div>

                                    <select
                                        onChange={(e) => takeSelectedState(e)}
                                        value={Number(updateFormData.is_active)}
                                        className="w-full h-full"
                                        id="package"
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
                                    <button
                                        type="submit"
                                        className="bg-[#009414] rounded-xl px-3 py-2 text-white w-full"
                                    >
                                        حفظ
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
