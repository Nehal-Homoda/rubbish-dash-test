"use client";

import TextFieldNada from "@/components/ui/form/TextFieldNada";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, Select, ToggleSwitch } from "flowbite-react";
import { addUserService } from "@/services/authServices";
import BaseDropDown from "@/components/shared/BaseDropDown";
import { districtListService } from "@/services/sharedService";
import { Region } from "@/types/regions.interface";
import DatePicker from "@/components/ui/form/DatePicker";
import FileInput from "@/components/ui/form/FileInput";
import { getPackagesService } from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { getCategoriesService } from "@/services/categoriesService";
import { Categories } from "@/types/categories.interface";

export default function page() {
  const [district, setDistrict] = useState<Region[]>([]);
  const [selectedDate, setSelectedDate] = useState();
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
  const [categoryList, setCategoryList] = useState<Categories[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(
    null
  );
  const [totalPrice, setTotalPrice] = useState(0);

  const takeValue = (e, name) => {
    console.log(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    if (name == "units") {
      if (selectedPackage) {
        setTotalPrice(selectedPackage.price_per_unit * formData.units);
      }
    }
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
    fd.append("name", formData.name);
    fd.append("phone", formData.phone);
    fd.append("password", formData.password);

    addUserService(fd);
  };

  const handleSelectedDistrict = () => {};

  const handleSelectedDate = (date) => {
    console.log("hi");
    console.log(formData.days);
    setSelectedDate(date);
  };

  const fetchPackages = () => {
    getPackagesService().then((response) => {
      console.log(response);
      setpackagesList(response.data);
    });
  };

  const fetchCategories = () => {
    getCategoriesService().then((response) => {
      setCategoryList(response.data);
    });
  };
  const takeSelectedPackage = (e) => {
    const selectedId = e.target.value;
    const selectedPackage = packagesList.find((item) => {
      return item.id == selectedId;
    });
    if (selectedPackage) {
      setSelectedPackage(selectedPackage);
      setTotalPrice(selectedPackage.price_per_unit * formData.units);
    }
  };
  const takeSelectedCategory = (e) => {
    const selectedId = e.target.value;
    const selectedCategoryItem = categoryList.find((item) => {
      return item.id == selectedId;
    });
    if (selectedCategoryItem) {
      setSelectedCategory(selectedCategoryItem);
    }
  };
  const [switch1, setSwitch1] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    district_id: "",
    package_id: "",
    payment_method_id: "",
    days: new Date(),
    time_from: "",
    time_to: "",
    units: 1,
    category_id: "",
    payment_verification: "",
    address_title: "",
    address_lat: "",
    address_lng: "",
    address_details: "",
  });

  useEffect(() => {
    if (selectedPackage) {
      setTotalPrice(selectedPackage.price_per_unit * formData.units);
    }
  }, [formData.units]);

  useEffect(() => {
    fetchDistrict();
  }, []);

  useEffect(() => {
    fetchPackages();
    fetchCategories();
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
                  value={formData.name}
                  label="اسم المستخدم"
                  placeholder="اسم المستخدم"
                ></TextFieldNada>
              </div>
              <div className="col-span-6">
                <TextFieldNada
                  name="phone"
                  type="number"
                  handleChange={(e) => takeValue(e, "phone")}
                  value={formData.phone}
                  label="رقم الموبايل"
                  placeholder=" رقم الموبايل"
                ></TextFieldNada>
              </div>
              <div className="col-span-6">
                <TextFieldNada
                  name="password"
                  type="password"
                  handleChange={(e) => takeValue(e, "password")}
                  value={formData.password}
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
                <div className="grid grid-cols-12 gap-7">
                  <div className="col-span-6">
                    <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                      <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                        <label htmlFor="district">المنطقه</label>
                      </div>

                      <select
                        className="border-none outline-none  "
                        id="district"
                        required
                      >
                        {district.map((item) => (
                          <option value={item.id}>
                            {item.name_ar}
                          </option>
                        ))}
                      </select>

                      {/* {required && <span className="text-red-600">*</span>} */}
                    </div>
                  </div>

                  <div className="col-span-6">
                    <TextFieldNada
                      name="address"
                      type="text"
                      handleChange={(e) => takeValue(e, "address_title")}
                      value={formData.address_title}
                      label=" العنوان"
                      placeholder=" العنوان"
                    ></TextFieldNada>
                  </div>

                  <div className="col-span-6">
                    <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                      <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                        <label htmlFor="category">نوع الخدمة</label>
                      </div>

                      <select
                       
                        onChange={takeSelectedCategory}
                        className="w-full h-full"
                        id="category"
                        required
                      >
                        {categoryList.map((item,index) => (
                          <option key={index} value={item.id}>{item.name_ar}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                      <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                        <label htmlFor="package">الباقة</label>
                      </div>

                      <select
                       
                        onChange={takeSelectedPackage}
                        className=""
                        id="package"
                        required
                      >
                        {packagesList.map((item,index) => (
                          <option key={index} value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <TextFieldNada
                      name="units"
                      type="number"
                      handleChange={(e) => takeValue(e, "units")}
                      value={formData.units.toString()}
                      label=" عدد الوحدات *"
                      placeholder=" عدد الوحدات *"
                    ></TextFieldNada>
                  </div>


                  <div className="col-span-6">
                    <TextFieldNada
                      name="price"
                      type="number"
                      handleChange={(e) => takeValue(e, "price")}
                      value={totalPrice.toString()}
                      label="السعر الكلي *"
                      placeholder=" عدد الوحدات *"
                    ></TextFieldNada>
                  </div>

                  <div className="col-span-6">
                    <FileInput state="add" title="ارفاق صورة التحويل" />
                  </div>


                </div>

                {/* <TextFieldNada
                  name="password"
                  type="password"
                  handleChange={(e) => takeValue(e, "password")}
                  value={formData.password}
                  label="المنطقه "
                  placeholder=" المنطقه"
                ></TextFieldNada> */}
              </div>
            )}

            <div className="mx-auto w-[50%] py-5 flex gap-4">
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
