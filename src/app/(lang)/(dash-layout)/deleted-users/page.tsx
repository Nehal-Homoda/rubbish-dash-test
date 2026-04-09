'use client'

import BaseDataTable from '@/components/data-tables/BaseDataTable';
import UIPrimaryDropdown from '@/components/ui/UIPrimaryDropdown';
import { getDeletedUserService, restoreUserService } from '@/services/userService';
import { Users } from '@/types/auth.interface';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import editImg from '@/assets/images/icons/edit.png'


export default function page() {
  const [dataList, setDataList] = useState<Users[]>([]);
  const router = useRouter()
  const headerArr = [
    { text: "ID", name: "id" },
    { text: "اسم المستخدم", name: "name" },
    { text: "رقم الموبيل", name: "phone" },
    { text: " الاشتراك", name: "has_subscription" },
    { text: "الصورة الشخصية", name: "image" },
    { text: "تاريخ الحذف", name: "created_at" },
    { text: "الاجراءات", name: "procedures" },
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

    const query = `?page=${page}${hasSearch}${isActive}${isSubscribe}`;

    getDeletedUserService(query).then((response) => {
      //@ts-ignore
      setDataList(response.data);
      // response.data.map((item, index) => {
      //   setDistrictDays(item.available_days);
      //   setDistrictTime(item.available_times);
      // });
      // setTotalPages(response.meta.last_page);
    }).catch(() => {

    })
  };


  const tableHeadActionsSlot = () => {
    return (
      <>





        {/* <UIPrimaryDropdown
          items={statusList}
          itemName="name"
          itemValue="is_active"
          onSelected={(value) => {
            fetchDataList({ is_active: value });
          }}
        >
          الحالة
        </UIPrimaryDropdown> */}

        {/* <UIPrimaryDropdown
          items={hasSubscriptionList}
          itemName="name"
          itemValue="is_subscribe"
          onSelected={(value) => {
            fetchDataList({ is_subscription: value });
          }}
        >
          الاشتراك
        </UIPrimaryDropdown> */}





      </>
    );
  };

  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchDataList({ search: e.target.value });
  };


  const handleRestoreUser = async (itemId: number) => {
    await restoreUserService(itemId).then((response) => {
      console.log('response', response.data)
      fetchDataList()

    })



  }

  useEffect(() => {
    fetchDataList();
  }, [page]);
  return (
    <div>
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
            procedures: (item, index: number) => (
              <div className="">
                <button onClick={() => handleRestoreUser(item.id)} className="border border-green-700 text-green-700 p-1 px-2 rounded-lg">
                  <div className=" cursor-pointer">

                    <span>Restore</span>
                  </div>
                </button>

              </div>
            ),


          }}
        >
        </BaseDataTable>
      </div>


    </div>
  )
}
