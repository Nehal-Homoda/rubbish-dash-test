"use client";
import React, { useEffect, useState } from "react";
import { getDistrictService } from "@/services/districtService";
import { District } from "@/types/district.interface";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { Payment } from "@/types/payment.interface";
import {
  addPaymentService,
  deletePaymentService,
  getPaymentsService,
  updatePaymentService,
} from "@/services/paymentsService";
import { AppUser } from "@/types/user.interface";
import { Users } from "@/types/auth.interface";
import ComboBoxNehal from "../ui/form/ComboBoxNehal";
import { getCategoriesService } from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { getPackageByIdService, getPackagesService } from "@/services/packagesOffersService";
import { RadioGroup } from "@headlessui/react";
import FileInput from "@/components/ui/form/FileInput";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { paymentMethodListService } from "@/services/sharedService";

type Props = {
  user: Users;
};

export default function rubbush_collectors({ user }: Props) {
  const [dataList, setDataList] = useState<Payment[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم المستخدم", name: "name_ar" },
    { text: " رقم الاستلام", name: "name_ar" },
    { text: " السعر الكلي", name: "name_ar" },
    { text: " تاريخ الدفع", name: "name_ar" },
    { text: "الحالة", name: "is_active" },
    { text: " اسم طريقة الدفع", name: "name_ar" },
    { text: "طريقة الدفع", name: "is_active" },
    { text: "صورة التحويل", name: "image" },
  ];
  const statusList = [
    { is_active: "pending", name: "قيد الانتظار" },
    { is_active: "accepted", name: "مقبولة" },
    { is_active: "rejected", name: "مرفوضة" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [selectedDataItem, setSelectedDataItem] = useState<Payment | null>(
    null
  );
  type FormDataType = {
    name_ar: string;
    name_en: string;
    order: number;
    is_active: number;
    available_days: string[];
    available_times: string[];
  };

  const fetchDataList = ({
    search = "",
    is_active = undefined,
  }: { search?: string; is_active?: boolean | undefined } = {}) => {
    console.log(is_active);
    const isActive = is_active ? "&status=" + is_active : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${page}${hasSearch}${isActive}&user_id=${user.id}`;

    getPaymentsService(query)
      .then((response) => {
        //@ts-ignore
        setDataList(response.data);
      })
      .catch(() => { });
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
      status: value,
    });

    updatePaymentService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].status = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => { });
  };

  const deleteSubmit = (item: Payment, selectedIndex: number) => {
    deletePaymentService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => { });
  };

  const statusDropdownColor = (name: string) => {
    if (name === "rejected")
      return "bg-red-100 text-red-600 hover:bg-text-red-200";
    if (name === "accepted") return undefined;
    if (name === "pending")
      return "bg-yellow-100 text-yellow-600 hover:bg-text-yellow-200";
  };
  const statusDropdownName = (name: string) => {
    return statusList.find((item) => item.is_active === name)?.name ?? "";
  };

  const resetForm = () => {

  }
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
  const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(
    null
  );

  const [selected, setSelected] = useState<null | Payment_methods>(null);

  const [paymentMethodList, setPaymentMethodList] = useState<
    Payment_methods[]
  >([]);


  // const handleSelctedValue = (selectedItem: any) => {
  //   console.log('selected is', selectedItem)
  //   setFormData((prev) => ({
  //     ...prev,
  //     ['user_id']: selectedItem.id

  //   }))
  // }

  // const userList = [


  //   { id: 1, name: 'maria' },
  //   { id: 2, name: 'nehal' },
  //   { id: 3, name: 'aliaa' },
  // ]


  const [formData, setFormData] = useState({

    category_id: 0,
    package_id: 0,
    units: 1,


  })

  const fetchCategories = () => {
    getCategoriesService().then((response) => {
      setCategoryList(response.data);
    });
  };

  const handleSelectPackage = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      ["package_id"]: value,
    }));
    getPackageByIdService(value).then((response) => {
      setPackageItem(response.data);

    });
  };

  const fetchPackages = () => {
    getPackagesService().then((response) => {
      console.log(response);
      setpackagesList(response.data);
    });
  };


  const fetchPaymentMethodList = () => {
    paymentMethodListService().then((response) => {
      setPaymentMethodList(response.data);
    });
  }

  const handleAddPayment = () => {

  }

  const takeValue = (e: any, name: any) => {
    console.log('name is', name)
    console.log(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    if (name == "units") {
      if (packageItem) {
        //@ts-ignore
        setTotalPrice(selectedPackage.price_per_unit * formData.units);
      }
    }
  };


  const handleSelecteditem = (item: any) => {
    console.log("itemssssss", item);
    setSelected(item);
    setFormData((prev) => ({
      ...prev,
      ["payment_method_id"]: item.id,
    }));

    // console.log(e.target.value)
  };


  const takeUploadedImg = (img: any) => {
    console.log(img);
  };


  useEffect(() => {
    fetchCategories()
    fetchPackages()
    fetchPaymentMethodList()
  }, [])


  useEffect(() => {
    if (packageItem) {
      setTotalPrice(Number(packageItem.price_per_unit) * formData.units);
    }
  }, [formData.units]);
  useEffect(() => {
    if (packageItem) {
      setTotalPrice(Number(packageItem.price_per_unit) * formData.units);
    }
  }, [packageItem]);


  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIBaseDialog
          confirmCloseHandler={resetForm}
          title="اضافة دفع"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button className="bg-[#0094140D] p-1 rounded-lg">
                اضافة دفع
              </button>
            </div>
          }
        >

          <form onSubmit={handleAddPayment} className="">
            <div className="grid grid-cols-12 space-y-5 gap-7">



              <div className="col-span-12">
                <SelectInput
                  items={categoryList}
                  placeholder="ادخل نوع الخدمة"
                  name=""
                  itemName="name_ar"
                  itemValue="id"
                  value={formData.category_id}
                  label=" نوع الخدمة"
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      ["category_id"]: value,
                    }))
                  }
                ></SelectInput>
              </div>


              <div className="col-span-12">
                <SelectInput
                  items={packagesList}
                  placeholder="ادخل نوع الباقه"
                  name="package_id"
                  itemName="name_ar"
                  itemValue="id"
                  value={formData.package_id}
                  label=" نوع الباقة"
                  onChange={(value) =>
                    handleSelectPackage(value)
                  }
                ></SelectInput>
              </div>



              <div className="col-span-6">
                <TextFieldNada
                  name="price"
                  type="number"
                  handleChange={(e) =>
                    takeValue(e, "units")
                  }
                  value={
                    packageItem
                      ? packageItem.price_per_unit
                      : 0
                  }
                  label=" سعر الباقة "
                  placeholder="  سعر الباقة "
                ></TextFieldNada>
              </div>

              <div className="col-span-6">
                <TextFieldNada
                  name="units"
                  type="number"
                  handleChange={(e) =>
                    takeValue(e, "units")
                  }
                  value={formData.units}
                  label=" عدد الوحدات "
                  placeholder=" عدد الوحدات "
                ></TextFieldNada>
              </div>

              <div className="col-span-6">
                <TextFieldNada
                  name="price"
                  type="number"
                  handleChange={(e) =>
                    takeValue(e, "price")
                  }
                  value={totalPrice.toString()}
                  label="السعر الكلي "
                  placeholder="  السعر الكلي "
                ></TextFieldNada>
              </div>


              <div className="col-span-12">
                <RadioGroup
                  value={selected}
                  onChange={(e) =>
                    handleSelecteditem(e)
                  }
                >
                  <div className="grid grid-cols-2 gap-7">
                    {paymentMethodList.map(
                      (item, index) => (
                        <RadioGroup.Option
                          key={index}
                          value={item}
                          className={({
                            active,
                            checked,
                          }) =>
                            `${active
                              ? "ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300"
                              : ""
                            }
                                ${checked ? "border border-[#009414] " : ""}
                                  relative flex cursor-pointer  rounded-lg px-5 py-4 ring-1 ring-gray-100 focus:outline-none  col-span-1`
                          }
                        >
                          {({
                            active,
                            checked,
                          }) => (
                            <>
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center">
                                  <div className="text-sm">
                                    <RadioGroup.Label
                                      as="div"
                                      className={`font-medium  ${checked
                                        ? "text-gray-900"
                                        : "text-gray-900"
                                        }`}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full">
                                          <img
                                            className="w-full h-full object-contain"
                                            src={
                                              item.image
                                            }
                                            alt=""
                                          />
                                        </div>
                                        {
                                          item.name_ar
                                        }
                                      </div>
                                    </RadioGroup.Label>
                                  </div>
                                </div>
                                {checked ? (
                                  <div className="before:absolute before:content-[''] before:w-3 before:h-3 before:rounded-full before:bg-[#009414]   shrink-0 w-4 h-4 rounded-full ring-1 ring-surface text-surface flex justify-center items-center text-xs">
                                    {/* <CheckIcon className="h-6 w-6" /> */}
                                  </div>
                                ) : (
                                  <div className="shrink-0 w-4 h-4 rounded-full ring-1 ring-surface text-surface flex justify-center items-center">
                                    {/* <CheckIcon className="h-6 w-6" /> */}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      )
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="col-span-6">
                <FileInput
                  onFileChange={(img) =>
                    takeUploadedImg(img)
                  }
                  state="add"
                  title="ارفاق صورة التحويل"
                />
              </div>



            </div>




          </form >




        </UIBaseDialog >
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
              <td className="py-2 px-4">{item.user_name}</td>
              <td className="py-2 px-4">{item.receiving_number}</td>
              <td className="py-2 px-4">{item.total_price}</td>
              <td className="py-2 px-4">{item.created_at}</td>
              <td className="py-2 px-4">
                <UIPrimaryDropdown
                  tiny={true}
                  itemName="name"
                  itemValue="is_active"
                  btnColorTailwindClass={statusDropdownColor(item.status)}
                  onSelected={(value) => {
                    updateDataItemActive(value, index);
                  }}
                  items={statusList}
                >
                  {statusDropdownName(item.status)}
                </UIPrimaryDropdown>
              </td>
              <td className="py-2 px-4">
                {item.payment_method?.name_ar ?? "-"}
              </td>
              <td className="py-2 px-4">
                <div className="w-10 h-10 overflow-hidden">
                  <img
                    src={item.payment_method.image}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </td>

              <td className="">
                <div className="flex justify-center gap-3">
                  <UIDialogConfirm
                    danger
                    title="هل انت متأكد من حذف العنصر"
                    confirmHandler={() => {
                      deleteSubmit(item, index);
                    }}
                  >
                    <button className="bg-[#F9285A0A] p-1 px-2 rounded-lg">
                      <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                    </button>
                  </UIDialogConfirm>
                  {/* <button className="bg-green-100 p-1 px-2 rounded-lg">
                                        <span className="mdi mdi-download text-green-600"></span>
                                    </button> */}
                </div>
              </td>
            </tr>
          ))}
        </BaseDataTable>
      </div>
    </>
  );
}
