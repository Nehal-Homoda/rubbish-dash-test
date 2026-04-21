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

import { Banner } from "@/types/banners.interface";
import * as Yup from "yup";
import { ToggleSwitch } from "flowbite-react";
import {
  addBannerService,
  deleteBannerService,
  getBannersService,
  updateBannerService,
} from "@/services/bannersServices";
import { Category } from "@/types/categories.interface";
import { getCategoriesService } from "@/services/categoriesService";

interface FormDataInputErrors {
  image: string | null;
  title_ar: string | null;
  title_en: string | null;
  order: string | null;
  ad_image: string | null;
}
type FormDataType = {
  title_ar: string;
  title_en: string;
  order: number;
  link: string;
  is_active: number;
  image: File | null | string;
  page_id?: string;
  category_id: string;
  is_ad: number | null;
  ad_image: File | null | string;
};

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Banner[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " الصورة ", name: "image" },
    { text: " URL", name: "link" },
    { text: "العنوان", name: "title_ar" },
    { text: "الحالة", name: "is_active" },
    { text: "الترتيب", name: "order" },
    { text: "الاجراءات", name: "procedures" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];
  const typeList = [
    { type: "external", name: "رابط خارجي" },
    { type: "internal", name: "رابط داخلي" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
  //   undefined,
  // );
  const [errorMsg, setErrorMsg] = useState("");
  const [switch1, setSwitch1] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [type, setType] = useState<"internal" | "external" | "">("");
  const [TicketAutoReplyEnabled, setTicketAutoReplyEnabled] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    title_ar: "",
    title_en: "",
    order: 0,
    link: "",
    is_active: 0,
    image: null,
    category_id: "",
    is_ad: 0,
    ad_image: "",
  });
  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    title_ar: "",
    title_en: "",
    order: 0,
    link: "",
    is_active: 0,
    image: null,
    category_id: "",
    is_ad: 0,
    ad_image: "",
  });
  const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
    image: "",
    title_ar: "",
    title_en: "",
    order: "",
    ad_image: "",
  });
  const [updateFormErrors, setUpdateFormErrors] = useState<FormDataInputErrors>(
    {
      image: "",
      title_ar: "",
      title_en: "",
      order: "",
      ad_image: "",
    },
  );

  const formSchema = Yup.object().shape({
    image: Yup.mixed().test(
      "image-required",
      "الصورة مطلوبة",
      (value) =>
        value instanceof File ||
        (typeof value === "string" && value.trim() !== "")
    ),

    title_ar: Yup.string().required("العنوان باللغه العربيه مطلوب"),
    title_en: Yup.string().required("العنوان باللغه الانجليزيه مطلوب"),
    order: Yup.number().required("الترتيب مطلوب"),
  });

  const fetchDataList = ({
    search = "",
    is_active = undefined,
    pageNum = page,
  }: {
    search?: string;
    is_active?: boolean | undefined;
    pageNum?: number;
  } = {}) => {
    console.log(is_active);
    const isActive =
      is_active != undefined
        ? is_active
          ? "&is_active=" + 1
          : "&is_active=" + 0
        : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}`;

    getBannersService(query)
      .then((response) => {
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => { });
  };

  const handleActiveFilter = (value: boolean | undefined) => {
    setPage(1);
    fetchDataList({ is_active: value, pageNum: 1 });
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

    updateBannerService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].is_active = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => { });
  };

  const deleteSubmit = (item: Banner, selectedIndex: number) => {
    deleteBannerService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => { });
  };

  const updateDataItem = (item: Banner) => {
    setSelectedDataItem(item);
    console.log("IMAGE BEFORE VALIDATION:", updateFormData.image);

    setUpdateFormData({
      title_ar: item.title_ar,
      title_en: item.title_en,
      order: item.order,
      link: item.link,
      is_active: item.is_active ? 1 : 0,
      image: item.image || "",
      category_id: item.category_id,
      is_ad: item.is_ad ? 1 : 0,
      ad_image: item.ad_image || "",
    });
    console.log("IMAGE BEFORE VALIDATION:", updateFormData.image);

  };

  const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDataItem) return;
    const validateResult = await validateAllInputs<FormDataType>(
      formSchema,
      updateFormData,
    );
    if (!validateResult) return;
    setUpdateFormErrors({ ...validateResult.outputResult });
    console.log("update formdata error", updateFormErrors);
    if (validateResult.isInvalid) return;

    // const body = JSON.stringify({
    //   ...updateFormData,
    // });

    const body: any = { ...updateFormData };

    if (typeof body.image === "string" && !body.image.startsWith("data:")) {
      delete body.image;
    }

    updateBannerService(selectedDataItem.id, JSON.stringify(body))
      .then((response) => {
        setIsDialogOpen(false);
        fetchDataList();
        successDialog(true);
      })
      .catch((error) => {
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
    console.log("wdjiqwodjqwoi");
    e.preventDefault();

    const validateResult = await validateAllInputs<FormDataType>(
      formSchema,
      formData,
    );
    if (!validateResult) return;

    setFormErrors({ ...validateResult.outputResult });

    if (validateResult.isInvalid) return;

    setErrorMsg("");
    const fd = new FormData();
    fd.append("title_ar", formData.title_ar);
    fd.append("title_en", formData.title_en);
    fd.append("order", formData.order.toString());
    fd.append("link", formData.link);
    fd.append("is_active", formData.is_active.toString());
    if (formData.image) {
      fd.append("image", formData.image);
    }
    if (formData.category_id) {
      fd.append("category_id", formData.category_id.toString());
    }
    if (formData.is_ad) {
      fd.append("is_ad", formData.is_ad.toString());
    }
    if (formData.ad_image) {
      fd.append("ad_image", formData.ad_image);
    }
    setIsDialogOpen(false);
    addBannerService(fd)
      .then((response) => {
        setIsAddDialogOpen(false);
        fetchDataList();
        //@ts-ignore
        successDialog(true);
        setFormData({
          title_ar: "",
          title_en: "",
          order: 0,
          link: "",
          is_active: 0,
          image: null,
          category_id: "",
          is_ad: 0,
          ad_image: "",
        });
      })
      .catch((error) => {
        setIsDialogOpen(false);
        console.log("error is", error?.message);
        setErrorMsg(error?.message);
      });
  };

  const handleCheckSubscription = (value: boolean, name: string) => {
    setSwitch1(!switch1);
    if (name == "add") {
      setFormData((prev) => ({
        ...prev,
        ["is_ad"]: value ? 1 : 0,
      }));
    }

    if (name == "edit") {
      setUpdateFormData((prev) => ({
        ...prev,
        ["is_ad"]: value ? 1 : 0,
      }));
    }
  };

  const fetchCategories = () => {
    getCategoriesService().then((response) => {
      const activeCategories = response.data.filter((item, index) => {
        return item.is_active;
      });

      setCategoryList(activeCategories);
    });
  };

  const handleSelectedCategory = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      ["category_id"]: value,
    }));
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
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="اضافة لافتة"
          confirmText="اضافة"
          form="add-form"
          confirmHandler={() => { }}
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[#0094140D] p-1 rounded-lg"
              >
                اضافة لافتة
              </button>
            </div>
          }
        >
          <form onSubmit={createSubmit} id="add-form">
            {errorMsg && (
              <div className="mb-6 text-start border border-red-800 bg-red-100 px-3 py-3 rounded-lg">
                <span className="text-red-800 error-alert"> {errorMsg}</span>
              </div>
            )}
            <div className="space-y-7">
              <div className="w-full flex justify-center mb-20">
                <FileInputImg
                  errorMessage={formErrors.image || ''}
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
                name="title_ar"
                type="text"
                prependIcon="mdi mdi-notebook-edit-outline"
                iconType="mdi"
                handleChange={addFormChangeHander}
                value={formData.title_ar}
                label=" النص ( عربي ) "
                placeholder=" ادخل نص اللافتة بالغة العربية  "
                errorMessage={formErrors.title_ar || ""}
              ></TextFieldNada>

              <TextFieldNada
                name="title_en"
                type="text"
                prependIcon="mdi mdi-notebook-edit-outline"
                iconType="mdi"
                handleChange={addFormChangeHander}
                value={formData.title_en}
                label=" النص ( انجليزي ) "
                placeholder=" ادخل نص اللافتة بالغة الانجليزية  "
                errorMessage={formErrors.title_en || ""}
              ></TextFieldNada>

              <SelectInput
                value={type}
                items={typeList}
                itemName="name"
                itemValue="type"
                label="نوع الرابط"
                placeholder="اختر نوع الرابط"
                name="type"
                required={true}
                onChange={(value) => {
                  setType(value);
                }}
              ></SelectInput>

              {type === "external" && (
                <TextFieldNada
                  name="link"
                  type="text"
                  prependIcon="mdi mdi-notebook-edit-outline"
                  iconType="mdi"
                  handleChange={addFormChangeHander}
                  value={formData.link}
                  label=" الرابط"
                  placeholder=" ادخل الرابط الخاص باللافتة  "
                  required={false}
                ></TextFieldNada>
              )}
              {type === "internal" && (
                <SelectInput
                  value={formData.category_id}
                  items={categoryList}
                  itemName="name_ar"
                  itemValue="id"
                  label=" نوع الخدمة"
                  placeholder="ادخل نوع الخدمة"
                  name="type"
                  required={true}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      category_id: value,
                    }));
                  }}
                ></SelectInput>
              )}

              <TextFieldNada
                name="order"
                type="number"
                prependIcon="mdi mdi-swap-vertical"
                iconType="mdi"
                handleChange={addFormChangeHander}
                value={formData.order}
                label=" الترتيب"
                placeholder=" ادخل رقم ترتيب النص في العرض "
                errorMessage={formErrors.order || ""}
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

              <ToggleSwitch
                checked={switch1}
                label="اعلان"
                onChange={(value) => handleCheckSubscription(value, "add")}
              />

              {switch1 && (
                <div className="w-full flex justify-center mb-20">
                  <FileInputImg
                    errorMessage={formErrors.image || ""}
                    state="add"
                    onFileChange={(arg) => {
                      setFormData((prev) => ({
                        ...prev,
                        ["ad_image"]: arg?.file ?? null,
                      }));
                    }}
                  ></FileInputImg>
                </div>
              )}
            </div>
          </form>
        </UIBaseDialog>
      </>
    );
  };

  useEffect(() => {
    fetchDataList();
    fetchCategories();
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
            image: (item) => (
              <div className="w-12 h-12">
                <img
                  src={item.image}
                  className="w-full h-full object-cover rounded-full"
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
                    setIsDialogOpen(true);
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
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="تعديل اللافتة"
          confirmHandler={() => { }}
          confirmText="تعديل"
          form="update-form"
        >
          <form onSubmit={updateSubmit} id="update-form">
            <div className="space-y-7">
              <div className="w-full flex justify-center mb-20">
                <FileInputImg
                  showCloseButton={false}
                  errorMessage={updateFormErrors.image || ""}
                  state="edit"
                  fileUrl={updateFormData.image as string}
                  onFileChange={(arg) => {
                    setUpdateFormData((prev) => ({
                      ...prev,
                      ["image"]: arg?.file64 ?? prev.image,
                    }));
                  }}
                ></FileInputImg>
              </div>
              <TextFieldNada
                name="title_ar"
                type="text"
                prependIcon="mdi mdi-notebook-edit-outline"
                iconType="mdi"
                handleChange={updateFormChangeHander}
                value={updateFormData.title_ar}
                label=" النص ( عربي ) "
                placeholder=" ادخل نص اللافتة بالغة العربية  "
              ></TextFieldNada>

              <TextFieldNada
                name="title_en"
                type="text"
                prependIcon="mdi mdi-notebook-edit-outline"
                iconType="mdi"
                handleChange={updateFormChangeHander}
                value={updateFormData.title_en}
                label=" النص ( انجليزي ) "
                placeholder=" ادخل نص اللافتة بالغة الانجليزية  "
              ></TextFieldNada>

              {updateFormData.link && (
                <TextFieldNada
                  name="link"
                  type="text"
                  prependIcon="mdi mdi-notebook-edit-outline"
                  iconType="mdi"
                  handleChange={addFormChangeHander}
                  value={updateFormData.link}
                  label=" الرابط"
                  placeholder=" ادخل الرابط الخاص باللافتة  "
                  required={false}
                ></TextFieldNada>
              )}
              {updateFormData.category_id && (
                <SelectInput
                  value={updateFormData.category_id}
                  items={categoryList}
                  itemName="name_ar"
                  itemValue="id"
                  label=" نوع الخدمة"
                  placeholder="ادخل نوع الخدمة"
                  name="type"
                  required={true}
                  onChange={(value) => {
                    setUpdateFormData((prev) => ({
                      ...prev,
                      category_id: value,
                    }));
                  }}
                ></SelectInput>
              )}

              <TextFieldNada
                name="order"
                type="number"
                prependIcon="mdi mdi-swap-vertical"
                iconType="mdi"
                handleChange={updateFormChangeHander}
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

              <ToggleSwitch
                className="col-span-1"
                // checked={updateFormData.is_ad ? true : false}
                checked={updateFormData.is_ad === 1}
                label="اعلان"
                onChange={(value) => handleCheckSubscription(value, "edit")}
              />
              {updateFormData.is_ad === 1 && (
                <div className="w-full flex justify-center mb-20">
                  <FileInputImg
                    errorMessage={updateFormErrors.ad_image || ""}
                    fileUrl={updateFormData.ad_image as string}
                    state="edit"
                    onFileChange={(arg) => {
                      setUpdateFormData((prev) => ({
                        ...prev,
                        ["ad_image"]: arg?.file64 ?? null,
                      }));
                    }}
                  ></FileInputImg>
                </div>
              )}
            </div>
          </form>
        </UIBaseDialog>
      </div>
    </>
  );
}