"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import {
  addPackageService,
  deletePackageService,
  getPackagesService,
  updatePackageService,
} from "@/services/packagesOffersService";
import { PackageDiscount, PackageOffer } from "@/types/packagesOffer.interface";
import { getCategoriesService, getCategoryByIdService } from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<PackageOffer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم الباقة", name: "name" },
    { text: " نوع الخدمة", name: "category" },
    { text: "سعر الوحدة", name: "price_per_unit" },
    { text: "مدة الباقة", name: "days_count" },
    { text: "عدد الاشتراكات", name: "price_per_unit" },
    { text: "الحالة", name: "is_active" },
    { text: "الاجراءات", name: "" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<PackageOffer | null>(
    null
  );
  const [categoryItem, setCategoryItem] = useState<Category | null>(null)
  const [recyclePrice, setRecyclePrice] = useState(0)

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);


  const discountArr = [
    {
      min_units: 5,
      max_units: 10,
      discount_rate: 0
    },
    {
      min_units: 10,
      max_units: 15,
      discount_rate: 0
    },
    {
      min_units: 20,
      max_units: 0,
      discount_rate: 0
    }
  ]


  type FormDataType = {
    name_ar: string;
    name_en: string;
    category_id: number | string;
    is_active: number;
    price_per_unit: number | string;
    order: number;
    days_count: number | string;
    recycle_price?: number | string;
    discounts: PackageDiscount[]
  };
  const [formData, setFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    category_id: "",
    is_active: 0,
    price_per_unit: "",
    order: 0,
    days_count: "",
    recycle_price: "",
    discounts: [
      {
        min_units: 5,
        max_units: 10,
        discount_rate: 0
      },
      {
        min_units: 10,
        max_units: 15,
        discount_rate: 0
      },
      {
        min_units: 20,
        max_units: '',
        discount_rate: 0
      }
    ]
  });



  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    category_id: "",
    is_active: 0,
    price_per_unit: "",
    order: 0,
    days_count: "",
    discounts: [
      {
        min_units: 5,
        max_units: 10,
        discount_rate: 0
      },
      {
        min_units: 10,
        max_units: 15,
        discount_rate: 0
      },
      {
        min_units: 20,
        max_units: '',
        discount_rate: 0
      }
    ]
  });




  const fetchDataList = ({
    search = searchTerm,
    is_active = statusFilter,
    category_id = categoryFilter,
    pageNum = page
  }: {
    search?: string;
    is_active?: boolean | undefined;
    category_id?: number | undefined;
    pageNum?: number
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

    const ca = categories.find((cate) => cate.name_ar === item.category);

    setUpdateFormData({
      name_ar: item.name_ar,
      name_en: item.name_ar,
      order: item.order ? item.order : 0,
      is_active: item.is_active ? 1 : 0,
      category_id: ca?.id ?? "",
      days_count: item.days_count ? parseInt(item.days_count) : "",
      price_per_unit: item.price_per_unit ? parseInt(item.price_per_unit) : "",
      discounts: [

        {
          min_units: 5,
          max_units: 10,
          discount_rate: item.discounts ? item.discounts[0].discount_rate : 0
        },
        {
          min_units: 10,
          max_units: 15,
          discount_rate: item.discounts ? item.discounts[1].discount_rate :0
        },
        {
          min_units: 20,
          max_units: '',
          discount_rate: item.discounts ? item.discounts[2].discount_rate :0
        }
      ]

    });
  };

  const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDataItem) return;

    const body = JSON.stringify({
      ...updateFormData,
    });

    updatePackageService(selectedDataItem.id, body)
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

    // for (const keyName in formData) {
    //   //@ts-ignore
    //   fd.append(keyName, formData[keyName]);

    // }


    fd.append('name_ar', formData.name_ar),
      fd.append('name_en', formData.name_en),
      fd.append('category_id', formData.category_id.toString()),
      fd.append('is_active', formData.is_active.toString()),
      fd.append('price_per_unit', formData.price_per_unit.toString()),
      fd.append('order', formData.order.toString()),
      fd.append('days_count', formData.days_count.toString()),
      // fd.append('recycle_price', recyclePrice.toString()),

      formData.discounts.forEach((discount, index) => {
        Object.keys(discount).forEach((keyName) => {
          const value = discount[keyName as keyof typeof discount];
          fd.append(`discounts[${index}][${keyName}]`, String(value));
        });
      });

    addPackageService(fd)
      .then((response) => {
        fetchDataList();
        //@ts-ignore
        successDialog(true);
        setFormData({
          name_ar: "",
          name_en: "",
          category_id: 0,
          is_active: 0,
          price_per_unit: 0,
          order: 0,
          days_count: 0,
          discounts: [{
            min_units: 0,
            max_units: '',
            discount_rate: 0
          }]
        });
      })
      .catch((error) => { });
  };


  const handleSelectedCategory = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      ["category_id"]: value,
    }));
    // const selected = categories.find((item, index) => {
    //   return item.id == value
    // })
    // if (!selected) return
    // setSelectedCategory(selected)

    getCategoryByIdService(value).then((response) => {
      setCategoryItem(response.data)
    })
  }

  const handleChangeValue = (e: any, index: number) => {
    console.log('index is', index)
    console.log('value of discount is', e.target.value)




    setFormData((prev) => {
      const updateDiscount = [...prev.discounts]
      updateDiscount[index].discount_rate = e.target.value;

      return {
        ...prev,
        discounts: updateDiscount,
      };
    })

    console.log('form data', formData)




  }

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIPrimaryDropdown
          items={[{ id: undefined, name_ar: "الكل" }, ...categories]}
          itemName="name_ar"
          itemValue="id"
          // onSelected={(value) => {
          //   fetchDataList({ category_id: value });
          // }}
          onSelected={handleCategoryFilter}
        >
          نوع الخدمة
        </UIPrimaryDropdown>
        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...statusList]}
          itemName="name"
          itemValue="is_active"
          // onSelected={(value) => {
          //   fetchDataList({ is_active: value });
          // }}
          onSelected={handleStatusFilter}
        >
          الحالة
        </UIPrimaryDropdown>
        <UIBaseDialog confirmCloseHandler={resetForm}
          title="اضافة باقة"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button className="bg-[#0094140D] p-1 rounded-lg">
                اضافة باقة
              </button>
            </div>
          }
        >
          <form onSubmit={createSubmit} id="update-form">
            <div className="space-y-7">
              <TextFieldNada
                name="name_ar"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_ar}
                label=" اسم الباقة ( عربي ) "
                placeholder=" اسم الباقة  "
              ></TextFieldNada>

              <TextFieldNada
                name="name_en"
                type="text"
                handleChange={addFormChangeHander}
                value={formData.name_en}
                label=" اسم الباقة ( انجليزي ) "
                placeholder=" اسم الباقة  "
              ></TextFieldNada>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1">
                  <SelectInput
                    value={formData.category_id}
                    items={categories}
                    itemName="name_ar"
                    itemValue="id"
                    label="نوع الخدمة"
                    placeholder="اختر نوع الخدمة"
                    name="category_id"
                    required={true}
                    onChange={(value) => {
                      // setFormData((prev) => ({
                      //   ...prev,
                      //   ["category_id"]: value,
                      // }));
                      handleSelectedCategory(value)
                    }}
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
                      setFormData((prev) => ({
                        ...prev,
                        ["is_active"]: value,
                      }));
                    }}
                  ></SelectInput>
                </div>
              </div>
              <TextFieldNada
                name="price_per_unit"
                type="number"
                handleChange={addFormChangeHander}
                value={formData.price_per_unit}
                label=" سعر الوحدة"
                placeholder=" ادخل سعر الوحدة "
                isPrice={true}
              ></TextFieldNada>

              {categoryItem && categoryItem.has_recycle &&
                <TextFieldNada
                  name="recycle_price"
                  type="number"
                  handleChange={addFormChangeHander}
                  value={recyclePrice.toString()}
                  label=" سعر الوحدة ( اعادة التدوير ) "
                  placeholder=" ادخل سعر الوحدة ( اعادة التدوير )"
                  isPrice={true}

                ></TextFieldNada>


              }
              <TextFieldNada
                name="days_count"
                type="number"
                handleChange={addFormChangeHander}
                value={formData.days_count}
                label=" مدة الباقة "
                placeholder=" ادخل مدة الباقة  "
              ></TextFieldNada>

              <div>
                <div className="label flex items-center gap-1  start-4  w-fit px-3 text-sm font-semibold">
                  <label>
                    نسبة الخصم
                  </label>
                </div>
                <div className="my-4">
                  {discountArr.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-5 ">
                      <div className="col-span-4 border py-3 px-5 flex justify-center items-center  rounded-xl mb-7 ">
                        <span>{item.min_units} - {item.max_units} وحدة</span>
                      </div>
                      <div className="col-span-8 mb-7">
                        <TextFieldNada prependIcon="mdi mdi-ticket-percent-outline text-gray-400 " handleChange={(value) => handleChangeValue(value, index)} name="discount_value_percentage" label="نسبة الخصم" placeholder="ادخل نسبة الخصم" type="number" value={formData.discounts[index]?.discount_rate} />
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
  const fetchCategories = () => {
    getCategoriesService()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => { });
  };


  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      category_id: "",
      is_active: 0,
      price_per_unit: "",
      order: 0,
      days_count: "",
      discounts:

        [{
          min_units: 0,
          max_units: '',
          discount_rate: 0
        }]
    })
  }


  useEffect(() => {
    if (categoryItem && formData.price_per_unit) {
      setRecyclePrice(100 - (Number(formData.price_per_unit) * (categoryItem.discount_value_percentage / 100)))
    }
    // setRecyclePrice(0)
  }, [categoryItem])
  useEffect(() => {
    if (categoryItem && formData.price_per_unit) {
      setRecyclePrice(100 - (Number(formData.price_per_unit) * (categoryItem.discount_value_percentage / 100)))
    }
    // setRecyclePrice(0)
  }, [formData.price_per_unit])

  useEffect(() => {
    fetchDataList();
    fetchCategories();
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
              <td className="py-2 px-4">{item.name_ar}</td>
              <td className="py-2 px-4">{item.category}</td>
              <td className="py-2 px-4">{item.price_per_unit}</td>
              <td className="py-2 px-4">{item.days_count}</td>
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
                    updateDataItemActive(value, index);
                  }}
                  items={statusList}
                >
                  {item.is_active ? "مفعل" : "غير مفعل"}
                </UIPrimaryDropdown>
              </td>
              <td className="">
                <div className=" flex gap-3">
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
                    title="تعديل باقة"
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
                        <TextFieldNada
                          name="name_ar"
                          type="text"
                          handleChange={updateFormChangeHander}
                          value={updateFormData.name_ar}
                          label=" اسم الباقة ( عربي ) "
                          placeholder=" اسم الباقة  "
                        ></TextFieldNada>

                        <TextFieldNada
                          name="name_en"
                          type="text"
                          handleChange={updateFormChangeHander}
                          value={updateFormData.name_en}
                          label=" اسم الباقة ( انجليزي ) "
                          placeholder=" اسم الباقة  "
                        ></TextFieldNada>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="col-span-1">
                            <SelectInput
                              value={updateFormData.category_id}
                              items={categories}
                              itemName="name_ar"
                              itemValue="id"
                              label="نوع الخدمة"
                              placeholder="اختر نوع الخدمة"
                              name="category_id"
                              required={true}
                              onChange={(value) => {
                                setUpdateFormData((prev) => ({
                                  ...prev,
                                  ["category_id"]: value,
                                }));
                              }}
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
                        <TextFieldNada
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
                        ></TextFieldNada>


                        <div>
                          <div className="label flex items-center gap-1  start-4  w-fit px-3 text-sm font-semibold">
                            <label>
                              نسبة الخصم
                            </label>
                          </div>
                          <div className="my-4">
                            {discountArr.map((item, index) => (
                              <div key={index} className="grid grid-cols-12 gap-5 ">
                                <div className="col-span-4 border py-3 px-5 flex justify-center items-center  rounded-xl mb-7 ">
                                  <span>{item.min_units} - {item.max_units} وحدة</span>
                                </div>
                                <div className="col-span-8 mb-7">
                                  <TextFieldNada prependIcon="mdi mdi-ticket-percent-outline text-gray-400 " handleChange={(value) => handleChangeValue(value, index)} name="discount_value_percentage" label="نسبة الخصم" placeholder="ادخل نسبة الخصم" type="number" value={updateFormData.discounts[index]?.discount_rate} />
                                </div>

                              </div>
                            ))}



                          </div>


                        </div>



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
