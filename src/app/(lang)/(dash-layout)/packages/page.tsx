"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import SelectInput from "@/components/ui/form/SelectInput";
import {
  successDialog,
  validateAllInputs,
  validateInput,
} from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import * as Yup from "yup";
import {
  addPackageService,
  deletePackageService,
  getPackagesService,
  updatePackageService,
} from "@/services/packagesOffersService";
import { PackageDiscount, PackageOffer } from "@/types/packagesOffer.interface";
import {
  getCategoriesService,
  getCategoryByIdService,
} from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";
import { Area } from "@/types/area.interface";
import { getAreaService } from "@/services/areaServices";
import { District } from "@/types/district.interface";
import {
  getDistrictService,
  showDistrictService,
} from "@/services/districtService";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";

type FormDataType = {
  name_ar: string;
  name_en: string;
  category_id: number | string | null;
  is_active: number;
  area_id: number | string | null;
  district_id: number | string | null;
  days: string[];
  price_per_unit: number | string;
  order: number;
  days_count: number | string;
  recycle_price?: number | string | null;
  discounts: PackageDiscount[];
};

interface FormDataInputErrors {
  name_ar: string | null;
  name_en: string | null;
  category_id: string | null;
  area_id: string | null;
  district_id: string | null;
  days: string;
  price_per_unit: string | null;
  discounts?: { discount_rate?: string }[];
}
export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<PackageOffer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم الباقة", name: "name_ar" },
    { text: " نوع الخدمة", name: "category" },
    { text: "سعر الوحدة", name: "price_per_unit" },
    { text: "مدة الباقة", name: "days_count" },
    { text: "عدد الاشتراكات", name: "no_of_subscriptions" },
    { text: "الحالة", name: "is_active" },
    { text: "الاجراءات", name: "procedures" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<PackageOffer | null>(
    null,
  );
  const [categoryItem, setCategoryItem] = useState<Category | null>(null);
  const [recyclePrice, setRecyclePrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(
    undefined,
  );
  const [areaList, setAreaList] = useState<Area[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);

  const discountArr = [
    {
      min_units: 1,
      max_units: null,
      discount_rate: "",
    },
    {
      min_units: 2,
      max_units: 5,
      discount_rate: "",
    },
    {
      min_units: 6,
      max_units: 9,
      discount_rate: "",
    },
    {
      min_units: 10,
      max_units: 15,
      discount_rate: "",
    },
    {
      min_units: 16,
      max_units: 19,
      discount_rate: "",
    },
    {
      min_units: 20,
      max_units: "",
      discount_rate: "",
    },
  ];
  const [formData, setFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    category_id: null,
    area_id: null,
    district_id: null,
    days: [],
    is_active: 0,
    price_per_unit: "",
    order: 0,
    days_count: "",
    recycle_price: null,

    discounts: [
      {
        min_units: 1,
        max_units: 1,
        discount_rate: "",
      },
      {
        min_units: 2,
        max_units: 5,
        discount_rate: "",
      },
      {
        min_units: 6,
        max_units: 9,
        discount_rate: "",
      },
      {
        min_units: 10,
        max_units: 15,
        discount_rate: "",
      },
      {
        min_units: 16,
        max_units: 19,
        discount_rate: "",
      },
      {
        min_units: 20,
        max_units: "",
        discount_rate: "",
      },
    ],
  });

  const formSchema = Yup.object().shape({
    name_ar: Yup.string().required("الاسم باللغه العربيه مطلوب"),
    name_en: Yup.string().required("الاسم باللغه الانجليزيه مطلوب"),
    category_id: Yup.string().required("نوع الخدمة مطلوب"),
    area_id: Yup.string().required("الحي مطلوب"),
    district_id: Yup.string().required("المنطقة مطلوبه"),
    price_per_unit: Yup.string().required("سعر الوحده الواحده"),
    days: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one day")
      .required("Available days are required"),
    discounts: Yup.array().of(
      Yup.object().shape({
        discount_rate: Yup.number()
          .typeError("يجب ادخال رقم")
          .min(0, "اقل قيمة 0")
          .max(100, "اقصى قيمة 100")
          .required("نسبة الخصم مطلوبة"),
      })
    ),



  });
  const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
    name_ar: "",
    name_en: "",
    category_id: "",
    area_id: "",
    district_id: "",
    price_per_unit: "",
    days: "",
    discounts: [],


  });
  const [updateFormErrors, setUpdateFormErrors] = useState<FormDataInputErrors>(
    {
      name_ar: "",
      name_en: "",
      category_id: "",
      price_per_unit: "",
      area_id: "",
      district_id: "",
      days: "",
    },
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    category_id: null,
    area_id: null,
    district_id: null,
    days: [],
    is_active: 0,
    price_per_unit: "",
    order: 0,
    days_count: "",
    discounts: [
      {
        min_units: 1,
        max_units: 1,
        discount_rate: "",
      },
      {
        min_units: 2,
        max_units: 5,
        discount_rate: "",
      },
      {
        min_units: 6,
        max_units: 9,
        discount_rate: "",
      },
      {
        min_units: 10,
        max_units: 15,
        discount_rate: "",
      },
      {
        min_units: 16,
        max_units: 19,
        discount_rate: "",
      },
      {
        min_units: 20,
        max_units: "",
        discount_rate: "",
      },
    ],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [districtDays, setDistrictDays] = useState<District[]>([]);

  const fetchDataList = ({
    search = searchTerm,
    is_active = statusFilter,
    category_id = categoryFilter,
    pageNum = page,
  }: {
    search?: string;
    is_active?: boolean | undefined;
    category_id?: number | undefined;
    pageNum?: number;
  } = {}) => {
    console.log(is_active);
    const isActive =
      is_active != undefined
        ? is_active
          ? "&is_active=" + 1
          : "&is_active=" + 0
        : "";
    const category =
      category_id != undefined ? "&category_id=" + category_id : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}${category}`;

    getPackagesService(query)
      .then((response) => {
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => { });
  };
  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    fetchDataList({ search: val, pageNum: 1 });
  };

  const handleStatusFilter = (value: boolean | undefined) => {
    setStatusFilter(value);
    setPage(1);
    fetchDataList({ is_active: value, pageNum: 1 });
  };

  const handleCategoryFilter = (value: number | undefined) => {
    setCategoryFilter(value);
    setPage(1);
    fetchDataList({ category_id: value, pageNum: 1 });
  };

  const updateDataItemActive = (value: any, index: number) => {
    const service = dataList.find((item, i) => {
      return index == i;
    });

    if (!service) return;

    const body = JSON.stringify({
      is_active: value,
      discounts: service.discounts,
    });

    updatePackageService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].is_active = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => { });
  };

  const deleteSubmit = (item: PackageOffer, selectedIndex: number) => {
    deletePackageService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => { });
  };

  const updateDataItem = (item: PackageOffer) => {
    setSelectedDataItem(item);
    // const ca = categories.find((category) => category.name_en === item.category);
    setUpdateFormData({
      name_ar: item.name_ar,
      name_en: item.name_en,
      order: item.order ? item.order : 0,
      is_active: item.is_active ? 1 : 0,
      category_id: item.category?.id,
      area_id: item.district.area.id,
      district_id: item.district.id,
      days: item.days,
      days_count: item.days_count ? parseInt(item.days_count) : "",
      price_per_unit: String(item.price_per_unit ?? ""),
      discounts: item.discounts?.length
        ? item.discounts.map((d) => ({
          min_units: d.min_units,
          max_units: d.max_units,
          discount_rate: d.discount_rate ?? "",
        }))
        : [
          { min_units: 1, max_units: "", discount_rate: "" },
          { min_units: 2, max_units: 5, discount_rate: "" },
          { min_units: 6, max_units: 9, discount_rate: "" },
          { min_units: 10, max_units: 15, discount_rate: "" },
          { min_units: 16, max_units: 19, discount_rate: "" },
          { min_units: 20, max_units: "", discount_rate: "" },
        ],
    });
  };

  const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDataItem) return;

    setErrorMsg("");
    const validateResult = await validateAllInputs<FormDataType>(
      formSchema,
      updateFormData,
    );
    if (!validateResult) return;

    setUpdateFormErrors({ ...validateResult.outputResult });
    if (validateResult.isInvalid) return;
    const body = JSON.stringify({
      ...updateFormData,
    });
    updatePackageService(selectedDataItem.id, body)
      .then((response) => {
        fetchDataList();
        successDialog(true);
        setIsUpdateDialogOpen(false);
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
  };

  const handleUpdateDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    setUpdateFormData((prev) => {
      const updatedDiscounts = [...prev.discounts];
      updatedDiscounts[index].discount_rate = value;

      return {
        ...prev,
        discounts: updatedDiscounts,
      };
    });
  };

  const createSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const validateResult = await validateAllInputs<FormDataType>(
      formSchema,
      formData,
    );
    if (!validateResult) return;

    setFormErrors({ ...validateResult.outputResult });
    if (validateResult.isInvalid) return;
    const fd = new FormData();
    (fd.append("name_ar", formData.name_ar),
      fd.append("name_en", formData.name_en),
      //@ts-ignore
      fd.append(
        "category_id",
        //@ts-ignore
        formData.category_id ? formData.category_id.toString() : null,
      ),
      fd.append(
        "area_id",
        formData.area_id ? formData.area_id.toString() : "0",
      ),
      fd.append(
        "district_id",
        formData.district_id ? formData.district_id.toString() : "0",
      ),
      formData.days.forEach((day, index) => fd.append(`days[${index}]`, day)));
    (fd.append("is_active", formData.is_active.toString()),
      fd.append("price_per_unit", formData.price_per_unit.toString()),
      fd.append("order", formData.order.toString()),
      fd.append("days_count", formData.days_count.toString()),
      formData.discounts.forEach((discount, index) => {
        Object.keys(discount).forEach((keyName) => {
          const value = discount[keyName as keyof typeof discount];
          fd.append(`discounts[${index}][${keyName}]`, String(value));
        });
      }));

    addPackageService(fd)
      .then((response) => {
        setIsDialogOpen(false);
        fetchDataList();
        //@ts-ignore
        successDialog(true);

        setFormData({
          name_ar: "",
          name_en: "",
          category_id: null,
          area_id: null,
          district_id: null,
          days: [],
          is_active: 0,
          price_per_unit: 0,
          order: 0,
          days_count: 0,
          discounts: [
            {
              min_units: 1,
              max_units: 1,
              discount_rate: "",
            },
            {
              min_units: 2,
              max_units: 5,
              discount_rate: "",
            },
            {
              min_units: 6,
              max_units: 9,
              discount_rate: "",
            },
            {
              min_units: 10,
              max_units: 15,
              discount_rate: "",
            },
            {
              min_units: 16,
              max_units: 19,
              discount_rate: "",
            },
            {
              min_units: 20,
              max_units: "",
              discount_rate: "",
            },
          ],
        });
        setCategoryItem(null);
      })
      .catch((error) => {
        setErrorMsg(error?.message);
        window.scrollTo({ top: 0, behavior: "smooth" });

      });
  };

  const handleSelectedCategory = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      ["category_id"]: value ? value : null,
    }));


    getCategoryByIdService(value).then((response) => {
      setCategoryItem(response.data);
    });
  };

  const handleChangeValue = (e: any, index: number) => {
    setFormData((prev) => {
      const updateDiscount = [...prev.discounts];
      updateDiscount[index].discount_rate = e.target.value;

      return {
        ...prev,
        discounts: updateDiscount,
      };
    });
  };
  const fetchCategories = () => {
    getCategoriesService()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => { });
  };

  const fetchAreaList = ({
    search = "",
    is_active = undefined,
  }: { search?: string; is_active?: boolean | undefined } = {}) => {
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
        setAreaList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => { });
  };

  const fetchDistrictList = ({
    search = "",
    is_active = undefined,
    area_id = "",
  }: {
    search?: string;
    is_active?: boolean | undefined;
    area_id?: string;
  } = {}) => {
    const isActive =
      is_active != undefined
        ? is_active
          ? "&is_active=" + 1
          : "&is_active=" + 0
        : "";
    const hasSearch = search ? "&search=" + search : "";
    const areaSearch = area_id ? "&area_id=" + area_id : "";

    const query = `?page=${page}${hasSearch}${isActive}${areaSearch}`;

    getDistrictService(query)
      .then((response) => {
        setDistrictList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => { });
  };

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIPrimaryDropdown
          items={[{ id: undefined, name_ar: "الكل" }, ...categories]}
          itemName="name_ar"
          itemValue="id"
          onSelected={handleCategoryFilter}
        >
          نوع الخدمة
        </UIPrimaryDropdown>
        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...statusList]}
          itemName="name"
          itemValue="is_active"
          onSelected={handleStatusFilter}
        >
          الحالة
        </UIPrimaryDropdown>
        <UIBaseDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="اضافة باقة"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-[#0094140D] p-1 rounded-lg"
              >
                اضافة باقة
              </button>
            </div>
          }
        >
          <form onSubmit={createSubmit} id="update-form">
            {errorMsg && (
              <div className="mb-6 text-start border border-red-800 bg-red-100 px-3 py-3 rounded-lg">
                <span className="text-red-800 error-alert"> {errorMsg}</span>
              </div>
            )}
            <div className="space-y-7">
              <TextFieldNada
                name="name_ar"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_ar}
                label=" اسم الباقة ( عربي ) "
                placeholder=" اسم الباقة  "
                errorMessage={formErrors.name_ar || ""}
              ></TextFieldNada>

              <TextFieldNada
                name="name_en"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_en}
                label=" اسم الباقة ( انجليزي ) "
                placeholder=" اسم الباقة  "
                errorMessage={formErrors.name_en || ""}
              ></TextFieldNada>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1">
                  <SelectInput
                    value={formData.category_id ? formData.category_id : null}
                    items={categories}
                    itemName="name_ar"
                    itemValue="id"
                    label="نوع الخدمة"
                    placeholder="اختر نوع الخدمة"
                    name="category_id"
                    required={true}
                    onChange={(value) => {
                      handleSelectedCategory(value);
                    }}
                    errorMessage={formErrors.category_id || ""}
                  ></SelectInput>
                </div>
                <div className="col-span-1">
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
                      console.log("value", value);
                      setFormData((prev) => ({
                        ...prev,
                        ["is_active"]: value,
                      }));
                    }}
                  ></SelectInput>
                </div>
              </div>

              <SelectInput
                value={formData.area_id}
                items={areaList}
                itemName="name_ar"
                itemValue="id"
                label="الحي"
                placeholder="اختر الحي"
                name="area_id"
                required={true}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    ["area_id"]: value,
                  }));
                }}
                errorMessage={formErrors.area_id || ""}
              ></SelectInput>

              <SelectInput
                errorMessage={formErrors.district_id || ""}
                value={formData.district_id}
                items={districtList}
                itemName="name_ar"
                itemValue="id"
                label="المنطقة"
                placeholder="اختر المنطقة"
                name="area_id"
                required={true}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    ["district_id"]: value,
                    ["days"]: [],
                  }));

                  if (value) {
                    showDistrictService(value).then((res) => {
                      setDistrictDays(res.data.available_days || []);
                    });
                  } else {
                    setDistrictDays([]);
                  }
                }}
              ></SelectInput>

              <MultiCheckbox
                errorMessage={formErrors.days}
                items={districtDays}
                value={formData.days}
                label="اليوم"
                required={true}
                name="days"
                placeholder="اختر اليوم"
                prependIcon="mdi mdi-calendar-month-outline"
                iconType="mdi"
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    ["days"]: value,
                  }));
                }}
              ></MultiCheckbox>

              <TextFieldNada
                name="price_per_unit"
                type="number"
                handleChange={addFormChangeHander}
                value={formData.price_per_unit}
                label=" سعر الوحدة"
                placeholder=" ادخل سعر الوحدة "
                isPrice={true}
                errorMessage={formErrors.price_per_unit || ""}
              ></TextFieldNada>

              {categoryItem && categoryItem.has_recycle && (
                <TextFieldNada
                  name="recycle_price"
                  type="number"
                  handleChange={addFormChangeHander}
                  value={formData.recycle_price ?? ""}
                  label=" سعر الوحدة ( اعادة التدوير ) "
                  placeholder=" ادخل سعر الوحدة ( اعادة التدوير )"
                  isPrice={true}
                ></TextFieldNada>
              )}
              <TextFieldNada
                isDays={true}
                name="days_count"
                type="number"
                handleChange={addFormChangeHander}
                value={formData.days_count}
                label=" مدة الباقة "
                placeholder=" ادخل مدة الباقة  "
              ></TextFieldNada>

              <div>
                <div className="label flex items-center gap-1  start-4  w-fit px-3 text-sm font-semibold">
                  <label>نسبة الخصم</label>
                </div>
                <div className="my-4">
                  {discountArr.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-5 ">
                      <div className="col-span-4 border py-3 px-5 flex justify-center items-center  rounded-xl mb-7 ">
                        {index < 5 ? (
                          <span>
                            {item.min_units} {index > 0 ? <span>-</span> : ""}{" "}
                            {item.max_units} وحدة
                          </span>
                        ) : (
                          <span>20 وحدة او اكثر</span>
                        )}
                      </div>
                      <div className="col-span-8 mb-7">
                        <TextFieldNada
                          prependIcon="mdi mdi-ticket-percent-outline text-gray-400 "
                          handleChange={(value) =>
                            handleChangeValue(value, index)
                          }
                          name="discount_value_percentage"
                          label="نسبة الخصم"
                          placeholder="ادخل نسبة الخصم"
                          type="number"
                          value={formData.discounts[index]?.discount_rate}
                          errorMessage={
                            formErrors.discounts?.[index]?.discount_rate || ""
                          }
                        />
                      </div>
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
    const price = Number(formData.price_per_unit);

    if (!formData.price_per_unit || isNaN(price)) {
      setFormData((prev) => ({
        ...prev,
        recycle_price: null,
      }));
      return;
    }

    if (categoryItem?.discount_value_percentage) {
      const recycle =
        price - (price * categoryItem.discount_value_percentage) / 100;


      console.log('recycling price', recycle)

      setFormData((prev) => ({
        ...prev,
        recycle_price: recycle,
      }));
    }
  }, [formData.price_per_unit, categoryItem]);

  useEffect(() => {
    if (formData.area_id) {
      fetchDistrictList({ area_id: formData.area_id.toString() });
    } else {
      setDistrictList([]);
    }
  }, [formData.area_id]);


  useEffect(() => {
    if (updateFormData.area_id) {
      fetchDistrictList({ area_id: updateFormData.area_id.toString() });
    } else {
      setDistrictList([]);
    }
  }, [updateFormData.area_id]);

  useEffect(() => {
    if (updateFormData.district_id) {
      showDistrictService(Number(updateFormData.district_id)).then((res) => {
        setDistrictDays(res.data.available_days || []);
      });
    } else {
      setDistrictDays([]);
    }
  }, [updateFormData.district_id]);

  useEffect(() => {
    fetchDataList();
    fetchCategories();
    fetchAreaList();
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

            category: (item) => item.category?.name || "-",

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
        ></BaseDataTable>
      </div>
      <UIBaseDialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        title="تعديل باقة"
        confirmHandler={() => { }}
        confirmText="تعديل"
        form="update-form"
      >
        <form onSubmit={updateSubmit} id="update-form">
          <div className="space-y-7">
            <TextFieldNada
              name="name_ar"
              type="text"
              handleChange={updateFormChangeHander}
              value={updateFormData.name_ar}
              label=" اسم الباقة ( عربي ) "
              placeholder=" اسم الباقة  "
              errorMessage={updateFormErrors.name_ar || ""}
            ></TextFieldNada>

            <TextFieldNada
              name="name_en"
              type="text"
              handleChange={updateFormChangeHander}
              value={updateFormData.name_en}
              label=" اسم الباقة ( انجليزي ) "
              placeholder=" اسم الباقة  "
              errorMessage={updateFormErrors.name_en || ""}
            ></TextFieldNada>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="col-span-1">
                <SelectInput
                  value={updateFormData.category_id ?? null}
                  items={categories}
                  label="نوع الخدمة"
                  itemName="name_en"
                  itemValue="id"
                  placeholder="اختر نوع الخدمة"
                  name="category_id"
                  required={true}
                  onChange={(value) => {
                    setUpdateFormData((prev) => ({
                      ...prev,
                      ["category_id"]: value ? value : null,
                    }));
                  }}
                  errorMessage={updateFormErrors.category_id || ""}
                ></SelectInput>
              </div>
              <div className="col-span-1">
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
            </div>

            <div className="col-span-1">
              <SelectInput
                value={updateFormData.area_id}
                items={areaList}
                itemName="name_ar"
                itemValue="id"
                label="الحي"
                placeholder="اختر الحي"
                name="area_id"
                required={true}
                onChange={(value) => {
                  setUpdateFormData((prev) => ({
                    ...prev,
                    ["area_id"]: value,
                  }));
                }}
              ></SelectInput>
            </div>

            <SelectInput
              value={updateFormData.district_id}
              items={districtList}
              itemName="name_ar"
              itemValue="id"
              label="المنطقة"
              placeholder="اختر المنطقة"
              name="district_id"
              required={true}
              onChange={(value) => {
                setUpdateFormData((prev) => ({
                  ...prev,
                  ["district_id"]: value,
                  ["days"]: [],
                }));

                // if (value) {
                //   showDistrictService(value).then((res) => {
                //     setDistrictDays(res.data.available_days || []);
                //   });
                // } else {
                //   setDistrictDays([]);
                // }
              }}
            ></SelectInput>

            <div className="col-span-1">
              <MultiCheckbox
                errorMessage={updateFormErrors.days}
                items={districtDays}
                value={updateFormData.days}
                label="اليوم"
                required={true}
                name="days"
                placeholder="اختر اليوم"
                prependIcon="mdi mdi-calendar-month-outline"
                iconType="mdi"
                onChange={(value) => {
                  setUpdateFormData((prev) => ({
                    ...prev,
                    ["days"]: value,
                  }));
                }}
              ></MultiCheckbox>
            </div>

            <TextFieldNada
              errorMessage={updateFormErrors.price_per_unit || ""}
              name="price_per_unit"
              type="number"
              handleChange={updateFormChangeHander}
              value={updateFormData.price_per_unit}
              label=" سعر الوحدة"
              placeholder=" ادخل سعر الوحدة "
              isPrice={true}
            ></TextFieldNada>
            <TextFieldNada
              name="days_count"
              type="number"
              handleChange={updateFormChangeHander}
              value={updateFormData.days_count}
              label=" مدة الباقة "
              placeholder=" ادخل مدة الباقة  "
              isDays={true}
            ></TextFieldNada>

            <div>
              <div className="label flex items-center gap-1  start-4  w-fit px-3 text-sm font-semibold">
                <label>نسبة الخصم</label>
              </div>
              <div className="my-4">
                {discountArr.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-5 ">
                    <div className="col-span-4 border py-3 px-5 flex justify-center items-center  rounded-xl mb-7 ">
                      {index < 5 ? (
                        <span>
                          {item.min_units} - {item.max_units} وحدة
                        </span>
                      ) : (
                        <span>20 وحدة او اكثر</span>
                      )}
                    </div>
                    <div className="col-span-8 mb-7">
                      <TextFieldNada
                        prependIcon="mdi mdi-ticket-percent-outline text-gray-400 "
                        handleChange={(value) =>
                          handleUpdateDiscountChange(value, index)
                        }
                        name={`discounts[${index}].discount_rate`}
                        label="نسبة الخصم"
                        placeholder="ادخل نسبة الخصم"
                        type="number"
                        value={updateFormData.discounts[index]?.discount_rate}
                        errorMessage={updateFormErrors.discounts?.[index]?.discount_rate || ""}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </UIBaseDialog>
    </>
  );
}