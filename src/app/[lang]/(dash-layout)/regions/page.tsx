"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, Label } from "flowbite-react";
import { Radio } from "flowbite-react";
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
  const [selectedDistrictDays, setSelectedDistrictDays] = useState<string[]>(
    []
  );

  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [districtIsActive, setDistrictIsActive] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [selectedItemToUpdate, setSelectedItemToUpdate] =
    useState<District | null>(null);
  const router = useRouter();
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
      response.data.map((item, index) => {
        setDistrictDays(item.available_days);
        setDistrictTime(item.available_times);
      });
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

  const takeFormValue = (e, formName: string, name: string) => {
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

  const takeSelectedState = (e, formName: string) => {
    const value = Number(e.target.value);
    if (formName == "formData") {
      setFormData((prev) => ({
        ...prev,
        is_active: value,
      }));
    } else {
      setUpdateFormData((prev) => ({
        ...prev,
        is_active: value,
      }));
    }
  };

  const addDistrictSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("hiiii");
    e.preventDefault();
    const fd = new FormData();
    fd.append("name_ar", formData.name_ar);
    fd.append("name_en", formData.name_en);
    fd.append("order", formData.order);
    formData.available_days.forEach(day => fd.append("available_days[]", day));
    formData.available_times.forEach(time=>fd.append("available_times[]", time)) 
    fd.append("is_active", formData.is_active);
    addDistrictService(fd).then((response) => {
      // setDistrictList(response.data)
      fetchDistrictList();
      onCloseModal();
    });
  };

  const handleSelectedDays = (e, selectedIndex) => {
    console.log(e.target.value)
    const selectedItem = districtDays.find((item, index) => {
      return index == selectedIndex;
    });
    console.log(selectedItem)
    if (e.target.checked && selectedItem) {
        const daysToAdd = selectedItem.split(',').map(day => day.trim());
      setSelectedDistrictDays((prev) => [...prev, ...daysToAdd]);
      setFormData((prev) => ({
        ...prev,
        available_days: [...prev.available_days, ...daysToAdd],
      }));
    } else {
      setSelectedDistrictDays((prev) =>
        prev.filter((item) => item !== selectedItem)
      );
    }
    console.log(formData);
  };

  const handleSelectedTime = (e, item) => {
    // setDistrictTime(item)
    setFormData((prev) => ({ ...prev, available_times: [...prev.available_times,item] }));
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

        {/* <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
          <button onClick={() => setOpenModal(true)} className="w-full h-full">
            اضافة منطقة
          </button>
        </div> */}

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
          <form onSubmit={addDistrictSubmit} id="update-form">
            <div className="space-y-6">
              <div>
                <TextFieldNada
                  name="name"
                  type="text"
                  handleChange={(e) => takeFormValue(e, "formData", "name_ar")}
                  value={formData.name_ar}
                  label=" اسم المنطقة ( عربي ) *"
                  placeholder=" اسم المنطقة  *"
                ></TextFieldNada>
              </div>
              <div>
                <TextFieldNada
                  name="name"
                  type="text"
                  handleChange={(e) => takeFormValue(e, "formData", "name_en")}
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
                  onChange={(e) => takeSelectedState(e, "formData")}
                  value={formData.is_active}
                  className="w-full h-full"
                  id="district"
                  required
                >
                  {statusList.map((item, index) => (
                    <option key={index} value={item.is_active}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex max-w-md flex-col gap-4" id="checkbox">
                  {districtDays.map((item, index) => (
                    <>
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox
                          value={formData.available_days}
                          onChange={(e) => handleSelectedDays(e, index)}
                          id="accept"
                        />
                        <Label htmlFor="accept" className="flex">
                          {item}
                        </Label>
                      </div>
                    </>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex max-w-md flex-col gap-4">
                  {districtTime.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Radio
                        onChange={(e) => handleSelectedTime(e, item)}
                        id={item}
                        name={item}
                        value={formData.available_times}
                      />
                      <Label htmlFor={item}>{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </UIBaseDialog>
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
          headerActionsSlot={tableHeadActionsSlot()}
        >
          {districtList.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4">{item.id}</td>

              <td className="py-2 px-4">{item.name_ar}</td>
              <td className="py-2 px-4">{item.no_of_subscriptions}</td>
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
                    onClick={() => deleteDistrict(item, index)}
                    className="bg-[#F9285A0A] p-1 rounded-lg"
                  >
                    <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                  </button>
                  <UIBaseDialog
                    title="تعديل منطقه"
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
                    <form onSubmit={updateDistrictSubmit} id="update-form">
                      <div className="space-y-6">
                        {/* <div className="mx-auto text-center">
                          <FileInput
                            fileUrl={updateFormData.image}
                            state="edit"
                            onFileChange={(file) => {
                              console.log("Received base64 in parent:", file);
                              setUpdateFormData((prev) => ({
                                ...prev,
                                image: file,
                              }));
                            }}
                          />
                        </div> */}
                        <div>
                          <TextFieldNada
                            name="name"
                            type="text"
                            handleChange={(e) =>
                              takeFormValue(e, "updateFormData", "name_ar")
                            }
                            value={updateFormData.name_ar}
                            label=" اسم المنطقة ( عربي ) *"
                            placeholder=" اسم المنطقه  *"
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
                            label=" اسم المنطقة ( انجليزي ) *"
                            placeholder=" اسم المنطقه  *"
                          ></TextFieldNada>
                        </div>

                        <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                          <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                            <label htmlFor="district">الحالة</label>
                          </div>

                          <select
                            onChange={(e) =>
                              takeSelectedState(e, "updateFormData")
                            }
                            value={Number(updateFormData.is_active)}
                            className="w-full h-full"
                            id="district"
                            required
                          >
                            {statusList.map((item, index) => (
                              <option key={index} value={item.is_active}>
                                {item.name}
                              </option>
                            ))}
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

        {/* <Modal show={openModal} size="md" onClose={onCloseModal} popup>
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
                      takeFormValue(e, "formData", "name_ar")
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
                      takeFormValue(e, "formData", "name_en")
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
                    onChange={(e) => takeSelectedStateInFormData(e)}
                    value={formData.is_active}
                    className="w-full h-full"
                    id="district"
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
        </Modal> */}
      </div>
    </>
  );
}
