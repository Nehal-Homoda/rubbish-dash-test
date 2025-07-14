"use client";

import TextFieldNada from "@/components/ui/form/TextFieldNada";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, Select, ToggleSwitch } from "flowbite-react";
// import { addUserService } from "@/services/authServices";
import BaseDropDown from "@/components/shared/BaseDropDown";
import {
    districtListService,
    paymentMethodListService,
} from "@/services/sharedService";
import { Region } from "@/types/regions.interface";
import DatePicker from "@/components/ui/form/DatePicker";
import FileInput from "@/components/ui/form/FileInput";
import {
    getPackageByIdService,
    getPackagesService,
} from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { getCategoriesService } from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";
import SelectInput from "@/components/ui/form/SelectInput";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import { addUserService } from "@/services/userService";
import { useRouter } from "next/navigation";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { RadioGroup } from "@headlessui/react";

export default function page() {
    const [district, setDistrict] = useState<Region[]>([]);
    const [selectedDate, setSelectedDate] = useState();
    const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(
        null
    );
    const [totalPrice, setTotalPrice] = useState(0);
    const [districtDays, setDistrictDays] = useState<string[]>([]);
    const [districtTime, setDistrictTime] = useState<string[]>([]);
    const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentMethodList, setPaymentMethodList] = useState<
        Payment_methods[]
    >([]);
    const [selected, setSelected] = useState<null | Payment_methods>(null);

    const router = useRouter();

    //@ts-ignore
    const takeValue = (e, name) => {
        console.log(e.target.value);
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
        if (name == "units") {
            if (packageItem) {
                // setFormData((prev)=>({
                //   ...prev,

                // }))
                //@ts-ignore
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
            //@ts-ignore

            setDistrictDays([]);
            setDistrictTime([]);
        });
    };
    //@ts-ignore
    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        const t = formData.time_from.split("-");
        const fd = new FormData();

        fd.append("name", formData.name);
        fd.append("phone", formData.phone);
        fd.append("password", formData.password);
        if (switch1) {
            fd.append("district_id", formData.district_id);
            fd.append("category_id", formData.category_id);
            fd.append("start_date", formData.start_date);
            fd.append("address_title", formData.address_title);
            fd.append("time_from", t[0]);
            fd.append("time_to", t[1]);
            //@ts-ignore
            fd.append("has_subscription", formData.has_subscription);
            //@ts-ignore
            fd.append("units", formData.units);
            fd.append("package_id", formData.package_id);
            fd.append("payment_method_id", formData.payment_method_id);
            fd.append("address_lat", "34.1531");
            fd.append("address_lng", "34.1531");
            formData.days.forEach((day, index) =>
                fd.append(`days[${index}]`, day)
            );
        }

        addUserService(fd)
            .then((response) => {
                router.push("/users");
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
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

    const fetchPaymentList = () => {
        paymentMethodListService().then((response) => {
            setPaymentMethodList(response.data);
        });
    };

    const [switch1, setSwitch1] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "default-password",
        district_id: "",
        has_subscription: 0,
        package_id: "",

        payment_method_id: "",
        days: [],
        start_date: "",
        time_from: "",
        units: 1,
        category_id: "",
        payment_verification: "",
        address_title: "",
        address_lat: "34.1531",
        address_lng: "34.1531",
        address_details: "",
    });

    //@ts-ignore
    const takeUploadedImg = (img) => {
        console.log(img);
    };

    useEffect(() => {
        if (packageItem) {
            setTotalPrice(Number(packageItem.price_per_unit) * formData.units);
        }
    }, [formData.units]);
    useEffect(() => {
        if (packageItem) {
            setTotalPrice(Number(packageItem.price_per_unit) * formData.units);
        }
    }, [packageItem]);

    //@ts-ignore
    const handleSelectPackage = (value) => {
        setFormData((prev) => ({
            ...prev,
            ["package_id"]: value,
        }));
        getPackageByIdService(value).then((response) => {
            setPackageItem(response.data);
        });
    };

    const handleCheckSubscription = () => {
        setSwitch1(!switch1);
        setFormData((prev) => ({
            ...prev,
            ["has_subscription"]: 1,
        }));
    };

    //@ts-ignore
    const handleSelecteditem = (item) => {
        console.log("itemssssss", item);
        setSelected(item);
        setFormData((prev) => ({
            ...prev,
            ["payment_method_id"]: item.id,
        }));

        // console.log(e.target.value)
    };

    useEffect(() => {
        fetchDistrict();
        fetchPaymentList();
        fetchPackages();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (formData.district_id) {
            const ca = district.find(
                (item) => item.id.toString() == formData.district_id.toString()
            );

            if (ca) {
                setDistrictDays(ca.available_days);
                setDistrictTime(ca.available_times);
            }
        }
    }, [formData]);

    return (
        <div>
            <div className="py-20">
                <div className="bg-white rounded-xl p-5 ">
                    <div className="mb-14">
                        <p className="font-bold">اضافة مستخدم جديد</p>
                    </div>
                    {!!errorMessage && (
                        <p className="text-sm text-red-500 mb-10">
                            {errorMessage}
                        </p>
                    )}

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

                            <div className="col-span-12">
                                <TextFieldNada
                                    name="phone"
                                    type="number"
                                    handleChange={(e) => takeValue(e, "phone")}
                                    value={formData.phone}
                                    label="رقم الموبايل"
                                    placeholder=" رقم الموبايل"
                                ></TextFieldNada>
                            </div>
                            {/* <div className="col-span-6">
                                <TextFieldNada
                                    name="password"
                                    type="password"
                                    handleChange={(e) =>
                                        takeValue(e, "password")
                                    }
                                    value={formData.password}
                                    label="كلمة المرور"
                                    placeholder="كلمة المرور"
                                ></TextFieldNada>
                            </div> */}
                        </div>

                        <div className="py-6 ">
                            <ToggleSwitch
                                checked={switch1}
                                label="اشتراك"
                                onChange={handleCheckSubscription}
                            />
                        </div>

                        {switch1 && (
                            <div className="mt-5">
                                <div className="grid grid-cols-12 gap-7">
                                    <div className="col-span-6">
                                        <SelectInput
                                            placeholder="ادخل اسم المنطقة"
                                            name="name_ar"
                                            itemName="name_ar"
                                            itemValue="id"
                                            value={formData.district_id}
                                            items={district}
                                            label="اسم المنطقة"
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["district_id"]: value,
                                                }))
                                            }
                                        ></SelectInput>

                                        {/* {required && <span className="text-red-600">*</span>} */}
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="address"
                                            type="text"
                                            handleChange={(e) =>
                                                takeValue(e, "address_title")
                                            }
                                            value={formData.address_title}
                                            label=" العنوان"
                                            placeholder=" العنوان"
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <SelectInput
                                            items={categoryList}
                                            placeholder="ادخل نوع الخدمة"
                                            name=""
                                            itemName="name_ar"
                                            itemValue="id"
                                            value={formData.category_id}
                                            label=" نوع الخدمة"
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["category_id"]: value,
                                                }))
                                            }
                                        ></SelectInput>
                                    </div>

                                    <div className="col-span-6">
                                        <SelectInput
                                            items={packagesList}
                                            placeholder="ادخل نوع الباقه"
                                            name=""
                                            itemName="name_ar"
                                            itemValue="id"
                                            value={formData.package_id}
                                            label=" نوع الباقة"
                                            onChange={(value) =>
                                                handleSelectPackage(value)
                                            }
                                        ></SelectInput>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="price"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "units")
                                            }
                                            value={
                                                packageItem
                                                    ? packageItem.price_per_unit
                                                    : 0
                                            }
                                            label=" سعر الباقة "
                                            placeholder="  سعر الباقة "
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="units"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "units")
                                            }
                                            value={formData.units.toString()}
                                            label=" عدد الوحدات "
                                            placeholder=" عدد الوحدات "
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="price"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "price")
                                            }
                                            value={totalPrice.toString()}
                                            label="السعر الكلي "
                                            placeholder="  السعر الكلي "
                                        ></TextFieldNada>
                                    </div>
                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="start_date"
                                            type="date"
                                            handleChange={(e) =>
                                                takeValue(e, "start_date")
                                            }
                                            value={formData.start_date}
                                            label="تاريخ البدأ "
                                            placeholder="  السعر الكلي *"
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <MultiCheckbox
                                            items={districtDays}
                                            value={formData.days}
                                            label="اليوم"
                                            required={true}
                                            name="available_days"
                                            placeholder="اختر اليوم"
                                            prependIcon="mdi mdi-calendar-month-outline"
                                            iconType="mdi"
                                            onChange={(value) => {
                                                //@ts-ignore
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["days"]: value,
                                                }));
                                            }}
                                        ></MultiCheckbox>
                                    </div>
                                    <div className="col-span-6">
                                        <SelectInput
                                            items={districtTime}
                                            placeholder="اختر الوقت"
                                            name=""
                                            value={formData.time_from}
                                            label=" الوقت"
                                            onChange={(value) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["time_from"]: value,
                                                }));
                                            }}
                                        ></SelectInput>
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
                                                                `${
                                                                    active
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
                                                                                    className={`font-medium  ${
                                                                                        checked
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
                                                                                {/* <CheckIcon className="h-6 w-6" /> */}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="shrink-0 w-4 h-4 rounded-full ring-1 ring-surface text-surface flex justify-center items-center">
                                                                                {/* <CheckIcon className="h-6 w-6" /> */}
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
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mx-auto w-[50%] py-5 flex justify-center">
                            <button
                                type="submit"
                                className="bg-[#009414] rounded-xl px-3 py-4 text-white min-w-[225px] "
                            >
                                اضافة
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
