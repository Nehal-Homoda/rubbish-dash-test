"use client";

import React, { useEffect, useState } from "react";
import CustomDataTable from "@/components/data-tables/customDataTable";
import {
  activateCategoryService,
  filterCategoryBySearchService,
  filterCategoryByStateService,
  categoryListByPageService,
  addCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from "@/services/categoriesService";
import DropDown from "@/components/shared/StateDropDown";
import BaseDropDown from "@/components/shared/BaseDropDown";

import { getCategoriesService } from "@/services/categoriesService";
import { Categories } from "@/types/categories.interface";
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

export default function rubbush_collectors() {
  const [categoryList, setCategoryList] = useState<Categories[]>([]);
  const router = useRouter();
  const headerArr = [
    { text: "ID", name: "id" },
    { text: "صورة الخدمة ", name: "name" },
    { text: "اسم الخدمة", name: "phone" },
    { text: " عدد الاشتراكات", name: "subscription_name" },
    { text: "الحالة", name: "subscription_name" },
    { text: "الاجراءات", name: "image" },
  ];

  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedItemToUpdate, setSelectedItemToUpdate] =
    useState<Categories | null>(null);

  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [categoryIsActive, setCategoryIsActive] = useState(false);

  // const [selectedUpdate, setSelectedUpdate] = useState(null);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    image: "",
  });

  const defaultBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";
  const [updateFormData, setUpdateFormData] = useState({
    id: 0,
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    image: defaultBase64Image,
  });

  const onCloseModal = () => {
    setOpenModal(false);

    setFormData({
      name_ar: "",
      name_en: "",
      order: 0,
      is_active: 0,
      image: "",
    });
  };
  const onCloseUpdateModal = () => {
    setOpenUpdateModal(false);

    setUpdateFormData({
      id:0,
      name_ar: "",
      name_en: "",
      order: 0,
      is_active: 0,
      image: "",
    });
  };

  const takeFormValue = (e, formName: string, name: string) => {
    console.log("nn", e.target.value);
    if (formName == "formData") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    } else {
      setUpdateFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
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
  const takeSelectedState = (e) => {
    const value = Number(e.target.value);
    setUpdateFormData((prev) => ({
      ...prev,
      is_active: value,
    }));
  };

  const fetchServiceList = (pageNumber) => {
    categoryListByPageService(pageNumber).then((response) => {
      console.log(response);
      setCategoryList(response.data);
      // setFilteredArr(response.data);
    });
  };

  const filterServiceBySearch = (pageNumber, searchValue) => {
    filterCategoryBySearchService(pageNumber, searchValue).then((response) => {
      setCategoryList(response.data);
    });
  };
  const takeValue = (e) => {
    console.log("sjkdhfu");
    console.log(e);
    filterServiceBySearch(page, e);
  };

  const filterServiceByState = (selectedItem) => {
    console.log(selectedItem.is_active);
    filterCategoryByStateService(page, selectedItem.is_active).then(
      (response) => {
        setCategoryList(response.data);
        console.log("yes im active");
      }
    );
  };

  const takeSelectedPage = (pageNum: number) => {
    console.log(pageNum);
    // setPage(pageNum)

    fetchServiceList(pageNum);
  };

  const takeCheckValue = (e) => {
    console.log("input checked", e.target.checked);
    setCheckBoxValue(e.target.checked);
  };

  const updateServiceActive = (selectedItem, itemIndex) => {
    const service = categoryList.find((item, index) => {
      return index == itemIndex;
    });
    if (!service) return;
    const toggledIsActive = service.is_active && !selectedItem.is_active ? 0 : 1;
    activateCategoryService(service.id, toggledIsActive).then((response) => {
      const arr = categoryList.map((item, index) => {
        if (index == itemIndex) {
          console.log("Service is", item);
          return {
            ...item,
            is_active: toggledIsActive,
          };
        }
        return item;
      });
      setCategoryList(arr);

      console.log(response);
    });
  };

  const deleteCategory = (item, selectedIndex) => {
    console.log(item);
    deleteCategoryService(item.id).then((response) => {
      const updatedArr = [...categoryList];
      updatedArr.splice(selectedIndex, 1);
      setCategoryList(updatedArr);
    });
  };

  const fetchCategories = () => {
    getCategoriesService().then((response) => {
      setCategoryList(response.data);
    });
  };
  const addServiceSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name_ar", formData.name_ar);
    fd.append("name_en", formData.name_en);
    fd.append("order", formData.order);
    fd.append("is_active", formData.is_active);
    fd.append("image", formData.image);
    addCategoryService(fd).then((response) => {
      // setCategoryList(response.data)
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

  const updateServiceSubmit = (e) => {
    e.preventDefault();
    if (!updateFormData) return;
    console.log("updated", updateFormData);
    updateCategoryService(updateFormData.id, updateFormData).then(
      (response) => {
        fetchCategories()
        // setCategoryList(response.data);
        onCloseUpdateModal();
      }
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedItemToUpdate) {
      setUpdateFormData({
        id: selectedItemToUpdate.id,
        name_ar: selectedItemToUpdate.name_ar,
        name_en: selectedItemToUpdate.name_en,
        order: selectedItemToUpdate.order,
        is_active: Number(selectedItemToUpdate.is_active),
        image: selectedItemToUpdate.image,
      });

      setOpenUpdateModal(true);
    }
  }, [selectedItemToUpdate]);

  return (
    <>
      <div className="py-20">
        <CustomDataTable
          selectedPage={(pageNum: number) => takeSelectedPage(pageNum)}
          handleAllCheck={takeCheckValue}
          sendValueToParent={(value) => takeValue(value)}
          tableHead={headerArr}
          listItem={categoryList}
          tData={(item, index) => (
            <>
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4">
                <div className="w-8 h-8 rounded-full">
                  <img
                    className="w-full h-full object-contain"
                    src={item.image}
                    alt=""
                  />
                </div>
              </td>
              <td className="py-2 px-4">{item.name_ar}</td>
              <td className="py-2 px-4">{item.no_of_subscriptions}</td>

              {/* <td className="py-2 px-4">
                <Avatar
                  color="success"
                  placeholderInitials={item.name.slice(0, 2)}
                  rounded
                />
              </td> */}
              <td className="py-2 px-4">
                <DropDown
                  handleIsActive={(item) => updateServiceActive(item, index)}
                  btnName={item.is_active ? "مفعل" : "غير مفعل"}
                  isActive={item.is_active}
                />
              </td>
              <td className="">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => deleteCategory(item, index)}
                    className="bg-[#F9285A0A] p-1 rounded-lg"
                  >
                    <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                  </button>
                  <button
                    onClick={() => openUpdateDialog(item, index)}
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
              handleFilterList={(item, index) => filterServiceByState(item)}
              btnName="الحالة"
              listItem={statusList}
            ></BaseDropDown>
          </div>

          <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
            <button
              onClick={() => setOpenModal(true)}
              className="w-full h-full"
            >
              اضافة خدمة
            </button>
          </div>
        </CustomDataTable>

        <Modal show={openModal} size="md" onClose={onCloseModal} popup>
          <ModalHeader />
          <ModalBody>
            <form onSubmit={addServiceSubmit}>
              <div className="space-y-6">
                <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
                  اضافة خدمة
                </h3>
                <div>
                  <TextFieldNada
                    name="name"
                    type="text"
                    handleChange={(e) =>
                      takeFormValue(e, "formData", "name_ar")
                    }
                    value={formData.name_ar}
                    label=" اسم الخدمة ( عربي ) *"
                    placeholder=" اسم الخدمة  *"
                  ></TextFieldNada>
                </div>
                <div>
                  <TextFieldNada
                    name="name"
                    type="text"
                    handleChange={(e) =>
                      takeFormValue(e, "formData", "name_en")
                    }
                    value={formData.name_en}
                    label=" اسم الخدمة ( انجليزي ) *"
                    placeholder=" اسم الخدمة  *"
                  ></TextFieldNada>
                </div>

                <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                  <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                    <label htmlFor="category">الحالة</label>
                  </div>

                  <select
                    onChange={(e) => takeSelectedStateInFormData(e)}
                    value={formData.is_active}
                    className="w-full h-full"
                    id="category"
                    required
                  >
                    {statusList.map((item, index) => (
                      <option key={index} value={item.is_active}>
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
          size="md"
          onClose={onCloseUpdateModal}
          popup
        >
          <ModalHeader />
          <ModalBody>
            <form onSubmit={updateServiceSubmit}>
              <div className="space-y-6">
                <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
                  تعديل خدمة
                </h3>
                <div className="mx-auto text-center">
                  <FileInput
                    fileUrl={updateFormData.image}
                    state="edit"
                    onFileChange={(file) => {
                      console.log("Received base64 in parent:", file);
                      setUpdateFormData((prev) => ({ ...prev, image: file }));
                    }}
                  />
                </div>
                <div>
                  <TextFieldNada
                    name="name"
                    type="text"
                    handleChange={(e) =>
                      takeFormValue(e, "updateFormData", "name_ar")
                    }
                    value={updateFormData.name_ar}
                    label=" اسم الخدمة ( عربي ) *"
                    placeholder=" اسم الخدمة  *"
                  ></TextFieldNada>
                </div>
                <div>
                  <TextFieldNada
                    name="name"
                    type="text"
                    handleChange={(e) =>
                      takeFormValue(e, "updateFormData", "name_en")
                    }
                    value={updateFormData.name_en}
                    label=" اسم الخدمة ( انجليزي ) *"
                    placeholder=" اسم الخدمة  *"
                  ></TextFieldNada>
                </div>

                <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                  <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                    <label htmlFor="category">الحالة</label>
                  </div>

                  <select
                    onChange={(e) => takeSelectedState(e)}
                    value={Number(updateFormData.is_active)}
                    className="w-full h-full"
                    id="category"
                    required
                  >
                    {statusList.map((item, index) => (
                      <option key={index} value={item.is_active}>
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
