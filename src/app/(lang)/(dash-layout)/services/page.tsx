"use client";
import React, { useEffect, useState } from "react";
import { District } from "@/types/district.interface";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";

import {
  addCategoryService,
  deleteCategoryService,
  getCategoriesService,
  updateCategoryService,
} from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";
import FileInput from "@/components/ui/form/FileInput";
import FileInputImg from "@/components/ui/form/FileInputImg";
import { useRouter } from "next/navigation";
import { ToggleSwitch } from "flowbite-react";

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Category[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " صورة الخدمة", name: "image" },
    { text: " اسم الخدمة", name: "name_ar" },
    { text: " عدد الاشتراكات", name: "no_of_subscriptions" },
    { text: "اعادة تدوير", name: "has_recycle" },
    { text: "الحالة", name: "is_active" },
    { text: "الاجراءات", name: "image" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<Category | null>(
    null
  );

  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const router = useRouter();

  const [isRecycled, setIsRecycled] = useState(false)

  const [switch1, setSwitch1] = useState(false);

  const handleCheckSubscription = (value: boolean, name: string) => {

    setSwitch1(!switch1);
    if (name == 'add') {
      setFormData((prev) => ({
        ...prev,
        ["has_recycle"]: value ? 1 : 0,
      }));
    }


    if (name == 'edit') {
      setUpdateFormData((prev) => ({
        ...prev,
        ["has_recycle"]: value ? 1 : 0,
      }));
    }

  };

  type FormDataType = {
    name_ar: string;
    name_en: string;
    order: number;
    is_active: number;
    image: File | null | string;
    has_recycle: number;
    discount_value_percentage: number;
  };
  const [formData, setFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    image: null,
    has_recycle: 0,
    discount_value_percentage: 0,
  });

  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    image: null,
    has_recycle: 0,
    discount_value_percentage: 0,
  });

  const discountList = [
    { id: 1, discount: "5-10" },
    { id: 2, discount: "10-15" },
    { id: 3, discount: "20-25" },
  ];

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

    const query = `?page=${pageNum}${hasSearch}${isActive}`;

    getCategoriesService(query)
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
    setPage(1);
    fetchDataList({ search: val, pageNum: 1 });
  };

  const handleActiveFilter = (value: boolean | undefined) => {
    setPage(1)
    setActiveFilter(value)
    setPage(1);
    fetchDataList({ is_active: value, pageNum: 1 });


  }

  const updateDataItemActive = (value: any, index: number) => {
    const service = dataList.find((item, i) => {
      return index == i;
    });

    if (!service) return;

    const body = JSON.stringify({
      is_active: value,
    });

    updateCategoryService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].is_active = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => { });
  };

  const deleteSubmit = (item: Category, selectedIndex: number) => {
    deleteCategoryService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => { });
  };

  const updateDataItem = (item: Category) => {
    setSelectedDataItem(item);
    setUpdateFormData({
      name_ar: item.name_ar,
      name_en: item.name_en,
      order: item.order,
      is_active: item.is_active ? 1 : 0,
      image: item.image,
      has_recycle: item.has_recycle,
      discount_value_percentage: Number(item.discount_value_percentage),
    });
  };

  const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDataItem) return;

    const body = JSON.stringify({
      ...updateFormData,
    });

    updateCategoryService(selectedDataItem.id, body)
      .then((response) => {
        fetchDataList();
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
    fd.append("name_ar", formData.name_ar);
    fd.append("name_en", formData.name_en);
    fd.append("order", formData.order.toString());
    fd.append("is_active", formData.is_active.toString());
    fd.append("has_recycle", formData.has_recycle.toString())
    if (formData.image) {
      fd.append("image", formData.image);
    }
    if (formData.discount_value_percentage) {
      fd.append("discount_value_percentage", formData.discount_value_percentage.toString());
    }

    addCategoryService(fd)
      .then((response) => {
        fetchDataList();
        //@ts-ignore
        successDialog(true);
        setFormData({
          name_ar: "",
          name_en: "",
          order: 0,
          is_active: 0,
          image: null,
          has_recycle: 0,
          discount_value_percentage: 0,
        });
      })
      .catch((error) => { });
  };

  const resetForm = () => {
    setFormData({
      image: "",
      is_active: 0,
      name_ar: "",
      name_en: "",
      order: 0,
      has_recycle: 0,
      discount_value_percentage: 0,
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
          //   fetchDataList({ is_active: value });
          // }}
          onSelected={handleActiveFilter}
        >
          الحالة
        </UIPrimaryDropdown>
        <UIBaseDialog
          confirmCloseHandler={resetForm}
          title="اضافة خدمة"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button className="bg-[#0094140D] p-1 rounded-lg">
                اضافة خدمة
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
                name="name_ar"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_ar}
                label=" اسم الخدمة ( عربي ) "
                placeholder=" اسم الخدمة  "
              ></TextFieldNada>

              <TextFieldNada
                name="name_en"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_en}
                label=" اسم الخدمة ( انجليزي ) "
                placeholder=" اسم الخدمة  "
              ></TextFieldNada>

              <SelectInput
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

              <div className="py-6 ">
                <ToggleSwitch
                  checked={switch1}
                  label="اعادة تدوير"
                  onChange={(value) => handleCheckSubscription(value, 'add')}
                />
              </div>

              {switch1 && (
                // <SelectInput
                //   placeholder="اختر نسبة الخصم"
                //   onChange={(value) =>
                //     setFormData((prev) => ({
                //       ...prev,
                //       ["discount_rate_id"]: value,
                //     }))
                //   }
                //   value={formData.discount_rate_id}
                //   name="discount"
                //   items={discountList}
                //   itemName="discount"
                //   itemValue="id"
                //   label="نسبة الخصم"
                //   prependIcon="mdi mdi-ticket-percent-outline"
                // ></SelectInput>
                <TextFieldNada prependIcon="mdi mdi-ticket-percent-outline text-gray-400 " handleChange={addFormChangeHander} name="discount_value_percentage" label="نسبة الخصم" placeholder="ادخل نسبة الخصم" type="number" value={formData.discount_value_percentage} />
              )}
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
                <div className="w-[100px] aspect-[3/1.5] bg-gray-50 rounded-md">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </td>
              <td className="py-2 px-4">{item.name_ar}</td>
              <td className="py-2 px-4">{item.no_of_subscriptions}</td>


              <td className="py-2 px-4">
                {item.has_recycle ?

                  <div className="bg-[#009414] text-white rounded-full w-7 h-7 overflow-hidden flex justify-center items-center">
                    <span className="mdi mdi-check"></span>
                  </div>

                  :
                  <div className="bg-[#F9285A] text-white rounded-full w-7 h-7 overflow-hidden flex justify-center items-center">
                    <span className="mdi mdi-close"></span>
                  </div>
                }
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
                <div className="flex  gap-3">
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
                  <UIBaseDialog
                    title="تعديل خدمة"
                    confirmHandler={() => { }}
                    confirmText="تعديل"
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
                        <div className="w-full flex justify-center mb-20">
                          <FileInputImg
                            state="edit"
                            fileUrl={item.image}
                            onFileChange={(arg) => {
                              setUpdateFormData((prev) => ({
                                ...prev,
                                ["image"]: arg?.file64 ?? null,
                              }));
                            }}
                          ></FileInputImg>
                        </div>

                        <TextFieldNada
                          name="name_ar"
                          type="text"
                          handleChange={updateFormChangeHander}
                          value={updateFormData.name_ar}
                          label=" اسم الخدمة ( عربي ) "
                          placeholder=" اسم الخدمة  "
                        ></TextFieldNada>

                        <TextFieldNada
                          name="name_en"
                          type="text"
                          handleChange={updateFormChangeHander}
                          value={updateFormData.name_en}
                          label=" اسم الخدمة ( انجليزي ) "
                          placeholder=" اسم الخدمة  "
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
                              ["is_active"]: value,
                            }));
                          }}
                        ></SelectInput>

                        <div className="py-6 ">
                          <ToggleSwitch
                            checked={item.has_recycle == 1 ? true : false}
                            label="اعادة تدوير"
                            onChange={(value) => handleCheckSubscription(value, 'edit')}
                          />
                        </div>

                        {item.has_recycle && (
                          // <SelectInput
                          //   placeholder="اختر نسبة الخصم"
                          //   onChange={(value) =>
                          //     setUpdateFormData((prev) => ({
                          //       ...prev,
                          //       ["discount_rate_id"]: value,
                          //     }))
                          //   }
                          //   value={updateFormData.discount_rate_id}
                          //   name="discount"
                          //   items={discountList}
                          //   itemName="discount"
                          //   itemValue="id"
                          //   label="نسبة الخصم"
                          //   prependIcon="mdi mdi-ticket-percent-outline"
                          // ></SelectInput>


                          <TextFieldNada prependIcon="mdi mdi-ticket-percent-outline text-gray-400 " handleChange={updateFormChangeHander} name="discount_value_percentage" label="نسبة الخصم" placeholder="ادخل نسبة الخصم" type="number" value={updateFormData.discount_value_percentage} />
                        )}
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
