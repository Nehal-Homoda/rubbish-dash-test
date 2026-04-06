"use client";
import React, { useEffect, useState } from "react";
import trashImg from "@/assets/images/icons/trash.png";
import editImg from "@/assets/images/icons/edit.png";
import { useSearchParams } from "next/navigation";
import {
  getUserService,
  deleteUserService,
  updateUserService,
} from "@/services/userService";

import { District } from "@/types/district.interface";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { useRouter } from "next/navigation";
import { Users } from "@/types/auth.interface";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { AppUser } from "@/types/user.interface";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { paymentMethodListService } from "@/services/sharedService";
import { getPackagesService } from "@/services/packagesOffersService";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { amiriFont } from '@/assets/fonts/Amiri-Regular-vfs.js'
// pdfMake.vfs = amiriFont;

pdfMake.fonts = {
  Amiri: {
    normal: "Amiri-Regular.ttf",
    bold: "Amiri-Regular.ttf",
    italics: "Amiri-Regular.ttf",
    bolditalics: "Amiri-Regular.ttf",
  },
};


export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Users[]>([]);
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const filterWith = searchParams.get("is_request_recycle");
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);

  console.log("filter is with", filterWith);
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
    { text: "الاجراءات", name: "procedures" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];

  const requestTypeList = [
    { is_request_recycle: 1, name: "جمع وتدوير" },
    { is_request_recycle: 0, name: "جمع" },
  ];

  const hasSubscriptionList = [
    { is_subscribe: 1, name: "مشترك" },
    { is_subscribe: 0, name: "غير مشترك" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<Users | null>(null);

  const fetchPaymentMethodList = () => {
    paymentMethodListService().then((response) => {
      console.log("payment list", response);
      setPaymentMethodList(response.data);
    });
  };
  type FormDataType = {
    name: "";
    phone: "";
    is_active: 0;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [subscriptionFilter, setSubscriptionFilter] = useState<
    boolean | undefined
  >(undefined);
  const [typeFilter, setTypeFilter] = useState<boolean | undefined>(undefined);
  const [userList, setUserList] = useState<AppUser[]>([]);
  const [userItem, setUserItem] = useState<AppUser | null>(null);
  const [selected, setSelected] = useState<null | Payment_methods>(null);
  const [paymentMethodList, setPaymentMethodList] = useState<Payment_methods[]>(
    [],
  );
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const router = useRouter();
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
    const isActive =
      is_active != undefined ? "&is_active=" + (is_active ? 1 : 0) : "";
    const isSubscribe =
      is_subscription != undefined
        ? "&is_subscription=" + (is_subscription ? 1 : 0)
        : "";
    const isRecycle =
      is_request_recycle != undefined
        ? "&is_request_recycle=" + (is_request_recycle ? 1 : 0)
        : "";

    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}${isSubscribe}${isRecycle}`;

    getUserService(query).then((response) => {
      //@ts-ignore
      setDataList(response.data);
      setTotalPages(response.meta.last_page);
    });
  };

  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    fetchDataList({ search: val, pageNum: 1 });
  };

  const handleActiveFilter = (value: boolean | undefined) => {
    // setActiveFilter(value);
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

  const fetchUserList = ({
    search = searchTerm,
    is_active = statusFilter,
    pageNum = page,
  }: {
    search?: string;
    is_active?: string | undefined;
    pageNum?: number;
  } = {}) => {
    console.log(is_active);
    const isActive = is_active ? "&status=" + is_active : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${pageNum}${hasSearch}${isActive}`;

    getUserService(query)
      .then((response) => {
        setUserList(response.data);
      })
      .catch(() => { });
  };
  const fetchPackages = () => {
    getPackagesService().then((response) => {
      setpackagesList(response.data);
    });
  };

  useEffect(() => {
    fetchPaymentMethodList();
    fetchPackages();
    fetchUserList();
  }, []);

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIPrimaryDropdown
          items={[
            { is_request_recycle: undefined, name: "الكل" },
            ...requestTypeList,
          ]}
          itemName="name"
          itemValue="is_request_recycle"
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
          items={[
            { is_active: undefined, name: "الكل" },
            ...hasSubscriptionList,
          ]}
          itemName="name"
          itemValue="is_subscribe"
          onSelected={handleSubscriptionFilter}
        >
          الاشتراك
        </UIPrimaryDropdown>

        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
          <button
            onClick={() => router.push("/users/add-user")}
            className="bg-[#0094140D] p-1 rounded-lg"
          >
            اضافة مستخدم
          </button>
        </div>

        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
          <button
            onClick={() => handleExport()}
            className="bg-[#0094140D] p-1 rounded-lg"
          >
            تصدير
          </button>
        </div>
      </>
    );
  };
  useEffect(() => {
    const filterWith = searchParams.get("is_request_recycle");
    console.log("filteration is", filterWith);
    if (filterWith !== null) {
      //@ts-ignore
      fetchDataList({ is_request_recycle: 1, pageNum: 1 });
    } else {
      fetchDataList();
    }
  }, [page, searchParams]);

  const handleExport = async () => {
  if (!checkedList.length) return;

  const pdfMakeModule = (await import("pdfmake/build/pdfmake")).default;
  const vfsModule = await import("@/vfs_fonts_amiri");

  const vfs = vfsModule.amiriFont || vfsModule.default;

  pdfMakeModule.vfs = vfs;

  pdfMakeModule.fonts = {
    Amiri: {
      normal: "Amiri-Regular.ttf",
      bold: "Amiri-Regular.ttf", // use same for now
      italics: "Amiri-Regular.ttf",
      bolditalics: "Amiri-Regular.ttf",
    },
  };

  console.log("VFS keys:", Object.keys(pdfMakeModule.vfs)); // must show font

  const docDefinition = {
    defaultStyle: { font: "Amiri", alignment: "right" },
    content: [
      { text: "اختبار عربي", alignment: "center" },
    ],
  };

  pdfMakeModule.createPdf(docDefinition).download("test.pdf");
};


  return (
    // <>
    //   <div className="py-20">
    //     <BaseDataTable
    //       headItems={headerArr}
    //       onPageChange={setPage}
    //       totalPages={totalPages}
    //       onSearchChange={tableSearchHandler}
    //       headerActionsSlot={tableHeadActionsSlot()}
    //       checkedList={checkedList}
    //       onChecked={setCheckedList}
    //     >
    //       {dataList.map((item, index) => (
    //         <tr key={index}>
    //           <td className="py-2 px-4">{item.id}</td>
    //           <td className="py-2 px-4">{item.name}</td>
    //           <td className="py-2 px-4">{item.phone}</td>
    //           <td className="py-2 px-4">
    //             <div className={` rounded-lg py-1 text-center ${item.has_subscription ? 'text-[#31D000] bg-[#31D00012] ' : ' bg-red-100 text-red-600 hover:bg-text-red-200'} `}>
    //               <span> {item.has_subscription ? "مشترك" : "غير مشترك"}</span>
    //             </div>
    //           </td>

    //           <td className="py-2 px-4">{item.subscription_name}</td>

    //           <td className="py-2 px-4">
    //             {!item.has_subscription
    //               ? '-'
    //               : item.is_request_recycle
    //                 ? 'جمع وتدوير'
    //                 : 'جمع فقط'}
    //           </td>

    //           <td className="py-2 px-4">
    //             <UIPrimaryDropdown
    //               tiny={true}
    //               itemName="name"
    //               itemValue="is_active"
    //               btnColorTailwindClass={
    //                 !item.is_active
    //                   ? "bg-red-100 text-red-600 hover:bg-text-red-200"
    //                   : undefined
    //               }
    //               onSelected={(value) => {
    //                 updateDataItemActive(value, index);
    //               }}
    //               items={statusList}
    //             >
    //               {item.is_active ? "مفعل" : "غير مفعل"}
    //             </UIPrimaryDropdown>
    //           </td>

    //           <td className="py-2 px-4">{item.renewal_date}</td>

    //           <td className="">
    //             <div className="flex justify-center items-center gap-3">
    //               <UIDialogConfirm
    //                 danger
    //                 title="هل انت متأكد من حذف العنصر"
    //                 confirmHandler={() => {
    //                   //@ts-ignore
    //                   deleteSubmit(item, index);
    //                 }}
    //               >
    //                 <button className="bg-[#F9285A0A] p-1 rounded-lg">
    //                   {/* <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span> */}
    //                   <div className="w-4 h-4">
    //                     <img className="w-full h-full object-contain" src={trashImg.src} alt="" />
    //                   </div>

    //                 </button>
    //               </UIDialogConfirm>

    //               <div className="w-4 h-4 cursor-pointer" onClick={() => router.push(`/users/details?id=${item.id}`)}>
    //                 <img className="w-full h-full object-contain" src={editImg.src} alt="" />
    //               </div>

    //             </div>
    //           </td>
    //         </tr>
    //       ))}
    //     </BaseDataTable>
    //   </div>
    // </>

    <>
      <div className="py-20">
        <BaseDataTable
          headItems={headerArr}
          items={dataList}
          onPageChange={setPage}
          totalPages={totalPages}
          onSearchChange={tableSearchHandler}
          headerActionsSlot={tableHeadActionsSlot()}
          checkedList={checkedList}
          onChecked={setCheckedList}
          showCheckList={true}
          renderers={{
            has_subscription: (item: Users) => (
              <div
                className={`rounded-lg py-1 text-center ${item.has_subscription
                  ? "text-[#31D000] bg-[#31D00012]"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
              >
                {item.has_subscription ? "مشترك" : "غير مشترك"}
              </div>
            ),
            is_request_recycle: (item: Users) => (
              <span>
                {item.has_subscription
                  ? item.is_request_recycle
                    ? "جمع وتدوير"
                    : "جمع فقط"
                  : "-"}
              </span>
            ),
            is_active: (item: Users, index: number) => (
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
            procedures: (item: Users, index: number) => (
              <div className="flex justify-center items-center gap-3">
                <UIDialogConfirm
                  danger
                  title="هل انت متأكد من حذف العنصر"
                  confirmHandler={() => deleteSubmit(item, index)}
                >
                  <button className="bg-[#F9285A0A] p-1 rounded-lg">
                    <div className="w-4 h-4">
                      <img
                        src={trashImg.src}
                        className="w-full h-full object-contain"
                        alt=""
                      />
                    </div>
                  </button>
                </UIDialogConfirm>

                <div
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => router.push(`/users/details?id=${item.id}`)}
                >
                  <img
                    src={editImg.src}
                    className="w-full h-full object-contain"
                    alt=""
                  />
                </div>
              </div>
            ),
          }}
        />
      </div>
    </>
  );
}
