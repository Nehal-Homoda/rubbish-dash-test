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
import SelectInput from "@/components/ui/form/SelectInput";

export default function page() {
  const [district, setDistrict] = useState<Region[]>([]);
  const [selectedDate, setSelectedDate] = useState();
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
  const [categoryList, setCategoryList] = useState<Categories[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(
    null
  );
  const [packagePrice, setPackagePrice] = useState(0)
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

  const handleSelectedItem = (item: any, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: item
    }))
    if (name == "package_id") {
      setPackagePrice(item.price_per_unit)
    }

  };

  const takeUploadedImg = (img) => {
    console.log(img)

  }

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
  useEffect(() => {
    setPackagePrice
  }, [formData.package_id])

  return (
    <div>
      <div className="py-20">
        <div className="bg-white rounded-xl p-5 ">


          <div className="mb-14">
            <p className="font-bold">اضافة مستخدم جديد</p>
          </div>

          <form onSubmit={handleAddUserSubmit} className="">



            <div className="grid grid-cols-12 space-y-5 gap-7">


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

            <div className="py-6 ">
              <ToggleSwitch
                checked={switch1}
                label="اشتراك"
                onChange={setSwitch1}
              />
            </div>

            {switch1 && (
              <div className="mt-5">


                <div className="grid grid-cols-12 gap-7">
                  <div className="col-span-6">

                    <SelectInput placeholder="ادخل اسم المنطقة" name="name_ar" itemName="name_ar" itemValue="id" value={formData.district_id} items={district} label="اسم المنطقة" onChange={(item) => handleSelectedItem(item, 'district_id')} >

                    </SelectInput>

                    {/* {required && <span className="text-red-600">*</span>} */}
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
                    <SelectInput items={categoryList} placeholder="ادخل نوع الخدمة" name="" itemName="name_ar" itemValue="id" value={formData.category_id} label=" نوع الخدمة" onChange={(item) => handleSelectedItem(item, 'category_id')} >

                    </SelectInput>
                  </div>

                  <div className="col-span-6">
                    <SelectInput items={packagesList} placeholder="ادخل نوع الباقه" name="" itemName="name_ar" itemValue="id" value={formData.package_id} label=" نوع الباقة" onChange={(item) => handleSelectedItem(item, 'package_id')} >

                    </SelectInput>
                  </div>

                  <div className="col-span-6">
                    <TextFieldNada
                      name="price"
                      type="number"
                      handleChange={(e) => takeValue(e, "units")}
                      value={packagePrice}
                      label=" سعر الباقة *"
                      placeholder="  سعر الباقة *"
                    ></TextFieldNada>

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
                      placeholder="  السعر الكلي *"
                    ></TextFieldNada>
                  </div>

                  <div className="col-span-6">
                    <FileInput onFileChange={(img) => takeUploadedImg(img)} state="add" title="ارفاق صورة التحويل" />
                  </div>


                </div>





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
