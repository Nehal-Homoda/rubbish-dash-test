"use client";
import React, { useEffect, useState } from "react";
// import { Checkbox, Label } from "flowbite-react";
// import { Radio } from "flowbite-react";
import {
  addDistrictService,
  deleteDistrictService,
  updateDistrictService,
} from "@/services/districtService";

import { getDistrictService } from "@/services/districtService";
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
// import { Collector } from "@/types/regions.interface";
import { Collector } from "@/types/collectors.interface";
import * as Yup from "yup";

interface FormDataInputs {
  name_ar: string;
  name_en: string;
  available_days: string[] | string;
  available_times: string[] | string;
}
interface FormDataInputErrors {
  name_ar: string | null;
  name_en: string | null;
  available_days: string;
  available_times: string;
}
type FormDataType = {
  name_ar: string;
  name_en: string;
  order: number;
  is_active: number;
  collector_id: string[];
  available_days: string[];
  available_times: string[];
};

type FromToTimeType = {
  from: string;
  to: string;
};

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<District[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم المنطقة", name: "name_ar" },
    { text: " عدد الاشتراكات", name: "no_of_subscriptions" },
    { text: "الحالة", name: "is_active" },
    { text: "الاجراءات", name: "procedures" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];
  const districts = [
    { id: 1, name: "حي اول" },
    { id: 2, name: "حي ثان" },
    { id: 3, name: "حي ثالث" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [districtDays, setDistrictDays] = useState([
    "friday",
    "tuesday",
    "thursday",
    "wednesday",
    "monday",
    "saturday",
    "sunday",
  ]);
  const [dynamicFromToTime, setDynamicFromToTime] = useState<FromToTimeType[]>([
    { from: "", to: "" },
  ]);
  const [dynamicFromToTimeUpdate, setDynamicFromToTimeUpdate] = useState<
    FromToTimeType[]
  >([]);

  const [districtTime, setDistrictTime] = useState<string[]>([]);
  const [selectedDataItem, setSelectedDataItem] = useState<District | null>(
    null,
  );

  const [collectors, setCollectors] = useState<Collector[]>([]);

  const [timefrom, setTimefrom] = useState("");
  const [timeto, setTimeto] = useState("");

  const formSchema = Yup.object().shape({
    name_ar: Yup.string().required(),
    name_en: Yup.string().required(),
    available_days: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one day")
      .required("Available days are required"),
    available_times: Yup.array().required("available times are required"),
  });

  const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
    name_ar: "",
    name_en: "",
    available_days: "",
    available_times: "",
  });
  const [updateFormErrors, setUpdateFormErrors] = useState<FormDataInputErrors>(
    {
      name_ar: "",
      name_en: "",
      available_days: "",
      available_times: "",
    },
  );
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    collector_id: [],
    available_days: [],
    available_times: [],
  });

  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    collector_id: [],
    available_days: [],
    available_times: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addDynamicTime = () => {
    setDynamicFromToTime((prev) => {
      const ar = [...prev];
      ar.forEach((item, index) => {
        if (!item.from || !item.to) {
          return;
        }
        ar.push({ from: "", to: "" });
      });

      return [...ar];
    });
  };
  const removeDynamicTime = (index: number) => {
    setDynamicFromToTime((prev) => {
      const ar = [...prev];
      ar.splice(index, 1);

      return [...ar];
    });
  };
  const addDynamicTimeUpdate = () => {
    setDynamicFromToTimeUpdate((prev) => {
      const ar = [...prev];
      ar.push({ from: "", to: "" });

      return [...ar];
    });
  };
  const removeDynamicTimeUpdate = (index: number) => {
    if (index == 0) return;

    setDynamicFromToTimeUpdate((prev) => {
      const ar = [...prev];
      ar.splice(index, 1);

      return [...ar];
    });
  };
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

    getDistrictService(query)
      .then((response) => {
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
        response.data.map((item) => {
          setDistrictTime(item.available_times);
        });
      })
      .catch(() => {});
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

    updateDistrictService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].is_active = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => {});
  };

  const deleteSubmit = (item: District, selectedIndex: number) => {
    deleteDistrictService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => {});
  };

  const updateDataItem = (item: District) => {
    setSelectedDataItem(item);
    setDynamicFromToTimeUpdate([]);
    setUpdateFormData({
      name_ar: item.name_ar,
      name_en: item.name_en,
      order: item.order,
      collector_id: item.collector.map((item) => item.id.toString()),
      is_active: item.is_active ? 1 : 0,
      available_days: item.available_days,
      available_times: item.available_times,
    });

    const ar = item.available_times.map((item) => {
      const x = item.split("-");

      return { from: x[0], to: x[1] };
    });

    setDynamicFromToTimeUpdate((prev) => {
      const stored = [...prev];

      return [...stored, ...ar];
    });
  };

  const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDataItem) return;
    const validateResult = await validateAllInputs<FormDataInputs>(
      formSchema,
      updateFormData,
    );
    console.log("validate", validateResult);
    if (!validateResult) return;
    setUpdateFormErrors({ ...validateResult.outputResult });
    console.log("form error", formErrors);
    if (validateResult.isInvalid) return;

    const body = JSON.stringify({
      ...updateFormData,
    });
    console.log("update form", updateFormData);
    setIsDialogOpen(false);

    updateDistrictService(selectedDataItem.id, body)
      .then((response) => {
        fetchDataList();
        successDialog(true);
        setIsDialogOpen(true);
      })
      .catch((error) => {
        setErrorMsg(error?.message);
        setIsDialogOpen(false);
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
    setIsDialogOpen(false);
    const validateResult = await validateAllInputs<FormDataInputs>(
      formSchema,
      formData,
    );
    console.log("validate", validateResult);
    if (!validateResult) return;
    setFormErrors({ ...validateResult.outputResult });
    console.log("form error", formErrors);
    if (validateResult.isInvalid) return;

    const fd = new FormData();
    fd.append("name_ar", formData.name_ar);
    fd.append("name_en", formData.name_en);
    fd.append("order", formData.order.toString());
    formData.available_days.forEach((day, index) =>
      fd.append(`available_days[${index}]`, day),
    );
    formData.available_times.forEach((time, index) =>
      fd.append(`available_times[${index}]`, time),
    );
    fd.append("is_active", formData.is_active.toString());

    addDistrictService(fd)
      .then((response) => {
        fetchDataList();
        setIsDialogOpen(true);
        //@ts-ignore
        successDialog(true);
        setFormData({
          name_ar: "",
          name_en: "",
          order: 0,
          is_active: 0,
          collector_id: [],
          available_days: [],
          available_times: [],
        });
        setDynamicFromToTime([{ from: "", to: "" }]);
      })
      .catch((error) => {
        setErrorMsg(error?.message);
        setIsDialogOpen(false);
        console.log("error message is", errorMsg);
      });
  };

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIBaseDialog
          dismiss={isDialogOpen}
          confirmCloseHandler={resetForm}
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
          <form onSubmit={createSubmit} id="update-form">
            {/* {errorMsg && (
                            <div className="mb-5">
                                <span className="text-red-800">
                                    {" "}
                                    {errorMsg}
                                </span>
                            </div>
                        )} */}

            <div className="space-y-7">
              <TextFieldNada
                errorMessage={formErrors.name_ar || ""}
                name="name_ar"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_ar}
                label=" اسم المنطقة ( عربي ) "
                placeholder=" اسم المنطقة  "
                required
              ></TextFieldNada>

              <TextFieldNada
                errorMessage={formErrors.name_en || ""}
                name="name_en"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_en}
                label=" اسم المنطقة ( انجليزي ) "
                placeholder=" اسم المنطقة  "
              ></TextFieldNada>

              <SelectInput
                value={formData.is_active}
                items={districts}
                itemName="name"
                itemValue="id"
                label="الحي"
                placeholder="اختر الحي"
                name="is_active"
                required={true}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    ["is_active"]: value,
                  }));
                }}
              ></SelectInput>

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

              <MultiCheckbox
                items={collectors}
                itemName="name"
                itemValue="id"
                value={formData.collector_id}
                label="جامع القمامة"
                required={true}
                name="collector_id"
                placeholder="اختر جامع القمامة"
                // prependIcon="mdi mdi-calendar-month-outline"
                iconType="mdi"
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    ["collector_id"]: value,
                  }));
                }}
              ></MultiCheckbox>

              <MultiCheckbox
                errorMessage={formErrors.available_days}
                items={districtDays}
                value={formData.available_days}
                label="اليوم"
                required={true}
                name="available_days"
                placeholder="اختر اليوم"
                prependIcon="mdi mdi-calendar-month-outline"
                iconType="mdi"
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    ["available_days"]: value,
                  }));
                }}
              ></MultiCheckbox>

              {dynamicFromToTime.map((item, index) => (
                <div
                  key={index}
                  className="time_from_to grid grid-cols-11 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <TextFieldNada
                      errorMessage={formErrors.available_times}
                      name="available_times"
                      type="time"
                      handleChange={
                        (e) => {
                          setDynamicFromToTime((prev) => {
                            const ar = [...prev];

                            ar[index].from = e.target.value;

                            return ar;
                          });
                        }
                        // takeValue(e, "time_to")
                      }
                      value={dynamicFromToTime[index].from}
                      label="من "
                      placeholder=""
                    ></TextFieldNada>
                  </div>
                  <div className="col-span-5">
                    <TextFieldNada
                      errorMessage={formErrors.available_times}
                      name="available_times"
                      type="time"
                      handleChange={
                        (e) => {
                          setDynamicFromToTime((prev) => {
                            const ar = [...prev];

                            ar[index].to = e.target.value;

                            return ar;
                          });
                        }
                        // takeValue(e, "time_to")
                      }
                      value={dynamicFromToTime[index].to}
                      label="الي "
                      placeholder=" "
                    ></TextFieldNada>
                  </div>
                  <div className="col-span-1">
                    {index > 0 ? (
                      <button
                        type="button"
                        className="w-10 h-10 rounded-md bg-red-500 text-white"
                        onClick={() => {
                          removeDynamicTime(index);
                        }}
                      >
                        <span className="mdi mdi-minus"></span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addDynamicTime();
                        }}
                        type="button"
                        className="w-10 h-10 rounded-md bg-surface text-white"
                      >
                        <span className="mdi mdi-plus"></span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </form>
        </UIBaseDialog>
      </>
    );
  };

  const fetchCollectors = () => {
    getCollectorsService().then((response) => {
      // console.log('collectors are', response)
      setCollectors(response.data);
    });
  };

  useEffect(() => {
    fetchDataList();
    fetchCollectors();
  }, [page]); // runs every time `page` changes

  useEffect(() => {
    console.log(dynamicFromToTime);
    const ar = dynamicFromToTime.map((item) => `${item.from}-${item.to}`);
    setFormData((prev) => ({
      ...prev,
      ["available_times"]: ar,
    }));
  }, [dynamicFromToTime]);
  useEffect(() => {
    const ar = dynamicFromToTimeUpdate.map((item) => `${item.from}-${item.to}`);
    setUpdateFormData((prev) => ({
      ...prev,
      ["available_times"]: ar,
    }));
  }, [dynamicFromToTimeUpdate]);

  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      order: 0,
      is_active: 0,
      collector_id: [],
      available_days: [],
      available_times: [],
    });
  };
  return (
    <>
      <div className="py-20">
        <BaseDataTable
          headItems={headerArr}
          items={dataList}
          onPageChange={setPage}
          totalPages={totalPages}
          onSearchChange={tableSearchHandler}
          headerActionsSlot={tableHeadActionsSlot()} // Add your "Add District" dialog button
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

                <UIBaseDialog
                  dismiss={isDialogOpen}
                  title="تعديل منطقه"
                  confirmHandler={() => {}}
                  confirmText="حفظ"
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
                  <form onSubmit={updateSubmit} id="update-form">
                    <div className="space-y-7">
                      <TextFieldNada
                        name="name_ar"
                        type="text"
                        handleChange={updateFormChangeHander}
                        value={updateFormData.name_ar}
                        label=" اسم المنطقة ( عربي ) "
                        placeholder=" اسم المنطقة  "
                        errorMessage={updateFormErrors.name_ar || ""}
                      ></TextFieldNada>

                      <TextFieldNada
                        name="name_en"
                        type="text"
                        handleChange={updateFormChangeHander}
                        value={updateFormData.name_en}
                        label=" اسم المنطقة ( انجليزي ) "
                        placeholder=" اسم المنطقة  "
                        errorMessage={updateFormErrors.name_en || ""}
                      ></TextFieldNada>

                      {/* <SelectInput
                                                    value={
                                                        updateFormData.collector_id
                                                    }
                                                    items={collectors}
                                                    itemName="name"
                                                    itemValue="id"
                                                    label="جامع القمامة"
                                                    placeholder="اختر جامع القمامة"
                                                    name="collector_id"
                                                    required={true}
                                                    onChange={(value) => {
                                                        setUpdateFormData(
                                                            (prev) => ({
                                                                ...prev,
                                                                ["collector_id"]:
                                                                    value,
                                                            })
                                                        );
                                                    }}
                                                ></SelectInput> */}

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
                            ["is_active"]: value,
                          }));
                        }}
                      ></SelectInput>

                      <MultiCheckbox
                        items={collectors}
                        itemName="name"
                        itemValue="id"
                        value={updateFormData.collector_id}
                        label="جامع القمامة"
                        required={true}
                        name="collector_id"
                        placeholder="اختر جامع القمامة"
                        // prependIcon="mdi mdi-calendar-month-outline"
                        iconType="mdi"
                        onChange={(value) => {
                          setUpdateFormData((prev) => ({
                            ...prev,
                            ["collector_id"]: value,
                          }));
                        }}
                      ></MultiCheckbox>
                      <MultiCheckbox
                        errorMessage={updateFormErrors.available_days || ""}
                        items={districtDays}
                        value={updateFormData.available_days}
                        label="اليوم"
                        required={true}
                        name="available_days"
                        placeholder="اختر اليوم"
                        prependIcon="mdi mdi-calendar-month-outline"
                        iconType="mdi"
                        onChange={(value) => {
                          setUpdateFormData((prev) => ({
                            ...prev,
                            ["available_days"]: value,
                          }));
                        }}
                      ></MultiCheckbox>

                      {dynamicFromToTimeUpdate.map((item, index) => (
                        <div
                          key={index}
                          className="time_from_to grid grid-cols-11 gap-2 items-center"
                        >
                          <div className="col-span-5">
                            <TextFieldNada
                              name="price"
                              type="time"
                              handleChange={
                                (e) => {
                                  setDynamicFromToTimeUpdate((prev) => {
                                    const ar = [...prev];

                                    ar[index].from = e.target.value;

                                    return ar;
                                  });
                                }
                                // takeValue(e, "time_to")
                              }
                              value={dynamicFromToTimeUpdate[index].from}
                              label="من "
                              placeholder="  السعر الكلي *"
                            ></TextFieldNada>
                          </div>
                          <div className="col-span-5">
                            <TextFieldNada
                              errorMessage={
                                updateFormErrors.available_times || ""
                              }
                              name="price"
                              type="time"
                              handleChange={
                                (e) => {
                                  setDynamicFromToTimeUpdate((prev) => {
                                    const ar = [...prev];

                                    ar[index].to = e.target.value;

                                    return ar;
                                  });
                                }
                                // takeValue(e, "time_to")
                              }
                              value={dynamicFromToTimeUpdate[index].to}
                              label="الي "
                              placeholder="الوقت"
                            ></TextFieldNada>
                          </div>
                          <div className="col-span-1">
                            {index > 0 ? (
                              <button
                                type="button"
                                className="w-10 h-10 rounded-md bg-red-500 text-white"
                                onClick={() => {
                                  removeDynamicTimeUpdate(index);
                                }}
                              >
                                <span className="mdi mdi-minus"></span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  addDynamicTimeUpdate();
                                }}
                                type="button"
                                className="w-10 h-10 rounded-md bg-surface text-white"
                              >
                                <span className="mdi mdi-plus"></span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </form>
                </UIBaseDialog>
              </div>
            ),
          }}
        ></BaseDataTable>
      </div>
    </>
  );
}
