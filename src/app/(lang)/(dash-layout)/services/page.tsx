"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog, validateAllInputs } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import * as Yup from "yup";
import {
  addCategoryService,
  deleteCategoryService,
  getCategoriesService,
  updateCategoryService,
} from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";
import FileInputImg from "@/components/ui/form/FileInputImg";
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
    { text: "الاجراءات", name: "procedures" },
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
  const [switch1, setSwitch1] = useState(false);
  const [addressSwicth, setAddressSwicth] = useState(false)
  type FormDataType = {
    name_ar: string;
    name_en: string;
    order: number;
    is_active: number;
    image: File | null | string;
    has_recycle: number | null;
    has_detailed_address: number;
    discount_value_percentage: number | string;
  };
  interface FormDataInputErrors {
    name_ar: string | null,
    name_en: string | null,

  }
  const [formData, setFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    image: null,
    has_recycle: 0,
    has_detailed_address: 0,
    discount_value_percentage: switch1 ? 0 : '',
  });
  const formSchema = Yup.object().shape({
    name_ar: Yup.string().required('الاسم باللغه العربيه مطلوب'),
    name_en: Yup.string().required('الاسم باللغه الانجليزيه مطلوب'),
  })
  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    image: null,
    has_recycle: 0,
    has_detailed_address: 0,
    discount_value_percentage: 0,
  });
  const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
    name_ar: "",
    name_en: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)


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
        ["has_recycle"]: value ? 1 : null,
      }));
    }

  };
  const handleCheckDetails = (value: boolean, name: string) => {
    setAddressSwicth(!addressSwicth)
    if (name == 'add') {
      setFormData((prev) => ({
        ...prev,
        ["has_detailed_address"]: value ? 1 : 0,
      }));
    }


    if (name == 'edit') {
      setUpdateFormData((prev) => ({
        ...prev,
        ["has_detailed_address"]: value ? 1 : 0,
      }));
    }

  };

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
        : '';
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}`;

    getCategoriesService(query)
      .then((response) => {
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch((error) => {

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
    // setActiveFilter(value)
    // setPage(1);
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
      image: null,
      has_recycle: item.has_recycle,
      has_detailed_address: item.has_detailed_address,
      discount_value_percentage: item.has_recycle ? Number(item.discount_value_percentage) : 0,
    });
  };

  const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('')
    const validateResult = await validateAllInputs<FormDataType>(
      formSchema,
      updateFormData
    );
    if (!validateResult) return;

    setFormErrors({ ...validateResult.outputResult });

    if (validateResult.isInvalid) return;
    if (!selectedDataItem) return;
    const body = JSON.stringify({
      ...updateFormData,
    });
    updateCategoryService(selectedDataItem.id, body)
      .then((response) => {
        setIsUpdateDialogOpen(false)
        fetchDataList();
        successDialog(true);
      })
      .catch((error) => {
        setIsUpdateDialogOpen(false)
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
  const createSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('')
    const validateResult = await validateAllInputs<FormDataType>(
      formSchema,
      formData
    );
    if (!validateResult) return;

    setFormErrors({ ...validateResult.outputResult });
    if (validateResult.isInvalid) return;

    setIsDialogOpen(false)

    const fd = new FormData();
    fd.append("name_ar", formData.name_ar);
    fd.append("name_en", formData.name_en);
    fd.append("order", formData.order.toString());
    fd.append("is_active", formData.is_active.toString());
    fd.append("has_recycle", formData.has_recycle!.toString())
    fd.append("has_detailed_address", formData.has_detailed_address.toString())
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
          has_detailed_address: 0,
          discount_value_percentage: 0,
        });
      })
      .catch((error) => {
        setErrorMsg(error?.message);
        setIsDialogOpen(false)
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
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="اضافة خدمة"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button onClick={() => setIsDialogOpen(true)} className="bg-[#0094140D] p-1 rounded-lg">
                اضافة خدمة
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
                ></FileInputImg>
              </div>
              <TextFieldNada
                name="name_ar"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_ar}
                label=" اسم الخدمة ( عربي ) "
                placeholder=" اسم الخدمة  "
                errorMessage={formErrors.name_ar || ""}
              ></TextFieldNada>

              <TextFieldNada
                name="name_en"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_en}
                label=" اسم الخدمة ( انجليزي ) "
                placeholder=" اسم الخدمة  "
                errorMessage={formErrors.name_en || ""}
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


              <div className="grid grid-cols-2 py-6 ">

                <ToggleSwitch
                  checked={switch1}
                  label="اعادة تدوير"
                  onChange={(value) => handleCheckSubscription(value, 'add')}
                />
                <ToggleSwitch
                  checked={addressSwicth}
                  label="عرض تفاصيل العنوان"
                  onChange={(value) => handleCheckDetails(value, 'add')}
                />

              </div>

              {switch1 && (
                <TextFieldNada isPercentage={true} prependIcon="mdi mdi-ticket-percent-outline text-gray-400 " handleChange={addFormChangeHander} name="discount_value_percentage" label="نسبة الخصم" placeholder="ادخل نسبة الخصم" type="number" value={formData.discount_value_percentage} />
              )}
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

            has_recycle: (item, index: number) => (
              item.has_recycle ?
                <div className="bg-[#009414] text-white rounded-full w-7 h-7 overflow-hidden flex justify-center items-center">
                  <span className="mdi mdi-check"></span>
                </div>
                :
                <div className="bg-[#F9285A] text-white rounded-full w-7 h-7 overflow-hidden flex justify-center items-center">
                  <span className="mdi mdi-close"></span>
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
                    setIsUpdateDialogOpen(true);
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


        <UIBaseDialog
          open={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          title="تعديل خدمة"
          confirmHandler={() => { }}
          confirmText="تعديل"
          form="update-form"
        >
          <form onSubmit={updateSubmit} id="update-form">
            <div className="space-y-7">
              <div className="w-full flex justify-center mb-20">
                <FileInputImg
                  state="edit"
                  fileUrl={updateFormData.image as string}
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
                errorMessage={formErrors.name_ar || ''}
              ></TextFieldNada>

              <TextFieldNada
                name="name_en"
                type="text"
                handleChange={updateFormChangeHander}
                value={updateFormData.name_en}
                label=" اسم الخدمة ( انجليزي ) "
                placeholder=" اسم الخدمة "
                errorMessage={formErrors.name_en || ''}
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


              <div className="grid grid-cols-2 py-6 ">


                <ToggleSwitch className="col-span-1"
                  checked={updateFormData.has_recycle ? true : false}
                  label="اعادة تدوير"
                  onChange={(value) => handleCheckSubscription(value, 'edit')}
                />


                <ToggleSwitch className="col-span-1"
                  checked={updateFormData.has_detailed_address ? true : false}
                  label="عرض تفاصيل العنوان"
                  onChange={(value) => handleCheckDetails(value, 'edit')}
                />

              </div>

              {updateFormData.has_recycle && (
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


                <TextFieldNada isPercentage={true} prependIcon="mdi mdi-ticket-percent-outline text-gray-400 " handleChange={updateFormChangeHander} name="discount_value_percentage" label="نسبة الخصم" placeholder="ادخل نسبة الخصم" type="number" value={updateFormData.discount_value_percentage} />
              )}
            </div>
          </form>
        </UIBaseDialog>
      </div >
    </>
  );
}
