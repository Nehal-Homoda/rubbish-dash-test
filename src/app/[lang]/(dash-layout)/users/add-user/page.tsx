"use client";

import TextFieldNada from "@/components/ui/form/TextFieldNada";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, Select, ToggleSwitch } from "flowbite-react";
import { addUserService } from "@/services/authServices";
import BaseDropDown from "@/components/shared/BaseDropDown";
import { districtListService } from "@/services/sharedService";
import { Region } from "@/types/regions.interface";

export default function page() {
  const [district, setDistrict] = useState<Region[]>([]);
  const takeValue = (e, name) => {
    console.log(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  //   const form = {
  //     name: "",
  //     phone: "",
  //     password: "",
  //   };

  const fetchDistrict = () => {
    districtListService().then((response) => {
      setDistrict(response.data);
    });
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formDate.name);
    fd.append("phone", formDate.phone);
    fd.append("password", formDate.password);

    addUserService(fd);
  };

  const handleSelectedDistrict = () => {};

  const [switch1, setSwitch1] = useState(false);
  const [formDate, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    district_id: "",
    package_id: "",
    payment_method_id: "",
    days: "",
    time_from: "",
    time_to: "",
    units: "",
    category_id: "",
    payment_verification: "",
    address_title: "",
    address_lat: "",
    address_lng: "",
    address_details: "",
  });

  useEffect(() => {
    fetchDistrict();
  }, []);

  return (
    <div>
      <div className="py-20">
        <div className="bg-white rounded-xl p-5 ">
          <p className="font-bold">اضافة مستخدم جديد</p>

          <form onSubmit={handleAddUserSubmit} className="pt-12">
            <div className="grid grid-cols-12 gap-7">
              <div className="col-span-12">
                <TextFieldNada
                  name="name"
                  type="text"
                  handleChange={(e) => takeValue(e, "name")}
                  value={formDate.name}
                  label="اسم المستخدم"
                  placeholder="اسم المستخدم"
                ></TextFieldNada>
              </div>
              <div className="col-span-6">
                <TextFieldNada
                  name="phone"
                  type="number"
                  handleChange={(e) => takeValue(e, "phone")}
                  value={formDate.phone}
                  label="رقم الموبايل"
                  placeholder=" رقم الموبايل"
                ></TextFieldNada>
              </div>
              <div className="col-span-6">
                <TextFieldNada
                  name="password"
                  type="password"
                  handleChange={(e) => takeValue(e, "password")}
                  value={formDate.password}
                  label="كلمة المرور"
                  placeholder="كلمة المرور"
                ></TextFieldNada>
              </div>
            </div>

            <div className=" ">
              <ToggleSwitch
                checked={switch1}
                label="اشتراك"
                onChange={setSwitch1}
              />
            </div>

            {switch1 && (
              <div className="mt-7">
                <div className="grid grid-cols-12">
                  <div className="col-span-6">
                    <div className="relative border border-surface-light-700 rounded-2xl">
                      <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                        <label htmlFor="district">المنطقه</label>
                      </div>

                      <Select className="" id="countries" required>
                        {district.map((item) => (
                          <option value={formDate.district_id}>{item.name_ar}</option>
                        ))}
                      </Select>
                      {/* {required && <span className="text-red-600">*</span>} */}
                    </div>
                  </div>
                  <div className="col-span-6">
                    <TextFieldNada
                      name="district"
                      type="text"
                      handleChange={(e) => takeValue(e, "password")}
                      value={formDate.address_title}
                      label=" العنوان"
                      placeholder=" العنوان"
                    ></TextFieldNada>
                  </div>
                </div>

                {/* <TextFieldNada
                  name="password"
                  type="password"
                  handleChange={(e) => takeValue(e, "password")}
                  value={formDate.password}
                  label="المنطقه "
                  placeholder=" المنطقه"
                ></TextFieldNada> */}
              </div>
            )}

            <div className="mx-auto w-[50%] flex gap-4">
              <button className="bg-[#009414] rounded-xl px-3 py-2 text-white w-full">
                اضافة
              </button>
              <button className="bg-[#00941412] text-[#009414] w-full rounded-xl px-3 py-2">
                الغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
