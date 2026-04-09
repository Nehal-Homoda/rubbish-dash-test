"use client";
import React, { useEffect, useState } from "react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
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
import { getUserByIdService, getUserService } from "@/services/userService";

type Props = {
  user: Users;
};
type FormDataType = {
  name_ar: string;
  name_en: string;
  order: number;
  is_active: number;
  available_days: string[];
  available_times: string[];
};

export default function rubbush_collectors({ user }: Props) {
  const [dataList, setDataList] = useState<Payment[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم المستخدم", name: "user_name" },
    { text: " رقم الاستلام", name: "receiving_number" },
    { text: " السعر الكلي", name: "total_price" },
    { text: " تاريخ الدفع", name: "name_ar" },
    { text: "الحالة", name: "status" },
    { text: " اسم طريقة الدفع", name: "payment_method_name" },
    { text: "طريقة الدفع", name: "payment_method_image" },
    { text: "صورة التحويل", name: "payment_verification" },
    { text: "الاجراءات", name: "procedures" },
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
  const [userList, setUserList] = useState<AppUser[]>([])
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
  const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(
    null
  );
  const [selected, setSelected] = useState<null | Payment_methods>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodList, setPaymentMethodList] = useState<
    Payment_methods[]
  >([]);
  const [userItem, setUserItem] = useState<AppUser | null>(null)
  const [addPaymentFormData, setAddPaymentFormData] = useState({
    user_id: 0,
    receiving_number: 0,
    total_price: 0,
    payment_method_id: 0,
    payment_verification: ''
  })
  const [formData, setFormData] = useState({
    category_id: 0,
    package_id: 0,
    units: 1,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState("");
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

  const takeValue = (e: any, name: any) => {
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

  const handleSelecteditem = (item: any, name: string) => {
    console.log("itemssssss", item);
    setSelected(item);
    if (name == 'addPaymentForm') {
      setFormData((prev) => ({
        ...prev,
        ["payment_method_id"]: item.id,
      }));
    }
    if (name == 'addFundForm') {
      setAddPaymentFormData((prev) => ({
        ...prev,
        ["payment_method_id"]: item.id,
      }));
    }


    // console.log(e.target.value)
  };
  const fetchUserList = ({
    search = searchTerm,
    is_active = statusFilter,
    pageNum = page

  }: { search?: string; is_active?: string | undefined; pageNum?: number } = {}) => {
    console.log(is_active);
    const isActive = is_active ? "&status=" + is_active : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}`;


    getUserService(query).then((response) => {
      setUserList(response.data)
    }).catch(() => {

    })


  };
  const takeInputValue = (text: string) => {
    if (!text) {
      setUserItem(null)
    }
    fetchUserList({ search: text })



  }

  const handleSelectedUser = (selectedId: any) => {
    console.log('selected isssssssssssssssss', selectedId)
    fetchDataList({ search: selectedId })
    setAddPaymentFormData((prev) => ({
      ...prev,
      ['user_id']: selectedId
    }))

    getUserByIdService(selectedId).then((response) => {
      console.log('response is', response)
      setUserItem(response.data)
    })

  }
  const handleAddFund = async (e: any) => {
    e.preventDefault()
    console.log('hii')

    const fd = new FormData()
    fd.append('user_id', addPaymentFormData.user_id.toString())
    fd.append('receiving_number', userItem ? userItem.phone : '')
    fd.append('payment_method_id', addPaymentFormData.payment_method_id.toString())
    //@ts-ignore
    fd.append('total_price', userItem ? userItem.deserved_money_by_recycle : 0)
    fd.append('payment_verification', addPaymentFormData.payment_verification)
    setErrorMsg('')
    setIsDialogOpen(false)
    await addPaymentService(fd).then((response) => {
      setIsDialogOpen(true)
      successDialog(true)
      fetchDataList()
      console.log('response of payment is', response.data)
    }).catch((error) => {
      setIsDialogOpen(false)
      setErrorMsg(error?.message)
    })
  }
  const handleClose = () => {
    setUserItem(null)
  }

  const takeUploadedImg = (img: any) => {
    console.log(img);
  };

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIBaseDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="اضافة تحويل"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button onClick={() => setIsDialogOpen(true)} className="bg-[#0094140D] p-1 rounded-lg">
                تحويل رصيد
              </button>
            </div>
          }
        >
          <div>
            <form onSubmit={(e) => handleAddFund(e)} id="update-form" className="">

              {errorMsg && (
                <div className="mb-6 text-start border border-red-800 bg-red-100 px-3 py-3 rounded-lg">
                  <span className="text-red-800 error-alert">
                    {" "}
                    {errorMsg}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-12 space-y-5 gap-7">

                <div className="col-span-12">
                  {/* @ts-ignore */}
                  <ComboBoxNehal onQueryChange={takeInputValue} onChange={(e) => handleSelectedUser(e)} listItem={userList} itemName="name" itemValue="id" value={(addPaymentFormData.user_id ?? "").toString()} label="اسم المستخدم" />

                </div>
                <div className="col-span-12">
                  <TextFieldNada
                    disabled
                    name="receiving_number"
                    type="number"
                    handleChange={(e) =>
                      takeValue(e, "receiving_number")
                    }
                    value={userItem?.phone ?? ""}
                    label="رقم الاستلام"
                    placeholder="رقم الاستلام"
                  ></TextFieldNada>
                </div>


                <div className="col-span-6">
                  <TextFieldNada
                    disabled
                    name="deserved_money_by_recycle"
                    type="number"
                    handleChange={(e) =>
                      takeValue(e, "deserved_money_by_recycle")
                    }
                    value={userItem?.deserved_money_by_recycle ?? 0}
                    label="الرصيد "
                    placeholder=" ادخل الرصيد"
                  ></TextFieldNada>
                </div>



                <div className="col-span-6">
                  <TextFieldNada
                    disabled
                    name="all_recycle_weights"
                    type="number"
                    // handleChange={(e) =>
                    //   takeValue(e, "units")
                    // }
                    value={userItem?.all_recycle_weights ?? 0}
                    label="الوزن "
                    placeholder=" ادخل الوزن"
                  ></TextFieldNada>
                </div>



                <div className="col-span-12">
                  <RadioGroup
                    value={selected}
                    onChange={(e) =>
                      handleSelecteditem(e, 'addFundForm')
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
          </div>



        </UIBaseDialog>
      </>
    );
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




  useEffect(() => {
    fetchDataList();
  }, [page]); // runs every time `page` changes


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
            payment_method_image: (item, index: number) => (
              <div className="w-12 h-12 max-h-[30px] bg-gray-50 rounded-md">
                <img
                  src={item.payment_method.image}
                  className="w-full h-full object-contain"
                />
              </div>
            ),
            payment_verification: (item, index: number) => (
              <div className="w-12 h-12 max-h-[30px] bg-gray-50 rounded-md">
                <img
                  src={item.payment_verification}
                  className="w-full h-full object-contain"
                />
              </div>
            ),
            payment_method_name: (item, index: number) => (
              item.payment_method.name_ar
            ),
            is_active: (item, index: number) => (
              <UIPrimaryDropdown
                tiny
                itemName="name"
                itemValue="is_active"
                btnColorTailwindClass={statusDropdownColor(item.status)}
                items={statusList}
                onSelected={(value) => updateDataItemActive(value, index)}
              >
                {statusDropdownName(item.status)}
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

              </div>
            ),


          }}
        >

        </BaseDataTable>
      </div>
    </>
  );
}
