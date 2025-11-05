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
import { successDialog, validateAllInputs } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { Payment } from "@/types/payment.interface";
import FileInput from "@/components/ui/form/FileInput";
import * as Yup from "yup"

import {
  addPaymentService,
  deletePaymentService,
  getPaymentsService,
  updatePaymentService,
} from "@/services/paymentsService";
import { updateSubscriptionStatusService } from "@/services/subscriptionService";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { paymentMethodListService } from "@/services/sharedService";
import FileInputImg from "@/components/ui/form/FileInputImg";

import { Category } from "@/types/categories.interface";
import { getCategoriesService } from "@/services/categoriesService";
import { getPackageByIdService, getPackagesService } from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { RadioGroup } from "@headlessui/react";
import ComboBoxNehal from "@/components/ui/form/ComboBoxNehal";
import { User } from "@/types/auth.interface";
import { getUserByIdService, getUserService } from "@/services/userService";
import { AppUser } from "@/types/user.interface";

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Payment[]>([]);
  const [paymentMethodList, setPaymentMethodList] = useState<Payment_methods[]>(
    []
  );
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم المستخدم", name: "name_ar" },
    { text: " اسم الباقة", name: "name_ar" },
    { text: " عدد الوحدات", name: "name_ar" },
    { text: " السعر الكلي", name: "name_ar" },
    { text: " تمت الاضافة بواسطة", name: "added_by" },
    { text: " نوع الدفع", name: "type" },
    { text: " تاريخ الدفع", name: "name_ar" },
    { text: "الحالة", name: "is_active" },
    { text: "طريقة الدفع", name: "is_active" },
    { text: "صورة التحويل", name: "image" },
    { text: "الاجراءات", name: "image" },
  ];
  const statusList = [

    { is_active: "pending", name: "قيد الانتظار" },
    { is_active: "accepted", name: "مقبولة" },
    { is_active: "rejected", name: "مرفوضة" },
  ];

  const status = [
    { status: "pending", name: "قيد الانتظار" },
    { status: "accepted", name: "مقبولة" },
    { status: "rejected", name: "مرفوضة" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [districtDays, setDistrictDays] = useState<string[]>([]);
  const [districtTime, setDistrictTime] = useState<string[]>([]);
  const [selectedDataItem, setSelectedDataItem] = useState<Payment | null>(
    null
  );


  const [userList, setUserList] = useState<AppUser[]>([])


  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
  const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);

  const [isOpenImg, setIsOpenImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);

  const [selected, setSelected] = useState<null | Payment_methods>(null);


  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");


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
  const [addPaymentFormData, setAddPaymentFormData] = useState({
    user_id: null,
    receiving_number: 0,
    total_price: 0,
    payment_method_id: 0,
    payment_verification: ''

  })
  const [updateFormData, setUpdateFormData] = useState({
    status: "",
    total_price: "",
    receiving_number: "",
    payment_method_id: 0,
    user_id: null,
    payment_verification: null,
  });

  const [userItem, setUserItem] = useState<AppUser | null>(null)


  const fetchPaymentMethodList = () => {
    paymentMethodListService().then((response) => {
      console.log("payment list", response);
      setPaymentMethodList(response.data);
    });
  };


  const [districtAvailableDays, setDistrictAvailableDays] = useState([
    { title: 'السبت ', slug: 'saturday' },
    { title: ' الاحد', slug: 'sunday' },
    { title: 'الاتنين ', slug: 'monday' },
    { title: 'الثلاثاء ', slug: 'tuesday' },
    { title: 'الاربعاء ', slug: 'wednesday' },
    { title: 'الخميس ', slug: 'thursday' },
    { title: 'الجمعه ', slug: 'friday' },

  ]);


  const fetchCategories = () => {
    getCategoriesService().then((response) => {
      setCategoryList(response.data);
    });
  };

  const fetchPackages = () => {
    getPackagesService().then((response) => {
      console.log(response);
      setpackagesList(response.data);
    });
  };

  const handleSelectPackage = (value: any) => {
    setAddPaymentFormData((prev) => ({
      ...prev,
      ["package_id"]: value,
    }));
    getPackageByIdService(value).then((response) => {
      setPackageItem(response.data);

    });
  };


  const [errorMsg, setErrorMsg] = useState("");


  const handleSelecteditem = (item: any) => {
    console.log("itemssssss", item);
    setSelected(item);
    setAddPaymentFormData((prev) => ({
      ...prev,
      ["payment_method_id"]: item.id,
    }));


  };











  const fetchDataList = ({
    search = searchTerm,
    is_active = statusFilter,
    pageNum = page

  }: { search?: string; is_active?: string | undefined; pageNum?: number } = {}) => {
    console.log(is_active);
    const isActive = is_active ? "&status=" + is_active : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}`;

    getPaymentsService(query)
      .then((response) => {
        //@ts-ignore
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => { });

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


  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    fetchDataList({ search: val, pageNum: 1 });
  };
  const handleActiveFilter = (value: string | undefined) => {
    setPage(1)
    setStatusFilter(value)
    fetchDataList({ is_active: value, pageNum: 1 });


  }
  const updateDataItemActive = (value: any, index: number, item: Payment) => {
    const service = dataList.find((item, i) => {
      return index == i;
    });

    if (!service) return;

    const body = JSON.stringify({
      status: value,
    });


    if (value == "accepted" && item.added_by == 'admin') {
      return
      // setSubscriptionStatus(item, "accept");
    }
    // if (value == "pending") {
    //   // setSubscriptionStatus(item, "pending");
    // }
    // if (value == "reject") {
    //   return
    //   // setSubscriptionStatus(item, "reject");
    // }

    if (item.added_by == 'user') {
      updatePaymentService(service.id, body)
        .then((response) => {
          const arr = [...dataList];
          arr[index].status = value;

          setDataList(arr);

          // console.log(value);

          if (value === "accepted") {
            setSubscriptionStatus(item, "accept");
          }
          if (value === "rejected") {
            setSubscriptionStatus(item, "reject");
          }
        })
        .catch((error) => { });

    }



  };
  const setSubscriptionStatus = (
    payment: Payment,
    status: "reject" | "accept" | "pending"
  ) => {
    if (!payment.subscription?.id) return;

    updateSubscriptionStatusService(payment.subscription.id, status)
      .then((response) => { })
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

  const updateDataItem = (item: Payment) => {
    setSelectedDataItem(item);
    // console.log('payment recieved number', item.receiving_number)

    setUpdateFormData({
      status: item.status,
      total_price: item.total_price.toString(),
      receiving_number: item.receiving_number,
      payment_method_id: item.payment_method.id,
      user_id: item.user_id || null,
      //@ts-ignore
      payment_verification: null,
    });
  };

  const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDataItem) return;

    const body = JSON.stringify({
      ...updateFormData,
    });

    updatePaymentService(selectedDataItem.id, body)
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
    setErrorMsg('')
    const fd = new FormData();
    fd.append("name_ar", formData.name_ar);
    fd.append("name_en", formData.name_en);
    fd.append("order", formData.order.toString());
    formData.available_days.forEach((day, index) =>
      fd.append(`available_days[${index}]`, day)
    );
    formData.available_days.forEach((time, index) =>
      fd.append(`available_times[${index}]`, time)
    );
    fd.append("is_active", formData.is_active.toString());

    addPaymentService(fd)
      .then((response) => {
        fetchDataList();
        //@ts-ignore
        successDialog(true);
        setFormData({
          name_ar: "",
          name_en: "",
          order: 0,
          is_active: 0,
          available_days: [],
          available_times: [],
        });
      })
      .catch((error) => {
        setErrorMsg(error?.message)
      });
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

  const handleOpenImage = (e: any) => {
    // console.log('image is', e.target.src)
    setSelectedImg(e.target.src);
    setIsOpenImg(true);
  };

  const takeValue = (e: any, name: any) => {
    console.log('name is', name)
    console.log(e.target.value);
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    if (name == "units") {
      if (packageItem) {
        //@ts-ignore
        setTotalPrice(selectedPackage.price_per_unit * addPaymentFormData.units);
      }
    }
  };







  const resetForm = () => {
    setAddPaymentFormData({
      user_id: null,
      receiving_number: 0,
      total_price: 0,
      payment_method_id: 0,
      payment_verification: ''

    })

    setUserItem(null)

  }


  const formSchema = Yup.object().shape({
    user_id: Yup.string().required(' المستخدم مطلوب'),
    // payment_method_id: Yup.string().required('طريقه الدفع مطلوبه'),
    total_price: Yup.string().required('اجمالي السعر مطلوب'),
    receiving_number: Yup.string().required('رقم الهاتف مطلوب'),
    payment_verification: Yup.string().required('صورة التحويل مطلوب'),
  })

  interface FormDataInputErrors {
    user_id: string | null,
    // payment_method_id: string | null,
    total_price: string | null,
    receiving_number: string | null,
    payment_verification: string | null


  }

  const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
    user_id: "",
    // payment_method_id: "",
    total_price: "",
    receiving_number: "",
    payment_verification: ""

  });

  const handleAddPayment = async (e: any) => {
    e.preventDefault()


    const validateResult = await validateAllInputs(
      formSchema,
      addPaymentFormData
    );
    if (!validateResult) return;

    setFormErrors({ ...validateResult.outputResult });

    if (validateResult.isInvalid) return;
    console.log('hii')
    setErrorMsg('')
    const fd = new FormData()
    //@ts-ignore
    fd.append('user_id', addPaymentFormData.user_id.toString())
    fd.append('receiving_number', userItem ? userItem.phone : '')
    fd.append('payment_method_id', addPaymentFormData.payment_method_id.toString())
    //@ts-ignore
    fd.append('total_price', userItem ? userItem.deserved_money_by_recycle : 0)
    fd.append('payment_verification', addPaymentFormData.payment_verification)
    setIsDialogOpen(false)
    await addPaymentService(fd).then((response) => {
      setIsDialogOpen(true)
      successDialog(true)
      fetchDataList()
      setAddPaymentFormData({
        user_id: null,
        receiving_number: 0,
        total_price: 0,
        payment_method_id: 0,
        payment_verification: ''
      })
      console.log('response of payment is', response.data)
    }).catch((error) => {
      setErrorMsg(error?.message)
      setIsDialogOpen(false)
    })

  }
  const takeUploadedImg = (img: any) => {
    console.log('img', img)
    setAddPaymentFormData((prev) => ({
      ...prev,
      ['payment_verification']: img.file

    }))

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
  const takeInputValue = (text: string) => {

    if (!text) {
      setUserItem(null)
    }

    fetchUserList({ search: text })




  }

  useEffect(() => {
    fetchPaymentMethodList();
    fetchCategories()
    fetchPackages()
    fetchUserList()

  }, [])

  // useEffect(() => {
  //   if (userItem) {
  //     setTotalPrice(Number(userItem.deserved_money_by_recycle))
  //   }

  const [isDialogOpen, setIsDialogOpen] = useState(false)


  // }, [userItem])

  const tableHeadActionsSlot = () => {
    return (
      <>

        <UIBaseDialog
          dismiss={isDialogOpen}
          confirmCloseHandler={resetForm}
          title="اضافة تحويل"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button className="bg-[#0094140D] p-1 rounded-lg">
                تحويل رصيد
              </button>
            </div>
          }
        >
          <div>
            <form onSubmit={(e) => handleAddPayment(e)} id="update-form" className="">

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
                  <ComboBoxNehal errorMessage={formErrors.user_id || ''} onQueryChange={takeInputValue} onChange={(e) => handleSelectedUser(e)} listItem={userList} itemName="name" itemValue="id" value={(addPaymentFormData.user_id ?? "").toString()} label="اسم المستخدم" />
                </div>
                <div className="col-span-12">
                  <TextFieldNada errorMessage={formErrors.receiving_number || ''}
                    disabled
                    name="receiving_number"
                    type="number"
                    handleChange={(e) =>
                      takeValue(e, "receiving_number")
                    }
                    value={userItem ? userItem.phone : addPaymentFormData.receiving_number}
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
                    errorMessage={formErrors.total_price || ''}

                  ></TextFieldNada>
                </div>



                <div className="col-span-6">
                  <TextFieldNada
                    disabled
                    name="all_recycle_weights"
                    type="number"

                    value={userItem?.all_recycle_weights ?? 0}
                    label="الوزن "
                    placeholder=" ادخل الوزن"
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

                                    </div>
                                  ) : (
                                    <div className="shrink-0 w-4 h-4 rounded-full ring-1 ring-surface text-surface flex justify-center items-center">

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
                    errorMessage={formErrors.payment_verification || ''}
                  />
                </div>







              </div>
            </form >

          </div>



        </UIBaseDialog>


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



      </>
    );
  };




  useEffect(() => {
    fetchDataList();
  }, [page]); // runs every time `page` changes

  return (
    <>
      <div className="py-20 relative ">
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
              <td className="py-2 px-4">{item.subscription?.package.name}</td>
              <td className="py-2 px-4">{item.subscription?.units ?? "-"}</td>
              <td className="py-2 px-4">{item.total_price}</td>
              <td className="py-2 px-4">{item.added_by == "user" ? 'مستخدم' : 'مسئول'}</td>
              <td className="py-2 px-4">{item.type}</td>

              <td className="py-2 px-4">{item.created_at}</td>
              <td className="py-2 px-4">
                {item.added_by == 'user' ? <UIPrimaryDropdown
                  tiny={true}
                  itemName="name"
                  itemValue="is_active"
                  btnColorTailwindClass={statusDropdownColor(item.status)}
                  onSelected={(value) => {
                    updateDataItemActive(value, index, item);
                  }}
                  items={statusList}
                >
                  {statusDropdownName(item.status)}
                </UIPrimaryDropdown> : <span>-</span>}

              </td>
              {/* <td className="py-2 px-4">
                                {item.subscription?.package.name ?? '-'}
                            </td> */}
              {/* <td className="py-2 px-4">
                                {item.payment_method?.name_ar ?? "-"}
                            </td> */}
              <td className="py-2 px-4">
                <div className="w-10 h-10 overflow-hidden ">
                  <img
                    src={item.payment_method.image}
                    alt=""
                    className="w-full h-full object-contain "
                  />
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="w-10 h-10 overflow-hidden cursor-pointer">
                  <img
                    onClick={(item) => handleOpenImage(item)}
                    src={item.payment_verification}
                    alt=""
                    className="w-full h-full object-contain cursor-pointer"
                  />
                </div>
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
                    <button className="bg-[#F9285A0A] p-1 px-2 rounded-lg">
                      <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                    </button>
                  </UIDialogConfirm>

                  <UIBaseDialog
                    title="تعديل المدفوعات"
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
                            fileUrl={item.payment_verification}
                            onFileChange={(arg) => {
                              //@ts-ignore
                              setUpdateFormData((prev) => ({
                                ...prev,
                                ["payment_verification"]: arg?.file64 ?? null,
                              }));
                            }}
                          ></FileInputImg>
                        </div>

                        <TextFieldNada
                          name="total_price"
                          type="number"
                          prependIcon="mdi mdi-notebook-edit-outline"
                          iconType="mdi"
                          handleChange={updateFormChangeHander}
                          value={updateFormData.total_price}
                          label="السعر الكلي "
                          placeholder="ادخل السعر الكلي  "
                        ></TextFieldNada>

                        <SelectInput
                          value={updateFormData.status}
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
                              ["status"]: value,
                            }));
                          }}
                        ></SelectInput>

                        <SelectInput
                          value={updateFormData.payment_method_id}
                          items={paymentMethodList}
                          itemName="name_ar"
                          itemValue="id"
                          label="طريقة الدفع"
                          placeholder=""
                          name="is_active"
                          required={true}
                          onChange={(value) => {
                            setUpdateFormData((prev) => ({
                              ...prev,
                              ["payment_method_id"]: value,
                            }));
                          }}
                        ></SelectInput>
                      </div>
                    </form>
                  </UIBaseDialog>

                  {/* {!!item.payment_verification && (
                                        <a
                                            href={item.payment_verification}
                                            target="_blank"
                                            className="bg-green-100 p-1 px-2 rounded-lg"
                                        >
                                            <span className="mdi mdi-download text-green-600"></span>
                                        </a>
                                    )} */}
                </div>
              </td>



            </tr>
          ))}
        </BaseDataTable>

        {isOpenImg && (
          <div onClick={() => setIsOpenImg(false)} className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center py-10 z-50 ">
            <div className="relative bg-transparent max-w-full max-h-full ">
              <img
                className="w-full h-full object-contain"
                src={selectedImg}
                alt=""
              />

              <button
                onClick={() => setIsOpenImg(false)}
                className="absolute top-3 right-5 text-white bg-[#009414] rounded-full p-1 transition"
                aria-label="Close image overlay"
              >
                <span className="mdi mdi-close text-xl"></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
