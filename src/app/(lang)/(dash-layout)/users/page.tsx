


"use client";
import React, { useEffect, useState } from "react";
import { Checkbox, Label } from "flowbite-react";
import { Radio } from "flowbite-react";
import trashImg from '@/assets/images/icons/trash.png'
import editImg from '@/assets/images/icons/edit.png'
import eyeImg from '@/assets/images/icons/eye.png'
import {
  addUserService,
  getUserService,
  deleteUserService,
  updateUserService,
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

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Users[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: "اسم المستخدم", name: "name" },
    { text: "رقم الموبيل", name: "phone" },
    { text: " الاشتراك", name: "has_subscription" },
    { text: "نوع الاشتراك", name: "subscription_name" },
    // { text: "الصورة الشخصية", name: "image" },
    { text: "الحالة", name: "is_active" },
    { text: "ميعاد التجديد", name: "renewal_date" },
    { text: "الاجراءات", name: "" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];
  const hasSubscriptionList = [
    { is_subscribe: 1, name: "مشترك" },
    { is_subscribe: 0, name: "غير مشترك" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<Users | null>(
    null
  );

  const [subscriptionList, setSubscriptionList] = useState<PackageOffer[]>([]);
  type FormDataType = {
    name: "",
    phone: "",
    is_active: 0,

  };
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

  const fetchDataList = ({
    search = "",
    is_active = undefined,
    is_subscription = undefined,
  }: { search?: string; is_active?: boolean | undefined; is_subscription?: boolean | undefined; } = {}) => {
    console.log(is_active);
    const isActive = is_active != undefined ? is_active ? "&is_active=" + 1 : "&is_active=" + 0 : "";



    const isSubscribe =
      is_subscription != undefined
        ? is_subscription
          ? "&is_subscription=" + 1
          : "&is_subscription=" + 0
        : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?${page}${hasSearch}${isActive}${isSubscribe}`;
    

    getUserService(query).then((response) => {
      //@ts-ignore
      setDataList(response.data);
      // response.data.map((item, index) => {
      //   setDistrictDays(item.available_days);
      //   setDistrictTime(item.available_times);
      // });
      setTotalPages(response.meta.last_page);
    });
  };
  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
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






  const tableHeadActionsSlot = () => {
    return (
      <>





        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...statusList]}
          itemName="name"
          itemValue="is_active"
          onSelected={(value) => {
            fetchDataList({ is_active: value });
          }}
        >
          الحالة
        </UIPrimaryDropdown>

        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...hasSubscriptionList]}
          itemName="name"
          itemValue="is_subscribe"
          onSelected={(value) => {
            fetchDataList({ is_subscription: value });
          }}
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
















