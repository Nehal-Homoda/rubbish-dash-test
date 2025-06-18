"use client";

import React, { useEffect, useState } from "react";
import CustomDataTable from "@/components/data-tables/customDataTable";
import { userListService } from "@/services/sharedService";
import DropDown from "@/components/shared/StateDropDown";
import BaseDropDown from "@/components/shared/BaseDropDown";

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
  const headerArr = [
    { text: "ID", name: "id" },
    { text: "اسم المستخدم", name: "name" },
    { text: "رقم الموبيل", name: "phone" },
    { text: "الاشتراك", name: "subscription_name" },
    { text: "الصورة الشخصية", name: "image" },
    { text: "الحالة", name: "is_active" },
    { text: "ميعاد التجديد", name: "renewal_date" },
    { text: "الاجراءات", name: "" },
  ];

  const areas = [
    { id: 1, name: "حي اول طنطا" },
    { id: 2, name: "حي ثان طنطا" },
    { id: 3, name: "حي ثالث طنطا" },
  ]
  const statusList = [
    { id: 1, name: 'مفعل' },
    { id: 2, name: 'غير مفعل' },
    { id: 3, name: 'معلق' },
  ]

  const subscriptionList = [
    { id: 1, name: 'مشترك/شهرية' },
    { id: 2, name: 'مشترك/3شهور' },
    { id: 3, name: 'غير مشترك' },
    { id: 4, name: 'مشترك/6شهور' },
  ]



  const [filteredArr, setFilteredArr] = useState<User[]>([]);
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [userIsActive, setUserIsActive] = useState(false)

  const takeValue = (e) => {
    console.log("sjkdhfu");
    console.log(e);
    const x = users.filter((item) => {
      return item.name.includes(e);
    });

    setFilteredArr([...x]);
    // setFilteredArr(x)

    console.log(filteredArr);
  };

  const fetchUserList = () => {
    userListService(1).then((response) => {
      console.log(response);
      setUsers(response.data);
      setFilteredArr(response.data);
    });
  };
  const takeCheckValue = (e) => {
    console.log("input checked", e.target.checked);
    setCheckBoxValue(e.target.checked);
  };

  const sortList = (headItem, type: string) => {
    const itemKey = headItem.name;
    // const itemValue = users.map((item) => {
    //   return item[itemKey];
    // });
    // console.log(itemValue);
    // const sortedUser = itemValue.sort((a, b) => a - b);
    // console.log(sortedUser);

    const sortedUser = [...filteredArr || []].sort((a, b) => {
      const valA = a[itemKey];
      const valB = b[itemKey];
      if (type == 'asc') {
        return valA - valB;

      }
      if (type == 'desc') {
        return valB - valA;

      }

    });
    console.log(sortedUser)
    setFilteredArr(sortedUser)
  };


  const updateUserActive = (selectedItem, itemIndex) => {

    console.log('item', selectedItem)
    console.log('index', itemIndex)
    handleActivation(selectedItem.text, itemIndex)




  }

  const handleActivation = (state: string, itemIndex: number) => {
    const arr = users.map((item, index) => {
      if (index == itemIndex) {
        if (state == 'غير مفعل') {
          return { ...item, ['is_active']: false }

        }
        // if(state=='مفعل'){
        //   return { ...item, ['is_active']:true }

        // }
        return { ...item, ['is_active']: true }


      }

      return item
    })
    setUsers(arr)
  }

  // const itemKey = headItem.name;
  //   users[itemKey].sort((a, b) => a - b);
  //   console.log(itemKey);
  // };

  useEffect(() => {
    setFilteredArr(users);
  }, [users]);

  useEffect(() => {
    fetchUserList();
  }, []);
  return (
    <>
      {" "}
      <div>
        rubbush_collectors
        <CustomDataTable
          handleSort={sortList}
          handleAllCheck={takeCheckValue}
          sendValueToParent={(value) => takeValue(value)}
          tableHead={headerArr}
          tRow={
            <>
              {filteredArr &&
                filteredArr.map((item, index) => (
                  <tr
                    key={index}
                    className=" bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-8">
                      <div className="flex items-center">
                        <input
                          checked={checkBoxValue}
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="">{item.phone}</td>
                    <td className="px-6 py-4">{item.subscription_name}</td>
                    <td className="px-16 py-4">
                      <div className=" w-7 h-7 rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-contain"
                          src={item.image}
                          alt=""
                        />
                      </div>
                    </td>
                    <td className="">
                      <DropDown
                        handleIsActive={(item) => updateUserActive(item, index)}
                        btnName={item.is_active ? "مفعل" : "غير مفعل"}
                        isActive={item.is_active}
                      />
                    </td>
                    <td className="">{item.renewal_date}</td>
                  </tr>
                ))}
            </>
          }
        >

          <div className='bg-[#0094140D]  text-center rounded-xl text-[#009414]'>
            {/* <Dropdown value={location} onChange={(e) => handleFilterChange(e, 'area')} options={areas} optionLabel="name"
              placeholder="المنطقة" className="w-full md:w-14rem border-0 bg-transparent font-bold " /> */}
            <BaseDropDown btnName="المنطقة" listItem={areas}></BaseDropDown>
          </div>





          <div className='bg-[#0094140D]  text-center rounded-xl '>
            {/* <Dropdown value={status} onChange={(e) => handleFilterChange(e, 'status')} options={statusList} optionLabel="name"
              placeholder="الحالة" className="w-full md:w-14rem border-0 bg-transparent font-bold " /> */}
            <BaseDropDown btnName="الحالة" listItem={statusList}></BaseDropDown>

          </div>


          <div className='bg-[#0094140D]  text-center rounded-xl '>
            {/* <Dropdown value={subscribe} onChange={(e) => handleFilterChange(e, 'subscription')} options={subscriptionList} optionLabel="name"
              placeholder="الاشتراك" className="w-full md:w-14rem border-0 bg-transparent font-bold " /> */}
            <BaseDropDown btnName="الاشتراك" listItem={subscriptionList}></BaseDropDown>
          </div>

          <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
            <button className="w-full h-full">اضافة مستخدم</button>
          </div>
        </CustomDataTable>
      </div>
    </>
  );
}
