"use client";

import React, { useEffect, useState } from "react";
import CustomDataTable from "@/components/data-tables/customDataTable";
import {
  activateUserService,
  filterUserBySearchService,
  filterUserByStateService,
  filterUserBySubscriptionService,
  subscriptionListService,
  userListByPageService,
  userListService,
} from "@/services/sharedService";
import DropDown from "@/components/shared/StateDropDown";
import BaseDropDown from "@/components/shared/BaseDropDown";
import { Avatar } from "flowbite-react";
import { getPackagesService } from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { useRouter } from "next/navigation";

export default function rubbush_collectors() {
  interface User {
    id: number;
    created_at: string;
    name: string;
    phone: string;
    image: string;
    subscription_name: string;
    is_active: boolean;
    renewal_date: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptionList, setSubscriptionList] = useState<PackageOffer[]>([]);
  const router = useRouter();
  const headerArr = [
    { text: "ID", name: "id" },
    { text: "اسم المستخدم", name: "name" },
    { text: "رقم الموبيل", name: "phone" },
    { text: " الاشتراك", name: "subscription_name" },
    { text: "نوع الاشتراك", name: "subscription_name" },
    { text: "الصورة الشخصية", name: "image" },
    { text: "الحالة", name: "is_active" },
    { text: "ميعاد التجديد", name: "renewal_date" },
    { text: "الاجراءات", name: "" },
  ];

  const areas = [
    { id: 1, name: "حي اول طنطا" },
    { id: 2, name: "حي ثان طنطا" },
    { id: 3, name: "حي ثالث طنطا" },
  ];
  const statusList = [
    { is_active: 1, name: "مفعل" },
    { is_active: 0, name: "غير مفعل" },
  ];

  const hasSubscriptionList = [
    { is_subscribe: 1, name: "مشترك" },
    { is_subscribe: 0, name: "غير مشترك" },
  ];

  const [filteredArr, setFilteredArr] = useState<User[]>([]);
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [page, setPage] = useState(1);
  const [userIsActive, setUserIsActive] = useState(false);

  const fetchUserList = (pageNumber) => {
    userListByPageService(pageNumber).then((response) => {
      console.log(response);
      setUsers(response.data);
      // setFilteredArr(response.data);
    });
  };
  const fetchPackages = () => {
    getPackagesService().then((response) => {
      console.log(response);
      setSubscriptionList(response.data);
    });
  };

  const filterUserBySearch = (pageNumber, searchValue) => {
    filterUserBySearchService(pageNumber, searchValue).then((response) => {
      setUsers(response.data);
    });
  };
  const takeValue = (e) => {
    console.log("sjkdhfu");
    console.log(e);
    filterUserBySearch(page, e);
  };

  const filterUserByState = (selectedItem) => {
    console.log(selectedItem.is_active);
    filterUserByStateService(page, selectedItem.is_active).then((response) => {
      setUsers(response.data);
      console.log("yes im active");
    });
  };

  const takeSelectedPage = (pageNum: number) => {
    console.log(pageNum);
    // setPage(pageNum)

    fetchUserList(pageNum);
  };

  const filterBySubscription = (selectedSubscription) => {
    console.log(selectedSubscription.is_subscribe);
    filterUserBySubscriptionService(
      page,
      selectedSubscription.is_subscribe
    ).then((response) => {
      setUsers(response.data);
    });
  };

  const takeCheckValue = (e) => {
    console.log("input checked", e.target.checked);
    setCheckBoxValue(e.target.checked);
  };

  const goToAddPage = () => {
    router.push(`/users/add-user`);
  };

  const updateUserActive = (selectedItem, itemIndex) => {
    console.log("item", selectedItem);
    console.log("index", itemIndex);
    const user = users.find((item, index) => {
      return index == itemIndex;
    });
    if (!user) return;
    const newIsActive = user.is_active ? 0 : 1;
    activateUserService(user.id, newIsActive).then((response) => {
      const arr = users.map((item, index) => {
        if (index == itemIndex) {
          console.log("user is", item);
          return { ...item, is_active: newIsActive };
        }
        return item;
      });
      setUsers(arr);

      console.log(response);
    });
  };

  useEffect(() => {
    setFilteredArr(users);
  }, [users]);

  useEffect(() => {
    fetchUserList(1);
    fetchPackages();
    // fetchSubscriptionList()
  }, []);

  // const fetchSubscriptionList = () => {
  //   subscriptionListService().then((response) => {
  //     console.log(response);
  //     setSubscriptionList(response.data)
  //     // setUsers(response.data);
  //     // setFilteredArr(response.data);
  //   });
  // };

  // const sortList = (headItem, type: string) => {
  //   const itemKey = headItem.name;
  //   // const itemValue = users.map((item) => {
  //   //   return item[itemKey];
  //   // });
  //   // console.log(itemValue);
  //   // const sortedUser = itemValue.sort((a, b) => a - b);
  //   // console.log(sortedUser);

  //   const sortedUser = [...(filteredArr || [])].sort((a, b) => {
  //     const valA = a[itemKey];
  //     const valB = b[itemKey];

  //     if (type == "asc") {
  //       return valA - valB;
  //     }
  //     if (type == "desc") {
  //       return valB - valA;
  //     }
  //   });
  //   console.log(sortedUser);
  //   setFilteredArr(sortedUser);
  // };

  // const filterUser = (selectedItem, selectedIndex) => {
  //   console.log("selected", selectedItem);
  //   console.log("index", index);
  //   const arr = users.map((item, index) => {
  //     return item.subscription_name == selectedItem.name;

  //     if (index == selectedIndex) {
  //       return;
  //     }
  //     return item;
  //   });
  // };

  return (
    <>
      <div className="py-20">
        <CustomDataTable
          selectedPage={(pageNum: number) => takeSelectedPage(pageNum)}
          handleAllCheck={takeCheckValue}
          sendValueToParent={(value) => takeValue(value)}
          tableHead={headerArr}
          listItem={users}
          tData={(item, index) => (
            <>
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{item.phone}</td>
              <td className="py-2 px-4">
                {item.has_subscription ? "مشترك" : "غير مشترك"}
              </td>
              <td className="py-2 px-4">{item.subscription_name}</td>
              <td className="py-2 px-4">
                <Avatar
                  color="success"
                  placeholderInitials={item.name.slice(0, 2)}
                  rounded
                />
                {/* <div className=" w-7 h-7 rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-contain"
                          src={item.image}
                          alt=""
                        />
                      </div> */}
              </td>
              <td className="py-2 px-4">
                <DropDown
                  handleIsActive={(item) => updateUserActive(item, index)}
                  btnName={item.is_active ? "مفعل" : "غير مفعل"}
                  isActive={item.is_active}
                />
              </td>
              <td className="">{item.renewal_date}</td>
              <td className="">{item.renewal_date}</td>
            </>
          )}
        >
          {/* <div className='bg-[#0094140D]  text-center rounded-xl text-[#009414]'>
            <Dropdown value={location} onChange={(e) => handleFilterChange(e, 'area')} options={areas} optionLabel="name"
              placeholder="المنطقة" className="w-full md:w-14rem border-0 bg-transparent font-bold " />
          </div> */}

          {/* <div className='bg-[#0094140D]  text-center rounded-xl text-[#009414]'>
            <BaseDropDown btnName="المنطقة" listItem={areas}></BaseDropDown>
          </div>
 */}

          <div className="bg-[#0094140D]  text-center rounded-xl ">
            {/* <Dropdown value={status} onChange={(e) => handleFilterChange(e, 'status')} options={statusList} optionLabel="name"
              placeholder="الحالة" className="w-full md:w-14rem border-0 bg-transparent font-bold " /> */}
            <BaseDropDown
              handleFilterList={(item, index) => filterUserByState(item)}
              btnName="الحالة"
              listItem={statusList}
            ></BaseDropDown>
          </div>

          <div className="bg-[#0094140D]  text-center rounded-xl ">
            {/* <Dropdown value={subscribe} onChange={(e) => handleFilterChange(e, 'subscription')} options={subscriptionList} optionLabel="name"
              placeholder="الاشتراك" className="w-full md:w-14rem border-0 bg-transparent font-bold " /> */}
            <BaseDropDown
              handleFilterList={(item, index) => filterBySubscription(item)}
              btnName="الاشتراك"
              listItem={hasSubscriptionList}
            ></BaseDropDown>
          </div>

          <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
            <button onClick={goToAddPage} className="w-full h-full">
              اضافة مستخدم
            </button>
          </div>
        </CustomDataTable>
      </div>
    </>
  );
}