


"use client";
import React, { useEffect, useState } from "react";
import { Checkbox, Label } from "flowbite-react";
import { Radio } from "flowbite-react";
import trashImg from '@/assets/images/icons/trash.png'
import editImg from '@/assets/images/icons/edit.png'
import eyeImg from '@/assets/images/icons/eye.png'
import { useSearchParams } from 'next/navigation'
import {
  addUserService,
  getUserService,
  deleteUserService,
  updateUserService,
  getUserByIdService,
} from "@/services/userService";

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
import { useRouter } from "next/navigation";
import { User, Users } from "@/types/auth.interface";
import { PackageOffer } from "@/types/packagesOffer.interface";
import ComboBoxNehal from "@/components/ui/form/ComboBoxNehal";
import { RadioGroup } from "@headlessui/react";
import { addPaymentService } from "@/services/paymentService";
import { AppUser } from "@/types/user.interface";
import { Payment_methods } from "@/types/paymentMethod.interface";

import FileInput from "@/components/ui/form/FileInput";
import { paymentMethodListService } from "@/services/sharedService";
import { getPackagesService } from "@/services/packagesOffersService";

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Users[]>([]);
  const searchParams = useSearchParams()
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const filterWith = searchParams.get('is_request_recycle')
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);


  console.log('filter is with', filterWith)
  const headerArr = [
    { text: "ID", name: "id" },
    { text: "اسم المستخدم", name: "name" },
    { text: "رقم الموبيل", name: "phone" },
    { text: " الاشتراك", name: "has_subscription" },
    { text: "نوع الاشتراك", name: "subscription_name" },
    // { text: "الصورة الشخصية", name: "image" },
    { text: "نوع الطلب", name: "is_request_recycle" },
    { text: "الحالة", name: "is_active" },
    { text: "ميعاد التجديد", name: "renewal_date" },
    { text: "الاجراءات", name: "" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];

  const requestTypeList = [{ is_request_recycle: 1, name: "جمع وتدوير" },
  { is_request_recycle: 0, name: "جمع" },]


  const hasSubscriptionList = [
    { is_subscribe: 1, name: "مشترك" },
    { is_subscribe: 0, name: "غير مشترك" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<Users | null>(
    null
  );

  // const takeUploadedImg = (img: any) => {
  //   console.log('img', img)
  //   setAddPaymentFormData((prev) => ({
  //     ...prev,
  //     ['payment_verification']: img.file

  //   }))

  // }

  const fetchPaymentMethodList = () => {
    paymentMethodListService().then((response) => {
      console.log("payment list", response);
      setPaymentMethodList(response.data);
    });
  };

  const [subscriptionList, setSubscriptionList] = useState<PackageOffer[]>([]);
  const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);


  type FormDataType = {
    name: "",
    phone: "",
    is_active: 0,

  };

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [subscriptionFilter, setSubscriptionFilter] = useState<boolean | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<boolean | undefined>(undefined);
  const [userList, setUserList] = useState<AppUser[]>([])
  const [userItem, setUserItem] = useState<AppUser | null>(null)
  const [selected, setSelected] = useState<null | Payment_methods>(null);
  const [paymentMethodList, setPaymentMethodList] = useState<Payment_methods[]>(
    []
  );



  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    phone: "",
    is_active: 0,
  });

  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    phone: "",
    is_active: 0,
  });

  const router = useRouter()
  const [addPaymentFormData, setAddPaymentFormData] = useState({
    user_id: 0,
    receiving_number: 0,
    total_price: 0,
    payment_method_id: 0,
    payment_verification: ''

  })

  // const fetchDataList = ({
  //   search = "",
  //   is_active = undefined,
  //   is_subscription = undefined,

  // }: { search?: string; is_active?: boolean | undefined; is_subscription?: boolean | undefined; } = {}) => {
  //   console.log(is_active);
  //   const isActive = is_active != undefined ? is_active ? "&is_active=" + 1 : "&is_active=" + 0 : "";



  //   const isSubscribe =
  //     is_subscription != undefined
  //       ? is_subscription
  //         ? "&is_subscription=" + 1
  //         : "&is_subscription=" + 0
  //       : "";
  //   const hasSearch = search ? "&search=" + search : "";

  //   // const query = `?${page}${hasSearch}${isActive}${isSubscribe}`;

  //   // const hasPagination = page ? "page=" + page : ""
  //   // const query = hasPagination ? `?${hasPagination}` : `?${hasSearch}${isActive}${isSubscribe}`;
  //   const query = `?page=${page}${hasSearch}${isActive}${isSubscribe}`;

  //   getUserService(query).then((response) => {
  //     //@ts-ignore
  //     setDataList(response.data);
  //     // response.data.map((item, index) => {
  //     //   setDistrictDays(item.available_days);
  //     //   setDistrictTime(item.available_times);
  //     // });
  //     setTotalPages(response.meta.last_page);
  //   });
  // };


  const fetchDataList = ({
    search = searchTerm,
    is_active = activeFilter,
    is_subscription = subscriptionFilter,
    is_request_recycle = typeFilter,
    pageNum = page,
  }: {
    search?: string;
    is_active?: boolean | undefined;
    is_subscription?: boolean | undefined;
    is_request_recycle?: boolean | undefined;
    pageNum?: number;
  } = {}) => {
    const isActive = is_active != undefined ? "&is_active=" + (is_active ? 1 : 0) : "";
    const isSubscribe = is_subscription != undefined ? "&is_subscription=" + (is_subscription ? 1 : 0) : "";
    const isRecycle = is_request_recycle != undefined ? "&is_request_recycle=" + (is_request_recycle ? 1 : 0) : "";

    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}${isSubscribe}${isRecycle}`;

    getUserService(query).then((response) => {
      //@ts-ignore
      setDataList(response.data);
      setTotalPages(response.meta.last_page);
    });
  };




  // const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value)
  //   fetchDataList({ search: e.target.value });
  // };



  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    fetchDataList({ search: val, pageNum: 1 });
  };

  const handleActiveFilter = (value: boolean | undefined) => {
    setActiveFilter(value);
    setPage(1);
    fetchDataList({ is_active: value, pageNum: 1 });
  };
  const handleTypeFilter = (value: boolean | undefined) => {
    setTypeFilter(value);
    setPage(1);
    fetchDataList({ is_request_recycle: value, pageNum: 1 });
  };

  const handleSubscriptionFilter = (value: boolean | undefined) => {
    setSubscriptionFilter(value);
    setPage(1);
    fetchDataList({ is_subscription: value, pageNum: 1 });
  };


  const updateDataItemActive = (value: any, index: number) => {
    const service = dataList.find((item, i) => {
      return index == i;
    });

    if (!service) return;

    const body = JSON.stringify({
      is_active: value,
    });

    updateUserService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].is_active = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => { });
  };

  const deleteSubmit = (item: District, selectedIndex: number) => {
    deleteUserService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => { });
  };


  // const handleAddPayment = async (e: any) => {
  //   e.preventDefault()
  //   console.log('hii')

  //   const fd = new FormData()
  //   fd.append('user_id', addPaymentFormData.user_id.toString())
  //   fd.append('receiving_number', userItem ? userItem.phone : '')
  //   fd.append('payment_method_id', addPaymentFormData.payment_method_id.toString())
  //   //@ts-ignore
  //   fd.append('total_price', userItem ? userItem.deserved_money_by_recycle : 0)
  //   fd.append('payment_verification', addPaymentFormData.payment_verification)
  //   await addPaymentService(fd).then((response) => {
  //     successDialog(true)
  //     fetchDataList()
  //     console.log('response of payment is', response.data)
  //   })

  // }

  // const updateUserItem = (item: Users) => {
  //   setSelectedDataItem(item);
  //   setUpdateFormData({
  //     name: item.name,
  //     phone: item.phone,
  //     is_active: item.is_active ? 1 : 0,
  //   });
  // };

  // const updateFormChangeHander = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index?: number
  // ) => {
  //   setUpdateFormData((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));

  //   console.log(e.target.name, e.target.value);
  // };

  // const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!selectedDataItem) return;

  //   const body = JSON.stringify({
  //     ...updateFormData,
  //   });

  //   updateUserService(selectedDataItem.id, body)
  //     .then((response) => {
  //       console.log('yesssss updated')
  //       fetchDataList();
  //       successDialog(true);
  //     })
  //     .catch((error) => { });
  // };



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


  const handleSelecteditem = (item: any) => {
    console.log("itemssssss", item);
    setSelected(item);
    setAddPaymentFormData((prev) => ({
      ...prev,
      ["payment_method_id"]: item.id,
    }));


  };

  const fetchPackages = () => {
    getPackagesService().then((response) => {
      setpackagesList(response.data);
    });
  };

  useEffect(() => {
    fetchPaymentMethodList();
    // fetchCategories()
    fetchPackages()
    fetchUserList()

  }, [])




  const tableHeadActionsSlot = () => {
    return (
      <>





        <UIPrimaryDropdown
          items={[{ is_request_recycle: undefined, name: "الكل" }, ...requestTypeList]}
          itemName="name"
          itemValue="is_request_recycle"
          // onSelected={(value) => {
          //   fetchDataList({ is_active: value });
          // }}
          onSelected={handleTypeFilter}
        >
          نوع الطلب
        </UIPrimaryDropdown>


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

        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...hasSubscriptionList]}
          itemName="name"
          itemValue="is_subscribe"
          // onSelected={(value) => {
          //   fetchDataList({ is_subscription: value });
          // }}
          onSelected={handleSubscriptionFilter}
        >
          الاشتراك
        </UIPrimaryDropdown>


       


        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
          <button onClick={() => router.push('/users/add-user')} className="bg-[#0094140D] p-1 rounded-lg">
            اضافة مستخدم
          </button>
        </div>





      </>
    );
  };
  useEffect(() => {

    const filterWith = searchParams.get('is_request_recycle')
    console.log('filteration is', filterWith)
    if (filterWith !== null) {
      //@ts-ignore
      fetchDataList({ is_request_recycle: 1, pageNum: 1 });
    }
    else {
      fetchDataList()
    }
  }, [page, searchParams]); // runs every time `page` changes


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
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{item.phone}</td>



              <td className="py-2 px-4">
                <div className={` rounded-lg py-1 text-center ${item.has_subscription ? 'text-[#31D000] bg-[#31D00012] ' : ' bg-red-100 text-red-600 hover:bg-text-red-200'} `}>
                  <span> {item.has_subscription ? "مشترك" : "غير مشترك"}</span>
                </div>
              </td>

              <td className="py-2 px-4">{item.subscription_name}</td>
              {/* <td className="py-2 px-4">
                <div className=" w-7 h-7 rounded-full overflow-hidden">
                <img
                className="w-full h-full object-contain"
                src={item.image}
                alt=""
                />
                </div>
                </td> */}


              {/* <td className="py-2 px-4">{item.is_request_recycle ? 'جمع وتدوير' : 'جمع فقط'}</td> */}

              <td className="py-2 px-4">
                {!item.has_subscription
                  ? '-'
                  : item.is_request_recycle
                    ? 'جمع وتدوير'
                    : 'جمع فقط'}
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

              <td className="py-2 px-4">{item.renewal_date}</td>








              <td className="">
                <div className="flex justify-center items-center gap-3">
                  <UIDialogConfirm
                    danger
                    title="هل انت متأكد من حذف العنصر"
                    confirmHandler={() => {
                      //@ts-ignore
                      deleteSubmit(item, index);
                    }}
                  >
                    <button className="bg-[#F9285A0A] p-1 rounded-lg">
                      {/* <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span> */}
                      <div className="w-4 h-4">
                        <img className="w-full h-full object-contain" src={trashImg.src} alt="" />
                      </div>

                    </button>
                  </UIDialogConfirm>




                  {/* <UIBaseDialog
                    title="تعديل مستخدم"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                      <button
                        onClick={() => {
                          //@ts-ignore
                          updateUserItem(item);
                        }}
                        className="bg-[#0094140D] p-1 rounded-lg"
                      >
                        <div className="w-4 h-4">
                          <img className="w-full h-full object-contain" src={editImg.src} alt="" />
                        </div>


                      </button>
                    }
                  >
                    <form
                      onSubmit={updateSubmit}
                      id="update-form"
                    >
                      <div className="space-y-7">


                        <TextFieldNada
                          name="name"
                          type="text"
                          handleChange={
                            updateFormChangeHander
                          }
                          value={
                            updateFormData.name
                          }
                          label=" اسم المستخدم"
                          placeholder=" ادخل اسم المستخدم  "
                        ></TextFieldNada>


                        <TextFieldNada
                          name="phone"
                          type="number"
                          handleChange={
                            updateFormChangeHander
                          }
                          value={
                            updateFormData.phone
                          }
                          label=" رقم الموبايل"
                          placeholder="ادخل رقم الموبايل  "
                        ></TextFieldNada>





                        <SelectInput
                          value={
                            updateFormData.is_active
                          }
                          items={statusList}
                          itemName="name"
                          itemValue="is_active"
                          label="الحالة"
                          placeholder="لختر الحالة"
                          name="is_active"
                          required={true}
                          onChange={(value) => {
                            setUpdateFormData(
                              (prev) => ({
                                ...prev,
                                ["is_active"]:
                                  value,
                              })
                            );
                          }}
                        ></SelectInput>
                      </div>
                    </form>
                  </UIBaseDialog> */}




                  <div className="w-4 h-4 cursor-pointer" onClick={() => router.push(`/users/details?id=${item.id}`)}>
                    <img className="w-full h-full object-contain" src={editImg.src} alt="" />
                  </div>


                </div>
              </td>
            </tr>
          ))}
        </BaseDataTable>
      </div>
    </>
  );
}
















